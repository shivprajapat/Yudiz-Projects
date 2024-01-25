import React from 'react'
import PropTypes from 'prop-types'
import { useAmp } from 'next/amp'
import dynamic from 'next/dynamic'

import queryGraphql from '@shared-components/queryGraphql'
import { GET_ARTICLE_ID, GET_ARTICLE_DETAILS, GET_RELATED_STORIES } from '@graphql/article/article.query'
import { GET_FANTASY_DETAILS, GET_FANTASY_RELATED_STORIES } from '@graphql/fantasy-tips/fantasy-tips.query'
import { pageLoading } from '@shared/libs/allLoader'
import { allRoutes } from '@shared/constants/allRoutes'
import Error from '@shared/components/error'
import CategoryContent from '@shared/components/categoryContent'
import { GET_CATEGORY_BY_ID } from '@graphql/category/category.query'
import { GET_FANTASY_ARTICLE_OF_CATEGORY } from '@graphql/series/home.query'
import { payload } from '@shared/libs/category'
import { checkRedirectionStatus, handleApiError, hasAmpInQueryParams, isAMPEnable } from '@shared/utils'

const ArticleDetail = dynamic(() => import('@shared/components/articleDetail'), { loading: () => pageLoading() })
const ArticleDetailAMP = dynamic(() => import('@shared/components/amp/articleDetailAMP'), { loading: () => pageLoading() })
const FantasyArticleContent = dynamic(() => import('@shared/components/articleDetail/fantasyArticleContent'))
const ArticleFantasyContentAMP = dynamic(() => import('@shared/components/amp/articleFantasyContentAMP'))
const ArticleContent = dynamic(() => import('@shared/components/articleDetail/articleContent'))
const ArticleContentAMP = dynamic(() => import('@shared/components/amp/articleContentAMP'), { loading: () => pageLoading() })
const SeriesFantasyArticle = dynamic(() => import('@shared/components/series/seriesFantasyArticle'), { loading: () => pageLoading() })

export const config = { amp: 'hybrid' }
function FantasyArticle({ seoData, fantasyArticle, error, type, category, playerData, article, latestArticles }) {
  const isAmp = useAmp()

  if (!error) {
    if (type === 'ct') {
      return (
        <CategoryContent seoData={seoData} category={category} isFantasyArticle>
          {() => (
            <SeriesFantasyArticle data={fantasyArticle} category={category} />
          )}
        </CategoryContent>
      )
    } else if (type === 'ar' && !isAmp) {
      return (
        <ArticleDetail seoData={seoData} article={article} type='article'>
          <ArticleContent article={article} />
        </ArticleDetail>
      )
    } else if (type === 'ar' && isAmp) {
      return (
        <ArticleDetailAMP seoData={seoData} article={article} latestArticles={latestArticles?.aResults}>
          <ArticleContentAMP seoData={seoData} article={article} />
        </ArticleDetailAMP>
      )
    } else if (isAmp) {
      return (
        <ArticleDetailAMP seoData={seoData} latestFantasyArticles={latestArticles} article={fantasyArticle?.data?.getFrontFantasyArticle} >
          <ArticleFantasyContentAMP article={fantasyArticle?.data?.getFrontFantasyArticle} playerData={playerData} />
        </ArticleDetailAMP>
      )
    } else {
      return (
        <ArticleDetail seoData={seoData} article={fantasyArticle?.data?.getFrontFantasyArticle} type='fantasyArticle'>
          <FantasyArticleContent data={fantasyArticle?.data?.getFrontFantasyArticle} />
        </ArticleDetail>
      )
    }
  }
}

FantasyArticle.propTypes = {
  seoData: PropTypes.object,
  fantasyArticle: PropTypes.object,
  error: PropTypes.any,
  type: PropTypes.string,
  category: PropTypes.object,
  article: PropTypes.object,
  playerData: PropTypes.array,
  latestArticles: PropTypes.object
}

export default Error(FantasyArticle)

export async function getServerSideProps({ req, res, params, query }) {
  // Check amp exists in query params
  const { hasAmp, redirectionRules } = hasAmpInQueryParams(req?.url)
  if (hasAmp) return redirectionRules

  try {
    const { token } = req?.cookies
    const slug = params.slug
    const newSlug = allRoutes.fantasyCricketTips.substring(1) + slug.join('/')
    const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: newSlug } })
    res.setHeader('Cache-Control', 'public, max-age=420')
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(idData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    if (idData?.getSeoData?.eType === 'ct') { // Category
      const { data: categoryData } = await queryGraphql(GET_CATEGORY_BY_ID, { input: { _id: idData?.getSeoData?.iId } }, token)
      const { data: fantasyArticle } = await queryGraphql(GET_FANTASY_ARTICLE_OF_CATEGORY, { input: { ...payload(7), iId: idData?.getSeoData?.iId } })
      return {
        props: {
          seoData: idData?.getSeoData,
          fantasyArticle: fantasyArticle?.listFrontTagCategoryFantasyArticle,
          type: idData?.getSeoData?.eType,
          category: categoryData.getCategoryByIdFront
        }
      }
    }
    if (idData?.getSeoData?.eType === 'fa') { // Fantasy article
      const value = await queryGraphql(GET_FANTASY_DETAILS, { input: { _id: idData?.getSeoData?.iId } })
      // const playerData = await queryGraphql(GET_FANTASY_PLAYER_DATA, { input: { iMatchId: value?.data?.getFrontFantasyArticle?.oMatch?._id, ePlatformType: value?.data?.getFrontFantasyArticle?.ePlatformType } })

      // Check amp is enable from backend or not
      const { isRedirect, redirectObj } = isAMPEnable(value?.data?.getFrontFantasyArticle, query)
      if (isRedirect) return redirectObj

      if (req?.url.includes('?amp=1')) {
        const { data: latestFantasyArticles } = await queryGraphql(GET_FANTASY_RELATED_STORIES, { input: { oGetRelatedFantasyStoriesIdInput: { iCategoryId: value?.data?.getFrontFantasyArticle?.iCategoryId, iFantasyArticleId: idData?.getSeoData?.iId }, oPaginationInput: { nLimit: 3, nSkip: 3 } } })

        return {
          props: {
            seoData: idData?.getSeoData,
            fantasyArticle: value,
            type: idData?.getSeoData?.eType,
            // playerData: playerData?.data?.listFantasyPlayersInfo
            latestArticles: latestFantasyArticles?.getRelatedFantasyStories
          }
        }
      } else {
        return {
          props: {
            seoData: idData?.getSeoData,
            fantasyArticle: value,
            type: idData?.getSeoData?.eType
            // playerData: playerData?.data?.listFantasyPlayersInfo
          }
        }
      }
    }
    if (idData?.getSeoData?.eType === 'ar') { // Article
      const { data } = await queryGraphql(GET_ARTICLE_DETAILS, { input: { _id: idData?.getSeoData?.iId } })

      // Check amp is enable from backend or not
      const { isRedirect, redirectObj } = isAMPEnable(data?.getArticleFront, query)
      if (isRedirect) return redirectObj
      if (req?.url.includes('?amp=1')) {
        const { data: latestArticles } = await queryGraphql(GET_RELATED_STORIES, { input: { oGetRelatedStoriesIdInput: { iArticleId: idData?.getSeoData?.iId }, oPaginationInput: { nLimit: 3, nSkip: 3 } } })
        return {
          props: {
            seoData: idData?.getSeoData,
            article: data?.getArticleFront,
            type: idData?.getSeoData?.eType,
            latestArticles: latestArticles?.getRelatedStories
          }
        }
      } else {
        return {
          props: {
            seoData: idData?.getSeoData,
            article: data?.getArticleFront,
            type: idData?.getSeoData?.eType
          }
        }
      }
    }
    return { notFound: true }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
    // return { props: { error: JSON.stringify(e) } }
  }
}
