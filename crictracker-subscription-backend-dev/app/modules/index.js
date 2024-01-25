const { gql } = require('apollo-server')
const match = require('./match')
const article = require('./article')
const fantasyArticle = require('./fantasyArticle')

const Subscription = {
  ...match.resolvers.Subscription,
  ...article.resolvers.Subscription,
  ...fantasyArticle.resolvers.Subscription
}

const resolvers = { Subscription }

const typeDefs = gql`
  type Subscription {
    ping: String
  }
  ${match.typeDefs}
  ${article.typeDefs}
  ${fantasyArticle.typeDefs}
`

module.exports = { typeDefs, resolvers }
