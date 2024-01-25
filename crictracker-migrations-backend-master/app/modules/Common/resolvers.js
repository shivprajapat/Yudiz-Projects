const { mergeTag, makeHomePageArticle } = require('./controllers')
const { Date } = require('./scalars')

const Mutation = {
  mergeTag
}

const Query = {
  makeHomePageArticle
}

const resolvers = { Mutation, Query, Date }

module.exports = resolvers
