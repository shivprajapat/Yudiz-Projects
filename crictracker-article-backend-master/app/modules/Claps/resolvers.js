const { updateArticleClap, getUserArticleClap, getNewsArticleTotalClaps } = require('./controllers')

const Mutation = {
  updateArticleClap
}

const Query = {
  getUserArticleClap,
  getNewsArticleTotalClaps
}

const resolvers = { Mutation, Query }

module.exports = resolvers
