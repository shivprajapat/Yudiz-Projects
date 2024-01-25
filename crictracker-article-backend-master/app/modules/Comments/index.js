const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isUserAuthenticated, isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addUserComment: isUserAuthenticated,
    reportComment: isUserAuthenticated,
    updateCommentStatus: and(isAuthenticated, Permissions.isListCommentAuthorized),
    bulkCommentUpdate: and(isAuthenticated, Permissions.isListCommentAuthorized),
    deleteComment: and(isAuthenticated, Permissions.isListCommentAuthorized),
    likeDislikeComment: isUserAuthenticated,
    deleteFrontComment: isUserAuthenticated
  },
  Query: {
    listComments: and(isAuthenticated, Permissions.isListCommentAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
