const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addTag: and(isAuthenticated, Permissions.isCreateTagAuthorized),
    editTag: and(isAuthenticated, Permissions.isEditTagAuthorized),
    updateTagStatus: and(isAuthenticated, Permissions.isEditRequestedTagAuthorized),
    bulkTagUpdate: and(isAuthenticated, Permissions.bulkActionAuthorized),
    deleteTag: and(isAuthenticated, Permissions.isDeleteTagAuthorized)
  },
  Query: {
    getTags: and(isAuthenticated, Permissions.isListTagAuthorized),
    getTagById: and(isAuthenticated, Permissions.isGetTagAuthorized),
    getTagByIdFront: (Permissions.isFavouriteTag),
    getTagCounts: and(isAuthenticated)
  }
}

module.exports = { typeDefs, resolvers, permissions }
