const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Seo/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addSeoRedirect: and(isAuthenticated, Permissions.isAddSeoRedirectAuthorized),
    editSeoRedirect: and(isAuthenticated, Permissions.isEditSeoRedirectAuthorized),
    bulkSeoRedirectUpdate: and(isAuthenticated, Permissions.isUpdateSeoRedirectAuthorized),
    bulkSeoRedirectUpdateV2: and(isAuthenticated, Permissions.isUpdateSeoRedirectAuthorized)
  },
  Query: {
    getSeoRedirect: and(isAuthenticated, Permissions.isListSeoRedirectAuthorized),
    getSeoRedirectById: and(isAuthenticated, Permissions.isViewSeoRedirectAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
