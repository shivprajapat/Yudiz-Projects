const { gql } = require('graphql-tag')
const { shield } = require('graphql-shield')
const feedback = require('./feedback')
const contact = require('./contact')
const common = require('./Common')

const Mutation = {
  ...feedback.resolvers.Mutation,
  ...contact.resolvers.Mutation

}

const Query = {
  ...feedback.resolvers.Query,
  ...contact.resolvers.Query,
  ...common.resolvers.Query
}

const resolvers = { Mutation, Query, Date: common.resolvers.Date }

const typeDefs = gql`
  extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.3",
              import: [{ name: "@key"}, { name: "@external" }, { name: "@shareable" }])
  scalar Date

  ${feedback.typeDefs}
  ${contact.typeDefs}
  ${common.typeDefs}
`
const permissions = shield({
  Mutation: { ...feedback.permissions.Mutation, ...contact.permissions.Mutation },
  Query: { ...feedback.permissions.Query, ...contact.permissions.Query }
})

module.exports = { typeDefs, resolvers, permissions }
