import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useAmp } from 'next/amp'

import Error from '@shared/components/error'
import { pageLoading } from '@shared/libs/allLoader'
// import { ENUM_SEO_SUBTYPE } from '@shared/enum'

const CategoryMain = dynamic(() => import('@shared/components/categoryMain'), { loading: () => pageLoading() })
const CMSContent = dynamic(() => import('@shared/components/cmsContent'))
const CMSContentAMP = dynamic(() => import('@shared/components/amp/cmsContentAMP'))
const CategoryContent = dynamic(() => import('@shared/components/categoryContent'), { loading: () => pageLoading() })
const CategoryContentAMP = dynamic(() => import('@shared/components/amp/categoryContentAMP'), { loading: () => pageLoading() })
const TagPlayerTeamDetailAMP = dynamic(() => import('@shared/components/amp/tagPlayerTeamDetailAMP'), { loading: () => pageLoading() })
const TagPlayerTeamDetail = dynamic(() => import('@shared/components/tagPlayerTeamDetail'))
const ArticleContentAMP = dynamic(() => import('@shared/components/amp/articleContentAMP'), { loading: () => pageLoading() })
const ArticleDetail = dynamic(() => import('@shared/components/articleDetail'), { loading: () => pageLoading() })
const ArticleDetailAMP = dynamic(() => import('@shared/components/amp/articleDetailAMP'), { loading: () => pageLoading() })
const ArticleContent = dynamic(() => import('@shared/components/articleDetail/articleContent'))

export const config = { amp: 'hybrid' }

function Slug({ seoData, category, cmsData, tag, article, latestArticles }) {
  const isAmp = useAmp()
  if (seoData?.eType === 'ct') {
    return <CategoryMain category={category} seoData={seoData} />
  } else if (seoData?.eType === 'gt' || seoData?.eType === 'p' || seoData?.eType === 't') {
    if (!isAmp) {
      return (
        <CategoryContent seoData={seoData} category={{ ...tag?.data, oSeo: seoData }} showNav>
          {({ activeTab, changeTab }) => (
            <TagPlayerTeamDetail seoData={seoData} tag={tag} onTabChanges={changeTab} activeTab={activeTab} />
          )}
        </CategoryContent>
      )
    } else {
      return (
        <CategoryContentAMP seoData={seoData} category={{ ...tag?.data, oSeo: seoData }} showNav>
          <TagPlayerTeamDetailAMP seoData={seoData} tag={tag} />
        </CategoryContentAMP>
      )
    }
  } else if (seoData?.eType === 'cms') {
    if (isAmp) {
      return <CMSContentAMP data={cmsData} seoData={seoData} />
    } else {
      return <CMSContent data={cmsData} seoData={seoData} />
    }
  } else if (seoData?.eType === 'ar') {
    if (isAmp) {
      return (
        <ArticleDetailAMP seoData={seoData} article={article} latestArticles={latestArticles?.aResults} >
          <ArticleContentAMP article={article} />
        </ArticleDetailAMP>
      )
    } else {
      return (
        <ArticleDetail seoData={seoData} article={article} type='article'>
          <ArticleContent article={article} />
        </ArticleDetail>
      )
    }
  }
}

Slug.propTypes = {
  seoData: PropTypes.object,
  cmsData: PropTypes.object,
  category: PropTypes.object,
  tag: PropTypes.object,
  article: PropTypes.object,
  latestArticles: PropTypes.object
}

export default Error(Slug)

export async function getServerSideProps({ req, res, params, query, resolvedUrl }) {
  const { hasAmpInQueryParams, checkPageNumberInSlug, checkRedirectionStatus, isAMPEnable, isListicleArticlePage, handleApiError } = (await import('@shared/utils'))

  // Check amp exists in query params
  const { hasAmp, redirectionRules } = hasAmpInQueryParams(req?.url)
  if (hasAmp) return redirectionRules
  const slug = checkPageNumberInSlug([...params?.slug], false)?.slug?.join('/')

  try {
    if (slug?.includes('.xml')) { // Sitemap
      const getSiteMapData = (await import('@shared/libs/sitemap')).getSiteMapData
      await getSiteMapData(res, slug)
      return {
        props: {}
      }
    } else {
      const [graphql, articleQuery] = await Promise.all([import('@shared-components/queryGraphql'), import('@graphql/article/article.query')])
      const { data: seo } = await graphql?.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: slug } })

      // Check Redirection
      const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seo?.getSeoData, query?.amp)
      if (redirectStatus && props) {
        res.statusCode = eCode
        return { props }
      } else if (redirectStatus) return returnObj

      if (seo?.getSeoData?.eType === 'ct') { // For Simple and series category
        const [ENUM, categoryAPI] = await Promise.all([import('@shared/enum'), import('@shared-libs/category')])
        const tabType = ENUM.ENUM_SEO_SUBTYPE[seo?.getSeoData?.eSubType]

        if (tabType === 'standings' || ENUM.ENUM_STATS_PAGE[seo?.getSeoData?.eSubType]) res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300')
        else res.setHeader('Cache-Control', 'public, max-age=420')

        const value = await categoryAPI.getCategorySSRData(seo?.getSeoData, tabType, query?.amp, query)
        if (value?.notFound) return value
        return {
          props: {
            seoData: seo?.getSeoData,
            category: value
          }
        }
      } else if (seo?.getSeoData?.eType === 'gt' || seo?.getSeoData?.eType === 'p' || seo?.getSeoData?.eType === 't') {
        // General tag, Player, Team
        const { getTagData } = await import('@shared-libs/news')
        res.setHeader('Cache-Control', 'public, max-age=420')
        const value = await getTagData(seo?.getSeoData)
        return {
          props: {
            seoData: seo?.getSeoData,
            tag: value
          }
        }
      } else if (seo?.getSeoData?.eType === 'cms') { // Cms pages
        res.setHeader('Cache-Control', 'public, max-age=120')
        const { GET_CMS_PAGE } = await import('@graphql/cms/cms.query')
        const { data: cmsData } = await graphql?.default(GET_CMS_PAGE, { input: { _id: seo?.getSeoData?.iId } })
        return {
          props: {
            seoData: seo?.getSeoData,
            cmsData: cmsData
          }
        }
      } else if (seo?.getSeoData?.eType === 'ar') { // News Article
        const { GET_ARTICLE_DETAILS, GET_RELATED_STORIES } = (await import('@graphql/article/article.query'))
        const { data } = await graphql?.default(GET_ARTICLE_DETAILS, { input: { _id: seo?.getSeoData?.iId } })

        if (data?.getArticleFront?.iEventId) res.setHeader('Cache-Control', 'public, must-revalidate, max-age=120, s-maxage=120')
        else res.setHeader('Cache-Control', 'public, max-age=420')

        // Check current listicle page is more than total page
        const currentPage = params?.slug[params?.slug?.length - 1]
        const { redirectionRule, applyRedirection } = isListicleArticlePage(data?.getArticleFront, currentPage, slug, req?.url)
        if (applyRedirection) return redirectionRule

        // Check amp is enable from backend or not
        const { isRedirect, redirectObj } = isAMPEnable(data?.getArticleFront, query)
        if (isRedirect) return redirectObj

        if (data.getArticleFront?.iEventId) {
          const { getLiveArticleData } = (await import('@shared/libs/live-article'))
          const { oLiveArticleContent, oLiveArticleAmpContent, oLiveArticleList, oLiveArticleEvent } = await getLiveArticleData(data?.getArticleFront)
          data.getArticleFront.oLiveArticleContent = oLiveArticleContent
          data.getArticleFront.oLiveArticleAmpContent = oLiveArticleAmpContent
          data.getArticleFront.oLiveArticleList = oLiveArticleList
          data.getArticleFront.oLiveArticleEvent = oLiveArticleEvent
        }

        if (query?.amp) {
          const { data: latestArticles } = await graphql?.default(GET_RELATED_STORIES, { input: { oGetRelatedStoriesIdInput: { iArticleId: seo?.getSeoData?.iId }, oPaginationInput: { nLimit: 3, nSkip: 3 } } })
          return {
            props: {
              seoData: seo?.getSeoData,
              article: data?.getArticleFront,
              latestArticles: latestArticles?.getRelatedStories
            }
          }
        } else {
          return {
            props: {
              seoData: seo?.getSeoData,
              article: data?.getArticleFront
            }
          }
        }
      } else return { notFound: true }
    }
  } catch (e) {
    // console.log({ slug: e })
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
