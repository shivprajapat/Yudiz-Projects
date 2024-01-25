const { gql } = require('graphql-tag')
const { shield } = require('graphql-shield')
const enquiry = require('./enquiry')
const job = require('./job')
const common = require('./Common')

const Mutation = {
  ...job.resolvers.Mutation,
  ...enquiry.resolvers.Mutation
}

const Query = {
  ...job.resolvers.Query,
  ...enquiry.resolvers.Query,
  ...common.resolvers.Query
}

const resolvers = { Mutation, Query, jobGetData: job.resolvers.jobGetData, jobFrontGetData: job.resolvers.jobFrontGetData }

const typeDefs = gql`
  extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.3",
              import: [{ name: "@key"}, { name: "@external" }, { name: "@shareable" }])

  ${job.typeDefs}
  ${enquiry.typeDefs}
  ${common.typeDefs}
`

const permissions = shield({
  Mutation: { ...job.permissions.Mutation, ...enquiry.permissions.Mutation },
  Query: { ...job.permissions.Query, ...enquiry.permissions.Query }
})

module.exports = { typeDefs, resolvers, permissions }
