import React from 'react'
import PropTypes from 'prop-types'
import { useAmp } from 'next/amp'
import dynamic from 'next/dynamic'

import Error from '@shared/components/error'
import { categorySlug } from '@shared-libs/category/'
import { pageLoading } from '@shared/libs/allLoader'
import useCategory from '@shared/hooks/useCategory'

const CategoryContent = dynamic(() => import('@shared/components/categoryContent'), { loading: () => pageLoading() })
const CategoryContentAMP = dynamic(() => import('@shared/components/amp/categoryContentAMP'), { loading: () => pageLoading() })
const SeriesHomeAMP = dynamic(() => import('@shared/components/amp/seriesHomeAMP'), { loading: () => pageLoading() })
const ArticleContentAMP = dynamic(() => import('@shared/components/amp/articleContentAMP'), { loading: () => pageLoading() })
const ArticleDetail = dynamic(() => import('@shared/components/articleDetail'), { loading: () => pageLoading() })
const ArticleDetailAMP = dynamic(() => import('@shared/components/amp/articleDetailAMP'), { loading: () => pageLoading() })
const ArticleContent = dynamic(() => import('@shared/components/articleDetail/articleContent'))
const CMSContent = dynamic(() => import('@shared/components/cmsContent'))
const CMSContentAMP = dynamic(() => import('@shared/components/amp/cmsContentAMP'))
const TagPlayerTeamDetail = dynamic(() => import('@shared/components/tagPlayerTeamDetail'))

export const config = { amp: 'hybrid' }
function Article({ seoData, article, category, tag, cmsData, latestArticles }) {
  const isAmp = useAmp()
  const { getCategoryPages } = useCategory({ category, seoData })

  if (seoData?.eType === 'ct') {
    return getCategoryPages()
  } else if (seoData?.eType === 'gt' || seoData?.eType === 'p' || seoData?.eType === 't') {
    if (!isAmp) {
      return (
        <CategoryContent seoData={seoData} category={tag?.data} showNav>
          {({ activeTab, changeTab }) => <TagPlayerTeamDetail seoData={seoData} tag={tag} onTabChanges={changeTab} activeTab={activeTab} />}
        </CategoryContent>
      )
    } else {
      return (
        <CategoryContentAMP seoData={seoData} category={tag?.data}>
          {!categorySlug.includes(tag?.type) && <SeriesHomeAMP data={tag?.home} category={tag?.data} />}
        </CategoryContentAMP>
      )
    }
  } else if (seoData?.eType === 'cms') {
    if (!isAmp) {
      return <CMSContent data={cmsData} seoData={seoData} />
    } else {
      return <CMSContentAMP data={cmsData} seoData={seoData} />
    }
  } else if (isAmp) {
    return (
      <ArticleDetailAMP seoData={seoData} article={article} latestArticles={latestArticles?.aResults}>
        <ArticleContentAMP article={article} />
      </ArticleDetailAMP>
    )
  } else {
    return (
      <ArticleDetail seoData={seoData} article={article} type="article">
        <ArticleContent article={article} />
      </ArticleDetail>
    )
  }
}

Article.propTypes = {
  seoData: PropTypes.object,
  article: PropTypes.object,
  category: PropTypes.object,
  tag: PropTypes.object,
  cmsData: PropTypes.object,
  latestArticles: PropTypes.object
}

export default Error(Article)

export async function getServerSideProps({ req, res, params, query }) {
  const queryGraphql = (await import('@shared-components/queryGraphql')).default
  const hasAmpInQueryParams = (await import('@shared/utils')).hasAmpInQueryParams
  // Check amp exists in query params
  const { hasAmp, redirectionRules } = hasAmpInQueryParams(req?.url)
  if (hasAmp) return redirectionRules

  try {
    if (params.slug?.join('/')?.includes('.xml')) {
      // Sitemap
      const getSiteMapData = (await import('@shared/libs/sitemap')).getSiteMapData
      const slug = params?.slug?.join('/')
      await getSiteMapData(res, slug)
      return {
        props: {}
      }
    } else {
      const { checkPageNumberInSlug, checkRedirectionStatus, isAMPEnable, isListicleArticlePage } = await import('@shared/utils')
      const { token } = req?.cookies
      const lastData = params.slug[params.slug.length - 1]
      const { slug } = checkPageNumberInSlug(params.slug)
      const currentPage = slug[slug.length - 1]
      const mSlug = categorySlug.includes(currentPage) ? slug.slice(0, -1).join('/') : slug.join('/')
      const GET_ARTICLE_ID = (await import('@graphql/article/article.query')).GET_ARTICLE_ID

      const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: mSlug } })
      // Check Redirection
      const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(idData?.getSeoData)
      if (redirectStatus && props) {
        res.statusCode = eCode
        return { props }
      } else if (redirectStatus) return returnObj

      if (idData?.getSeoData?.eType === 'ct' || (idData?.getSeoData?.eType === 'cu' && idData?.getSeoData?.eTabType)) {
        // Category
        const getCategoryData = (await import('@shared-libs/category')).getCategoryData
        res.setHeader('Cache-Control', 'public, max-age=420')
        const tabType = idData?.getSeoData?.eTabType || currentPage
        const value = await getCategoryData(idData?.getSeoData, tabType, token, lastData, req?.url.includes('?amp=1'))
        if (value?.notFound) return value

        // Check tab Redirection
        const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(value?.tabSeo)
        if (redirectStatus && props) {
          res.statusCode = eCode
          return { props }
        } else if (redirectStatus) return returnObj

        return {
          props: {
            seoData: { ...idData?.getSeoData, eType: 'ct' },
            category: value
          }
        }
      } else if (idData?.getSeoData?.eType === 'gt' || idData?.getSeoData?.eType === 'p' || idData?.getSeoData?.eType === 't') {
        const getTagData = (await import('@shared-libs/news')).getTagData
        // General tag, Player, Team
        res.setHeader('Cache-Control', 'public, max-age=420')
        const value = await getTagData(idData?.getSeoData, currentPage, token)
        return {
          props: {
            seoData: idData?.getSeoData,
            tag: value
          }
        }
      } else if (idData?.getSeoData?.eType === 'cms') {
        // Cms pages
        res.setHeader('Cache-Control', 'public, max-age=1200')
        const GET_CMS_PAGE = (await import('@graphql/cms/cms.query')).GET_CMS_PAGE
        const { data: cmsData } = await queryGraphql(GET_CMS_PAGE, { input: { _id: idData?.getSeoData?.iId } })
        return {
          props: {
            seoData: idData?.getSeoData,
            cmsData: cmsData
          }
        }
      } else {
        // News Article
        res.setHeader('Cache-Control', 'public, max-age=420')
        const GET_ARTICLE_DETAILS = (await import('@graphql/article/article.query')).GET_ARTICLE_DETAILS
        const { data } = await queryGraphql(GET_ARTICLE_DETAILS, { input: { _id: idData?.getSeoData?.iId } })

        // Check current listicle page is more than total page
        const { redirectionRule, applyRedirection } = isListicleArticlePage(data?.getArticleFront, lastData, mSlug, req?.url)
        if (applyRedirection) return redirectionRule

        // Check amp is enable from backend or not
        const { isRedirect, redirectObj } = isAMPEnable(data?.getArticleFront, query)
        if (isRedirect) return redirectObj

        if (req?.url.includes('?amp=1')) {
          const GET_RELATED_STORIES = (await import('@graphql/article/article.query')).GET_RELATED_STORIES
          const { data: latestArticles } = await queryGraphql(GET_RELATED_STORIES, {
            input: { oGetRelatedStoriesIdInput: { iArticleId: idData?.getSeoData?.iId }, oPaginationInput: { nLimit: 3, nSkip: 3 } }
          })
          return {
            props: {
              seoData: idData?.getSeoData,
              article: data?.getArticleFront,
              latestArticles: latestArticles?.getRelatedStories
            }
          }
        } else {
          return {
            props: {
              seoData: idData?.getSeoData,
              article: data?.getArticleFront
            }
          }
        }
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const handleApiError = (await import('@shared/utils')).handleApiError
    const status = handleApiError(e)
    return status
    // return { notFound: true }
  }
}
