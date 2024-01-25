const { getTrendingNews } = require('./controllers')
const Query = {
  getTrendingNews
}

const TrendingNews = {
  oSeo: (article) => {
    return { __typename: 'Seo', iId: article.iArticleId }
  }
}

const resolvers = { Query, TrendingNews }

module.exports = resolvers
