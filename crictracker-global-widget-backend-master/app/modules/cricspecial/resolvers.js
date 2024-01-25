const { getCricSpecial } = require('./controllers')
const Query = {
  getCricSpecial
}

const Cricspecial = {
  oSeo: (article) => {
    return { __typename: 'Seo', iId: article.iArticleId }
  }
}

const resolvers = { Query, Cricspecial }

module.exports = resolvers
