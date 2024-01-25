const { gql } = require('graphql-tag')
const admin = require('./Admin')
const user = require('./User')
const author = require('./Author')
const { shield } = require('graphql-shield')

const Mutation = {
  ...admin.resolvers.Mutation,
  ...user.resolvers.Mutation
}

const Query = {
  ...admin.resolvers.Query,
  ...user.resolvers.Query,
  ...author.resolvers.Query
}

const resolvers = { Mutation, Query, subAdmin: admin.resolvers.subAdmin, user: user.resolvers.user, Author: author.resolvers.Author, Date: user.resolvers.Date }

const permissions = shield({
  Mutation: { ...admin.permissions.Mutation, ...user.permissions.Mutation },
  Query: { ...admin.permissions.Query, ...user.permissions.Query }
})

const typeDefs = gql`
  extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.3",
              import: [{ name: "@key"}, { name: "@external" }, { name: "@shareable" }])
  scalar Date

  type Query {
    ping: String
  }
  type Mutation {
    ping: String
  }
  ${admin.typeDefs}
  ${user.typeDefs}
  ${author.typeDefs}
`

module.exports = { typeDefs, resolvers, permissions }
