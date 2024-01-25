const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const { and } = require('graphql-shield')
const Permissions = require('./permissions')

const permissions = {
  Mutation: {
    addLiveBlogContent: and(isAuthenticated),
    editLiveBlogContent: and(isAuthenticated),
    deleteLiveBlogContent: and(isAuthenticated),
    addLiveBlogEvent: and(isAuthenticated, Permissions.isAddLiveEventAuthorized),
    editLiveBlogEvent: and(isAuthenticated, Permissions.isEditLiveEventAuthorized),
    bulkDeleteLiveBlogEvent: and(isAuthenticated, Permissions.isDeleteLiveEventAuthorized),
    updateMatchScores: isAuthenticated
  },
  Query: {
    getLiveBlogContent: isAuthenticated,
    listLiveBlogContent: isAuthenticated,
    listLiveBlogEvents: and(isAuthenticated, Permissions.isListLiveEventAuthorized),
    getLiveBlogEventById: isAuthenticated
  }
}

module.exports = { typeDefs, resolvers, permissions }
