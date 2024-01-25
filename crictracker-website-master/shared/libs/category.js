import { GET_CATEGORY_NEWS_VIDEOS, GET_FANTASY_ARTICLE_OF_CATEGORY, GET_SERIES_NEWS_VIDEOS } from '@graphql/series/home.query'
import { LIST_SERIES_TEAMS } from '@graphql/series/teams.query'
import { GET_CATEGORY_BY_ID } from '@graphql/category/category.query'
import { FETCH_TEAM_VENUE, FIXTURES_LIST } from '@graphql/series/fixtures.query'
import { GET_ROUNDS, GET_STANDING_DATA } from '@graphql/series/standings.query'
import { FETCH_SERIES_STATS_TYPE, STATS, MATCH_TYPES } from '@graphql/series/stats.query'
import { GET_ARCHIVES } from '@graphql/series/archives.query'
import { TOP_PLAYERS } from '@graphql/series/topPlayers.query'
import queryGraphql from '../components/queryGraphql'
import { GET_TEAM_PLAYER } from '@graphql/series/squads.query'
import { LIST_SERIES_FANTASY_TIPS } from '@graphql/series/fantasy-tips.query'
import { SERIES_MINI_SCORECARD } from '@graphql/home/home.query'
import { GET_SUB_PAGE_BY_SLUG } from '@graphql/seo/seo.query'

export const payload = (limit) => {
  return { nSkip: 1, nLimit: limit, sSortBy: 'dCreated', nOrder: -1 }
}

export const categorySlug = ['news', 'videos', 'fantasy-articles', 'fixtures', 'standings', 'stats', 'archives', 'photos', 'teams', 'squads', 'fantasy-tips']
async function getSeriesScoreCard(category) {
  if (category?.eType === 'as') {
    const { data: scoreCard } = await queryGraphql(SERIES_MINI_SCORECARD, { input: { _id: category?.iSeriesId } })
    return scoreCard?.listSeriesScorecard || []
  } else return []
}

// async function getBannerSeriesScoreCard() {
//   const { data: scoreCard } = await queryGraphql(SERIES_MINI_SCORECARD, { input: { _id: '63f052b9d5e097df610db62d' } })
//   return scoreCard?.listSeriesScorecard || []
// }

export async function getCategorySSRData(seo, tabType, isAmp, query) {
  const {
    data: { getCategoryByIdFront }
  } = await queryGraphql(GET_CATEGORY_BY_ID, { input: { _id: seo?.iId } })
  const category = getCategoryByIdFront

  let rData = { type: tabType || 'home', data: category }

  if (category?.eType === 'as') { // Series
    const [subPages, scoreCard] = await Promise.allSettled([queryGraphql(GET_SUB_PAGE_BY_SLUG, { input: { sSlug: seo?.sSlug } }), getSeriesScoreCard(category)])
    rData = { ...rData, seriesScoreCard: scoreCard?.value, subPages: subPages.value?.data?.getSeosBySlug }

    if (tabType === 'news') {
      const { data: newsData } = await queryGraphql(GET_SERIES_NEWS_VIDEOS, { input: { ...payload(isAmp ? 32 : 16), iSeriesId: category?.iSeriesId, eType: 'n' } })
      rData = { ...rData, newsData: newsData?.listSeriesArticlesVideosFront?.oArticles }
    } else if (tabType === 'videos') {
      const { data: newsVideo } = await queryGraphql(
        GET_SERIES_NEWS_VIDEOS,
        {
          input: { ...payload(isAmp ? 16 : 7), iSeriesId: category?.iSeriesId, eType: 'v' }
        }
      )
      rData = { ...rData, videosData: newsVideo?.listSeriesArticlesVideosFront?.oVideos }
    } else if (tabType === 'fixtures') {
      const [fixture, teamVenue] = await Promise.allSettled([
        queryGraphql(FIXTURES_LIST, { input: { iSeriesId: category?.iSeriesId, nOrder: 1, sSortBy: 'dStartDate', iTeamId: query?.iTeamId || null, iVenueId: query?.iVenueId || null } }),
        queryGraphql(FETCH_TEAM_VENUE, { input: { iSeriesId: category?.iSeriesId } })
      ])
      rData = { ...rData, fixturesData: fixture?.value?.data, teamData: teamVenue?.value?.data }
    } else if (tabType === 'standings') {
      const [round, standings] = await Promise.allSettled([
        queryGraphql(GET_ROUNDS, { input: { iSeriesId: category?.iSeriesId } }),
        queryGraphql(GET_STANDING_DATA, { input: { iRoundId: null, iSeriesId: category?.iSeriesId } })
      ])
      rData = { ...rData, roundData: round?.value?.data, standingData: standings?.value?.data }
    } else if (tabType === 'stats') {
      const { data: seriesData } = await queryGraphql(FETCH_SERIES_STATS_TYPE, { input: { eGroupTitle: 'All' } })
      let selectedStats
      if (seo?.eSubType !== 'st') {
        selectedStats = seriesData?.fetchSeriesStatsTypes.filter((i) => {
          return i?.eSubType === seo?.eSubType
        })
      }
      const id = seo?.eSubType !== 'st' ? selectedStats[0]?._id : seriesData?.fetchSeriesStatsTypes[0]?._id
      if (category?.oSeries?.sSeriesType === 'tour' || category?.oSeries?.sSeriesType === 'series') {
        const { data: matchTypeData } = await queryGraphql(MATCH_TYPES, { input: { iSeriesId: category?.iSeriesId } })
        const { data: statsData } = await queryGraphql(STATS, { input: { iSeriesId: category?.iSeriesId, _id: id, eFormat: matchTypeData?.listSeriesStatsFormat[0] } })
        rData = { ...rData, statsData, seriesData, matchTypeData }
      } else {
        const { data: statsData } = await queryGraphql(STATS, { input: { iSeriesId: category?.iSeriesId, _id: id } })
        rData = { ...rData, statsData, seriesData }
      }
    } else if (tabType === 'archives') {
      const { data: seriesArchivesData } = await queryGraphql(GET_ARCHIVES, { input: { iSeriesId: category?.iSeriesId } })
      rData = { ...rData, seriesArchivesData }
    } else if (tabType === 'teams') {
      const { data: seriesTeamData } = await queryGraphql(LIST_SERIES_TEAMS, { input: { iSeriesId: category?.iSeriesId } })
      rData = { ...rData, seriesTeamData }
    } else if (tabType === 'squads') {
      const { data: seriesTeamData } = await queryGraphql(LIST_SERIES_TEAMS, { input: { iSeriesId: category?.iSeriesId } })
      if (seriesTeamData?.listSeriesTeams?.aTeams?.length) {
        const iTeamId = query?.teamId || seriesTeamData?.listSeriesTeams?.aTeams[0]?._id
        const { data: teamPlayer } = await queryGraphql(GET_TEAM_PLAYER, { input: { iSeriesId: category?.iSeriesId, iTeamId } })
        rData = { ...rData, seriesTeamData, teamPlayer: teamPlayer?.listSeriesSquad }
      } else {
        rData = { ...rData, seriesTeamData, teamPlayer: [] }
      }
    } else if (tabType === 'fantasy-tips') {
      const { data: seriesFantasyTips } = await queryGraphql(LIST_SERIES_FANTASY_TIPS, { input: { iSeriesId: category?.iSeriesId, nOrder: -1, sSortBy: 'dStartDate' } })
      rData = { ...rData, seriesFantasyTips }
    } else { // Home
      const [article, fantasy, topPlayer] = await Promise.allSettled([
        queryGraphql(GET_SERIES_NEWS_VIDEOS, { input: { ...payload(32), iSeriesId: category?.iSeriesId, eType: 'vn' } }),
        queryGraphql(GET_FANTASY_ARTICLE_OF_CATEGORY, { input: { ...payload(16), iId: seo?.iId } }),
        queryGraphql(TOP_PLAYERS, { input: { iSeriesId: category?.iSeriesId } })
      ])
      rData = {
        ...rData,
        home: {
          oArticles: article?.value?.data?.listSeriesArticlesVideosFront?.oArticles,
          oVideos: article?.value?.data?.listSeriesArticlesVideosFront?.oVideos,
          fantasyArticle: fantasy?.value?.data?.listFrontTagCategoryFantasyArticle
        },
        playerData: topPlayer?.value?.data
      }
    }
  } else { // Simple
    if (category?.eType === 'fac') {
      const [article, fantasyArticle] = await Promise.allSettled([
        queryGraphql(GET_CATEGORY_NEWS_VIDEOS, { input: { ...payload(isAmp ? 32 : 16), iCategoryId: category?._id, eType: 'n' } }),
        queryGraphql(GET_FANTASY_ARTICLE_OF_CATEGORY, { input: { ...payload(16), iId: seo?.iId } })
      ])
      rData = {
        ...rData,
        home: {
          oArticles: article?.value?.data?.listSimpleCategoryArticlesVideosFront?.oArticles,
          fantasyArticle: fantasyArticle?.value?.data?.listFrontTagCategoryFantasyArticle
        }
      }
    } else {
      const [article, video] = await Promise.allSettled([
        queryGraphql(GET_CATEGORY_NEWS_VIDEOS, { input: { ...payload(isAmp ? 32 : 16), iCategoryId: category?._id, eType: 'n' } }),
        queryGraphql(GET_CATEGORY_NEWS_VIDEOS, { input: { ...payload(isAmp ? 16 : 7), iCategoryId: category?._id, eType: 'v' } })
      ])
      rData = {
        ...rData,
        home: {
          oArticles: article?.value?.data?.listSimpleCategoryArticlesVideosFront?.oArticles,
          oVideos: video?.value?.data?.listSimpleCategoryArticlesVideosFront?.oVideos
        }
      }
    }
  }
  return rData
}
