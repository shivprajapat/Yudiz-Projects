const { addCurrentSeries, updateCurrentSeries, listCurrentSeries, getCurrentPopularSeries } = require('./controllers')

const Mutation = {
  addCurrentSeries,
  updateCurrentSeries
}

const Query = {
  listCurrentSeries,
  getCurrentPopularSeries
}

const oCurrentSeriesData = {
  oSeries: (series) => {
    return { __typename: 'oFetchSeries', _id: series.iSeriesId }
  }
}

const resolvers = { Mutation, Query, oCurrentSeriesData }

module.exports = resolvers
