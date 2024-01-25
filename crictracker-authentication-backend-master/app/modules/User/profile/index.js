const typedef = require('./typedef')
const resolvers = require('./resolvers')
const { gql } = require('graphql-tag')

const typeDefs = gql`
  ${typedef}
`

const exp = { typeDefs, resolvers }

module.exports = exp
