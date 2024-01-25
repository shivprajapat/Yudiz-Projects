const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const { and } = require('graphql-shield')
const { isAuthenticated } = require('../Common/permissions')
const Permissions = require('./permissions')

const permissions = {
  Mutation: {
    addCurrentSeries: and(isAuthenticated, Permissions.isCreateCurrentSeriesAuthorized),
    updateCurrentSeries: and(isAuthenticated, Permissions.isUpdateCurrentSeriesAuthorized)
  },
  Query: {
    listCurrentSeries: and(isAuthenticated, Permissions.isListCurrentSeriesAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
