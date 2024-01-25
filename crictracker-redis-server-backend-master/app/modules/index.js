const { gql } = require('apollo-server')
const common = require('./common')

const Query = {
  ...common.resolvers.Query
}

const resolvers = { Query }

const typeDefs = gql`
  ${common.typeDefs}
`

module.exports = { typeDefs, resolvers }
