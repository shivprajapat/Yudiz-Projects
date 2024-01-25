const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    updateMigrationTag: and(isAuthenticated, Permissions.isListMigrationTagAuthorized),
    updateMigrationTagType: and(isAuthenticated, Permissions.isListMigrationTagAuthorized),
    bulkMigrationTagUpdate: and(isAuthenticated, Permissions.isListMigrationTagAuthorized),
    clearList: and(isAuthenticated, Permissions.isListMigrationTagAuthorized)
  },
  Query: {
    getMigrationTags: and(isAuthenticated, Permissions.isListMigrationTagAuthorized),
    getMigrationTagType: and(isAuthenticated, Permissions.isListMigrationTagAuthorized),
    getMigrationTagDocs: and(isAuthenticated, Permissions.isListMigrationTagAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
