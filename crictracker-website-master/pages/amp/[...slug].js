import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import Error from '@shared/components/error'
import { pageLoading } from '@shared/libs/allLoader'

const ArticleContentAMP = dynamic(() => import('@shared/components/amp/articleContentAMP'), { loading: () => pageLoading() })
const ArticleDetailAMP = dynamic(() => import('@shared/components/amp/articleDetailAMP'), { loading: () => pageLoading() })

export const config = { amp: true }

function Slug({ seoData, article, latestArticles }) {
  if (seoData?.eType === 'ar') {
    return (
      <ArticleDetailAMP seoData={seoData} article={article} latestArticles={latestArticles?.aResults}>
        <ArticleContentAMP article={article} />
      </ArticleDetailAMP>
    )
  }
  return null
}

Slug.propTypes = {
  seoData: PropTypes.object,
  article: PropTypes.object,
  latestArticles: PropTypes.object
}

export default Error(Slug)

export async function getServerSideProps({ req, res, params, query, resolvedUrl }) {
  // Check amp exists in query params
  const { checkPageNumberInSlug } = (await import('@shared/utils'))
  const slug = checkPageNumberInSlug([...params?.slug], false)?.slug?.join('/')

  try {
    const queryGraphql = (await import('@shared-components/queryGraphql')).default
    const { checkRedirectionStatus, isAMPEnable } = (await import('@shared/utils'))

    const GET_ARTICLE_ID = (await import('@graphql/article/article.query')).GET_ARTICLE_ID
    const { data: seo } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: slug } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seo?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    if (seo?.getSeoData?.eType === 'ar') { // News Article
      const { GET_ARTICLE_DETAILS } = (await import('@graphql/article/article.query'))
      const { data } = await queryGraphql(GET_ARTICLE_DETAILS, { input: { _id: seo?.getSeoData?.iId } })

      if (data?.getArticleFront?.iEventId) res.setHeader('Cache-Control', 'public, must-revalidate, max-age=120, s-maxage=120')
      else res.setHeader('Cache-Control', 'public, max-age=420')

      if (data.getArticleFront?.iEventId) {
        const { getLiveArticleData } = (await import('@shared/libs/live-article'))
        const { oLiveArticleContent, oLiveArticleAmpContent, oLiveArticleList, oLiveArticleEvent } = await getLiveArticleData(data?.getArticleFront)
        data.getArticleFront.oLiveArticleContent = oLiveArticleContent
        data.getArticleFront.oLiveArticleAmpContent = oLiveArticleAmpContent
        data.getArticleFront.oLiveArticleList = oLiveArticleList
        data.getArticleFront.oLiveArticleEvent = oLiveArticleEvent
      }

      // Check amp is enable from backend or not
      const { isRedirect, redirectObj } = isAMPEnable(data?.getArticleFront, query)
      if (isRedirect) return redirectObj

      const GET_RELATED_STORIES = (await import('@graphql/article/article.query')).GET_RELATED_STORIES
      const { data: latestArticles } = await queryGraphql(GET_RELATED_STORIES, { input: { oGetRelatedStoriesIdInput: { iArticleId: seo?.getSeoData?.iId }, oPaginationInput: { nLimit: 3, nSkip: 3 } } })
      return {
        props: {
          seoData: seo?.getSeoData,
          article: data?.getArticleFront,
          latestArticles: latestArticles?.getRelatedStories
        }
      }
    } else return { notFound: true }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const handleApiError = (await import('@shared/utils')).handleApiError
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
