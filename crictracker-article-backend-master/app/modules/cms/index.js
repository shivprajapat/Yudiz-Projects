const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const { and } = require('graphql-shield')
const { isAuthenticated } = require('../Common/permissions')
const Permissions = require('./permissions')

const permissions = {
  Mutation: {
    addCMSPage: and(isAuthenticated, Permissions.isCreateCMSPageAuthorized),
    editCMSPage: and(isAuthenticated, Permissions.isUpdateCMSPageAuthorized),
    bulkUpdateCMSPage: and(isAuthenticated, Permissions.isEditCMSPageAuthorized)
  },
  Query: {
    listCMSPage: and(isAuthenticated, Permissions.isListCMSPageAuthorized),
    getCMSPageById: and(isAuthenticated, Permissions.isViewCMSPageAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
