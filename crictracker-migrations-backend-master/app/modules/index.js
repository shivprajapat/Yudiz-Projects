const { gql } = require('graphql-tag')
const { shield } = require('graphql-shield')
const migration = require('./migrations')
const common = require('./Common')

const Mutation = {
  ...migration.resolvers.Mutation,
  ...common.resolvers.Mutation
}

const Query = {
  ...migration.resolvers.Query,
  ...common.resolvers.Query
}

const resolvers = { Mutation, Query, Date: common.resolvers.Date }

const permissions = shield({
  Mutation: { ...migration.permissions.Mutation, ...common.permissions.Mutation },
  Query: { ...migration.permissions.Query }
})

const typeDefs = gql`
scalar Date
${migration.typeDefs}
${common.typeDefs}
`

module.exports = { typeDefs, resolvers, permissions }
