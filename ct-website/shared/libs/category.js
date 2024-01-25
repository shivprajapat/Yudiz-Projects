import { GET_CATEGORY_NEWS_VIDEOS, GET_FANTASY_ARTICLE_OF_CATEGORY, GET_SERIES_NEWS_VIDEOS } from '@graphql/series/home.query'
import { LIST_SERIES_TEAMS } from '@graphql/series/teams.query'
import { GET_CATEGORY_BY_ID, GET_SERIES_REWRITE_URLS } from '@graphql/category/category.query'
import { FETCH_TEAM_VENUE, FIXTURES_LIST } from '@graphql/series/fixtures.query'
import { GET_ROUNDS, GET_STANDING_DATA } from '@graphql/series/standings.query'
import { FETCH_SERIES_STATS_TYPE, STATS, MATCH_TYPES } from '@graphql/series/stats.query'
import { GET_ARCHIVES } from '@graphql/series/archives.query'
import { TOP_PLAYERS } from '@graphql/series/topPlayers.query'
import queryGraphql from '../components/queryGraphql'
import { GET_TEAM_PLAYER } from '@graphql/series/squads.query'
import { LIST_SERIES_FANTASY_TIPS } from '@graphql/series/fantasy-tips.query'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { SERIES_MINI_SCORECARD } from '@graphql/home/home.query'

export const payload = (limit) => {
  return { nSkip: 1, nLimit: limit, sSortBy: 'dCreated', nOrder: -1 }
}

export const categorySlug = ['news', 'videos', 'fantasy-articles', 'fixtures', 'standings', 'stats', 'archives', 'photos', 'teams', 'squads', 'fantasy-tips']

export async function getCategoryData(seo, type, token, lastSlug, isAmp) {
  let reWriteURLS = null

  const {
    data: { getCategoryByIdFront }
  } = await queryGraphql(GET_CATEGORY_BY_ID, { input: { _id: seo?.iId } }, token)
  const category = getCategoryByIdFront

  const scoreCard = await getSeriesScoreCard(category)

  try { // Get rewrite url if exists
    const { data: categoryURLS } = await queryGraphql(GET_SERIES_REWRITE_URLS, { input: { _id: seo?.iId } }, token)
    reWriteURLS = categoryURLS?.getSeriesCustomPages
  } catch (e) {
    console.error(e)
  }
  const isTabSeoExits = reWriteURLS?.filter(t => t?.eTabType === type)?.length

  let data = { seriesScoreCard: scoreCard }

  if (type === 'news') {
    if (category?.eType === 'as') {
      // Series category
      const { data: newsData } = await queryGraphql(
        GET_SERIES_NEWS_VIDEOS,
        {
          input: { ...payload(isAmp ? 32 : 16), iSeriesId: category?.iSeriesId, eType: 'n' }
        },
        token
      )
      data = { ...data, type, newsData: newsData?.listSeriesArticlesVideosFront?.oArticles, data: category, reWriteURLS }
    } else return { notFound: true }
  } else if (type === 'videos') {
    if (category?.eType === 'as') {
      // Series category
      const { data: newsVideo } = await queryGraphql(
        GET_SERIES_NEWS_VIDEOS,
        {
          input: { ...payload(isAmp ? 16 : 7), iSeriesId: category?.iSeriesId, eType: 'v' }
        },
        token
      )
      data = { ...data, type, videosData: newsVideo?.listSeriesArticlesVideosFront?.oVideos, data: category, reWriteURLS }
    } else return { notFound: true }
  } else if (type === 'fixtures') {
    if (category?.eType === 'as') {
      // get tab seo
      let tabSeo = null
      if (!seo?.eTabType && isTabSeoExits) {
        try {
          const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${seo?.sSlug}/${type}` } })
          tabSeo = idData?.getSeoData
        } catch (e) {
          console.error(e)
        }
      }
      const { data: fixturesData } = await queryGraphql(FIXTURES_LIST, { input: { iSeriesId: category?.iSeriesId, nOrder: 1, sSortBy: 'dStartDate' } }, token)
      const { data: teamData } = await queryGraphql(FETCH_TEAM_VENUE, { input: { iSeriesId: category?.iSeriesId } }, token)
      data = { ...data, type, fixturesData, teamData, data: category, tabSeo, reWriteURLS }
    } else return { notFound: true }
  } else if (type === 'standings') {
    if (category?.eType === 'as') {
      // get tab seo
      let tabSeo = null
      if (!seo?.eTabType && isTabSeoExits) {
        try {
          const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${seo?.sSlug}/${type}` } })
          tabSeo = idData?.getSeoData
        } catch (e) {
          console.error(e)
        }
      }

      const { data: roundData } = await queryGraphql(GET_ROUNDS, { input: { iSeriesId: category?.iSeriesId } }, token)
      const { data: standingData } = await queryGraphql(
        GET_STANDING_DATA,
        { input: { iRoundId: null, iSeriesId: category?.iSeriesId } },
        token
      )
      data = { ...data, type, roundData, standingData, data: category, tabSeo, reWriteURLS }
    } else return { notFound: true }
  } else if (type === 'stats') {
    if (category?.eType === 'as') {
      // get tab seo
      let tabSeo = null
      if (!seo?.eTabType && isTabSeoExits) {
        try {
          const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${seo?.sSlug}/${type}` } })
          tabSeo = idData?.getSeoData
        } catch (e) {
          console.error(e)
        }
      }

      const { data: seriesData } = await queryGraphql(FETCH_SERIES_STATS_TYPE, { input: { eGroupTitle: 'All' } }, token)
      let currentItemData
      if (lastSlug !== 'stats') {
        currentItemData = seriesData?.fetchSeriesStatsTypes.filter((i) => {
          const slugType = i.sSeoType || i.sType
          return slugType === lastSlug.split('-').join('_')
        })
      }
      if (category?.oSeries?.sSeriesType === 'tour' || category?.oSeries?.sSeriesType === 'series') {
        const { data: matchTypeData } = await queryGraphql(MATCH_TYPES, { input: { iSeriesId: category?.iSeriesId } }, token)
        const { data: statsData } = await queryGraphql(STATS, { input: { iSeriesId: category?.iSeriesId, _id: lastSlug !== 'stats' ? currentItemData[0]._id : seriesData?.fetchSeriesStatsTypes[0]?._id, eFormat: matchTypeData?.listSeriesStatsFormat[0] } }, token)
        data = { ...data, type, statsData, seriesData, matchTypeData, data: category, tabSeo, reWriteURLS }
      } else {
        const { data: statsData } = await queryGraphql(STATS, { input: { iSeriesId: category?.iSeriesId, _id: lastSlug !== 'stats' ? currentItemData[0]._id : seriesData?.fetchSeriesStatsTypes[0]?._id } }, token)
        data = { ...data, type, statsData, seriesData, data: category, tabSeo, reWriteURLS }
      }
    } else return { notFound: true }
  } else if (type === 'archives') {
    if (category?.eType === 'as') {
      const { data: seriesArchivesData } = await queryGraphql(GET_ARCHIVES, { input: { iSeriesId: category?.iSeriesId } }, token)
      data = { ...data, type, seriesArchivesData, data: category, reWriteURLS }
    } else return { notFound: true }
  } else if (type === 'teams') {
    if (category?.eType === 'as') {
      // get tab seo
      let tabSeo = null
      if (!seo?.eTabType && isTabSeoExits) {
        try {
          const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${seo?.sSlug}/${type}` } })
          tabSeo = idData?.getSeoData
        } catch (e) {
          console.error(e)
        }
      }

      const { data: seriesTeamData } = await queryGraphql(LIST_SERIES_TEAMS, { input: { iSeriesId: category?.iSeriesId } }, token)
      data = { ...data, type, seriesTeamData, data: category, tabSeo, reWriteURLS }
    } else return { notFound: true }
  } else if (type === 'squads') {
    if (category?.eType === 'as') {
      // get tab seo
      let tabSeo = null
      if (!seo?.eTabType && isTabSeoExits) {
        try {
          const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: `${seo?.sSlug}/${type}` } })
          tabSeo = idData?.getSeoData
        } catch (e) {
          console.error(e)
        }
      }

      const { data: seriesTeamData } = await queryGraphql(LIST_SERIES_TEAMS, { input: { iSeriesId: category?.iSeriesId } }, token)
      if (seriesTeamData?.listSeriesTeams?.aTeams?.length) {
        const iTeamId = seriesTeamData?.listSeriesTeams?.aTeams[0]?._id
        const { data: teamPlayer } = await queryGraphql(GET_TEAM_PLAYER, { input: { iSeriesId: category?.iSeriesId, iTeamId } }, token)
        data = { ...data, type, seriesTeamData, teamPlayer: teamPlayer?.listSeriesSquad, data: category, tabSeo, reWriteURLS }
      } else {
        data = { ...data, type, seriesTeamData, teamPlayer: [], data: category, tabSeo, reWriteURLS }
      }
    } else return { notFound: true }
  } else if (type === 'fantasy-tips') {
    if (category?.eType === 'as') {
      const { data: seriesFantasyTips } = await queryGraphql(LIST_SERIES_FANTASY_TIPS, { input: { iSeriesId: category?.iSeriesId, nOrder: -1, sSortBy: 'dStartDate' } }, token)
      data = { ...data, type, seriesFantasyTips, data: category, reWriteURLS }
    } else return { notFound: true }
  } else {
    if (category?.eType === 'as') {
      // Series category
      const { data: sArticle } = await queryGraphql(
        GET_SERIES_NEWS_VIDEOS,
        {
          input: { ...payload(16), iSeriesId: category?.iSeriesId, eType: 'n' }
        },
        token
      )
      const { data: sVideo } = await queryGraphql(
        GET_SERIES_NEWS_VIDEOS,
        {
          input: { ...payload(16), iSeriesId: category?.iSeriesId, eType: 'v' }
        },
        token
      )
      const { data: fantasyArticle } = await queryGraphql(
        GET_FANTASY_ARTICLE_OF_CATEGORY,
        {
          input: { ...payload(16), iId: seo?.iId }
        },
        token
      )
      const { data: playerData } = await queryGraphql(TOP_PLAYERS, { input: { iSeriesId: category?.iSeriesId } }, token)
      data = {
        ...data,
        type,
        home: { oArticles: sArticle?.listSeriesArticlesVideosFront?.oArticles, oVideos: sVideo?.listSeriesArticlesVideosFront?.oVideos, fantasyArticle: fantasyArticle?.listFrontTagCategoryFantasyArticle },
        playerData,
        data: category,
        reWriteURLS
      }
    } else {
      // simple category
      const { data: oArticles } = await queryGraphql(
        GET_CATEGORY_NEWS_VIDEOS,
        {
          input: { ...payload(isAmp ? 32 : 16), iCategoryId: category?._id, eType: 'n' }
        },
        token
      )

      if (category?.eType === 'fac') { // fantasy platform category
        const { data: fantasyArticle } = await queryGraphql(
          GET_FANTASY_ARTICLE_OF_CATEGORY,
          {
            input: { ...payload(16), iId: seo?.iId }
          },
          token
        )
        data = {
          ...data,
          type,
          home: { oArticles: oArticles?.listSimpleCategoryArticlesVideosFront?.oArticles, fantasyArticle: fantasyArticle?.listFrontTagCategoryFantasyArticle },
          data: category,
          reWriteURLS
        }
      } else { // simple category
        const { data: oVideos } = await queryGraphql(
          GET_CATEGORY_NEWS_VIDEOS,
          {
            input: { ...payload(isAmp ? 16 : 7), iCategoryId: category?._id, eType: 'v' }
          },
          token
        )
        data = {
          ...data,
          type,
          home: { oArticles: oArticles?.listSimpleCategoryArticlesVideosFront?.oArticles, oVideos: oVideos?.listSimpleCategoryArticlesVideosFront?.oVideos },
          // Temporary change parent category type to simple category
          data: { ...category, eType: category?.eType === 'p' ? 's' : category?.eType },
          reWriteURLS
        }
      }
    }
  }
  return data
}

async function getSeriesScoreCard(category) {
  if (category?.eType === 'as') {
    const { data: scoreCard } = await queryGraphql(SERIES_MINI_SCORECARD, { input: { _id: category?.iSeriesId } })
    return scoreCard?.listSeriesScorecard || []
  } else return []
}
