const { fetchSeriesData, fetchSeriesRounds, fetchSeriesStandings, listSeries, listSeriesTeams, listSeriesTopPlayers, getSeriesSearch, listFixtureSeries, listSeriesArchive, listSeriesYear, listCurrentOngoingSeries, getSeriesByIdFront, listSeriesStatsFormat, listAllCurrentSeries, listSeriesScorecard, listSeriesFantasyTipsFront, listCurrentSeriesDropdown } = require('./controllers')

const Mutation = {
}

const Query = {
  fetchSeriesData,
  fetchSeriesRounds,
  fetchSeriesStandings,
  listSeries,
  listSeriesTeams,
  listSeriesTopPlayers,
  getSeriesSearch,
  listFixtureSeries,
  listSeriesArchive,
  listSeriesYear,
  listCurrentOngoingSeries,
  getSeriesByIdFront,
  listSeriesStatsFormat,
  listAllCurrentSeries,
  listSeriesScorecard,
  listSeriesFantasyTipsFront,
  listCurrentSeriesDropdown
}

const oOngoingSeriesType = {
  oSeo: (series) => {
    return { __typename: 'Seo', iId: series._id }
  }
}

const oFixtureSeriesType = {
  oSeo: (series) => {
    return { __typename: 'Seo', iId: series._id }
  },
  oCategory: (series) => {
    if (series?.iCategoryId) {
      return { __typename: 'oSeriesCategory', _id: series.iCategoryId }
    }
  }
}

const oFetchSeriesFront = {
  oSeo: (series, input, { eSubType }) => {
    return { __typename: 'Seo', iId: series.iCategoryId || series._id, eSubType }
  },
  oCategory: (series) => {
    if (series?.iCategoryId) {
      return { __typename: 'oSeriesCategory', _id: series.iCategoryId }
    }
  }
}

const resolvers = { Mutation, Query, oOngoingSeriesType, oFixtureSeriesType, oFetchSeriesFront }

module.exports = resolvers
