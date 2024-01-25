import React from 'react'
import PropTypes from 'prop-types'
import { useAmp } from 'next/amp'
import dynamic from 'next/dynamic'

import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'

const CategoryContent = dynamic(() => import('@shared/components/categoryContent'), { loading: () => pageLoading() })
const ArticleDetail = dynamic(() => import('@shared/components/articleDetail'), { loading: () => pageLoading() })
const ArticleDetailAMP = dynamic(() => import('@shared/components/amp/articleDetailAMP'), { loading: () => pageLoading() })
const FantasyArticleContent = dynamic(() => import('@shared/components/articleDetail/fantasyArticleContent'))
const ArticleFantasyContentAMP = dynamic(() => import('@shared/components/amp/articleFantasyContentAMP'))
const ArticleContent = dynamic(() => import('@shared/components/articleDetail/articleContent'))
const ArticleContentAMP = dynamic(() => import('@shared/components/amp/articleContentAMP'), { loading: () => pageLoading() })
const SeriesFantasyArticle = dynamic(() => import('@shared/components/series/seriesFantasyArticle'), { loading: () => pageLoading() })

export const config = { amp: 'hybrid' }
function FantasyArticle({ seoData, fantasyArticle, error, type, category, playerData, article, latestArticles, matchStats }) {
  const isAmp = useAmp()

  if (!error) {
    if (type === 'ct') {
      return (
        <CategoryContent seoData={seoData} category={{ ...category, oSeo: seoData }} isFantasyArticle>
          {() => (
            <SeriesFantasyArticle data={fantasyArticle} category={{ ...category, oSeo: seoData }} />
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
        <ArticleDetailAMP seoData={seoData} latestArticles={[] || latestArticles} article={fantasyArticle?.data?.getFrontFantasyArticle} >
          <ArticleFantasyContentAMP article={fantasyArticle?.data?.getFrontFantasyArticle} playerData={playerData} matchStats={matchStats} />
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
  latestArticles: PropTypes.object,
  matchStats: PropTypes.object
}

export default Error(FantasyArticle)

export async function getServerSideProps({ req, res, params, query, resolvedUrl }) {
  const fantasySlug = 'fantasy-cricket-tips/'
  const [graphql, articleQuery, utils] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils')
  ])

  // Check amp exists in query params
  const { hasAmp, redirectionRules } = utils.hasAmpInQueryParams(req?.url)
  if (hasAmp) return redirectionRules

  try {
    const { token } = req?.cookies
    const slug = params.slug
    const newSlug = fantasySlug + slug.join('/')

    const { data: idData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: newSlug } })
    res.setHeader('Cache-Control', 'public, max-age=420')

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(idData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    if (idData?.getSeoData?.eType === 'ct') { // Category
      const { GET_CATEGORY_BY_ID } = (await import('@graphql/category/category.query'))
      const { GET_FANTASY_ARTICLE_OF_CATEGORY } = (await import('@graphql/series/home.query'))
      const { payload } = (await import('@shared/libs/category'))

      const { data: categoryData } = await graphql.default(GET_CATEGORY_BY_ID, { input: { _id: idData?.getSeoData?.iId } }, token)
      const { data: fantasyArticle } = await graphql.default(GET_FANTASY_ARTICLE_OF_CATEGORY, { input: { ...payload(7), iId: idData?.getSeoData?.iId } })
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
      const { GET_FANTASY_DETAILS, FANTASY_PLAYERS_STATS, GET_FANTASY_RELATED_STORIES, GET_FANTASY_TEAM_FORM, GET_FANTASY_WEATHER_REPORT } = (await import('@graphql/fantasy-tips/fantasy-tips.query'))
      const value = await graphql.default(GET_FANTASY_DETAILS, { input: { _id: idData?.getSeoData?.iId } })

      // const playerData = await graphql.default(GET_FANTASY_PLAYER_DATA, { input: { iMatchId: value?.data?.getFrontFantasyArticle?.oMatch?._id, ePlatformType: value?.data?.getFrontFantasyArticle?.ePlatformType } })
      // Check amp is enable from backend or not
      const { isRedirect, redirectObj } = utils.isAMPEnable(value?.data?.getFrontFantasyArticle, query)
      if (isRedirect) return redirectObj

      const api = []
      if (value?.data?.getFrontFantasyArticle?.oAdvanceFeature?.bTeamForm) {
        api.push(
          graphql.default(GET_FANTASY_WEATHER_REPORT, { input: { _id: value?.data?.getFrontFantasyArticle?.oMatch?.oVenue?._id } }),
          graphql.default(GET_FANTASY_TEAM_FORM, { input: { _id: value.data.getFrontFantasyArticle?.oMatch?.oTeamA?._id, nLimit: 5 } }),
          graphql.default(GET_FANTASY_TEAM_FORM, { input: { _id: value.data.getFrontFantasyArticle?.oMatch?.oTeamB?._id, nLimit: 5 } })
        )
      } else {
        api.push(graphql.default(GET_FANTASY_WEATHER_REPORT, { input: { _id: value?.data?.getFrontFantasyArticle?.oMatch?.oVenue?._id } }))
      }

      const [WeatherReport, TeamAForm, TeamBForm] = await Promise.allSettled(api)

      value.data.getFrontFantasyArticle.oTeamAForm = TeamAForm?.value?.data?.getRecentMatchesOfTeam || []
      value.data.getFrontFantasyArticle.oTeamBForm = TeamBForm?.value?.data?.getRecentMatchesOfTeam || []

      value.data.getFrontFantasyArticle.WeatherReport = WeatherReport?.value || null

      if (query?.amp) {
        const { fantasyMatchPlayerStatsTypes } = (await import('@shared/libs/fantasyMatchPlayerStats'))
        const [latestFantasyArticles, matchStats] = await Promise.allSettled([
          graphql.default(GET_FANTASY_RELATED_STORIES, { input: { oGetRelatedFantasyStoriesIdInput: { iCategoryId: value?.data?.getFrontFantasyArticle?.iCategoryId, iFantasyArticleId: idData?.getSeoData?.iId }, oPaginationInput: { nLimit: 3, nSkip: 3 } } }),
          graphql.default(FANTASY_PLAYERS_STATS, { input: { iSeriesId: value?.data?.getFrontFantasyArticle?.oMatch?.oSeries?._id, aSeriesStatsType: fantasyMatchPlayerStatsTypes, nLimit: 6, aTeamId: [value?.data?.getFrontFantasyArticle?.oMatch?.oTeamA?._id, value?.data?.getFrontFantasyArticle?.oMatch?.oTeamB?._id] } })
        ])
        return {
          props: {
            seoData: idData?.getSeoData,
            fantasyArticle: value,
            matchStats: matchStats?.value?.data,
            type: idData?.getSeoData?.eType,
            // playerData: playerData?.data?.listFantasyPlayersInfo
            latestArticles: latestFantasyArticles?.value?.data?.getRelatedFantasyStories?.aResults
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
      const { data } = await graphql.default(articleQuery.GET_ARTICLE_DETAILS, { input: { _id: idData?.getSeoData?.iId } })

      // Check amp is enable from backend or not
      const { isRedirect, redirectObj } = utils.isAMPEnable(data?.getArticleFront, query)
      if (isRedirect) return redirectObj

      if (query?.amp) {
        const { data: latestArticles } = await graphql.default(articleQuery.GET_RELATED_STORIES, { input: { oGetRelatedStoriesIdInput: { iArticleId: idData?.getSeoData?.iId }, oPaginationInput: { nLimit: 3, nSkip: 3 } } })
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
    const status = utils.handleApiError(e, resolvedUrl)
    return status
    // return { props: { error: JSON.stringify(e) } }
  }
}
