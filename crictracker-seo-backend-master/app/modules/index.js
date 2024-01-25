const { gql } = require('graphql-tag')
const { shield } = require('graphql-shield')
// const common = require('./Common')
const seo = require('./Seo')
const seoRedirect = require('./SeoRedirect')

const Mutation = {
  ...seo.resolvers.Mutation,
  ...seoRedirect.resolvers.Mutation
}

const Query = {
  ...seo.resolvers.Query,
  ...seoRedirect.resolvers.Query
}

const resolvers = { Mutation, Seo: seo.resolvers.Seo, Query, oCustomSeo: seo.resolvers.oCustomSeo, Seos: seo.resolvers.Seos }

const permissions = shield({
  Mutation: {
    ...seo.permissions.Mutation,
    ...seoRedirect.permissions.Mutation
  },
  Query: {
    ...seo.permissions.Query,
    ...seoRedirect.permissions.Query
  }
})

const typeDefs = gql`
  extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.3",
              import: [{ name: "@key"}, { name: "@external" }, { name: "@shareable" }])
  ${seo.typeDefs}
  ${seoRedirect.typeDefs}
`

module.exports = { typeDefs, resolvers, permissions }
