const { getHomeWidgets, updateHomeWidgets } = require('./controllers')
const Query = {
  getHomeWidgets
}

const Mutation = {
  updateHomeWidgets
}

const aResultType = {
  oSeries: (data) => {
    if (data.iSeriesId) {
      return { __typename: 'oFetchSeries', _id: data.iSeriesId }
    }
  },
  oSeo: (data) => {
    if (data.iArticleId) {
      return { __typename: 'Seo', iId: data.iArticleId }
    }
  }
}

const resolvers = { Query, Mutation, aResultType }

module.exports = resolvers
