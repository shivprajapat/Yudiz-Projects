const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isUserAuthenticated, isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addFantasyUserComment: isUserAuthenticated,
    reportFantasyComment: isUserAuthenticated,
    updateFantasyCommentStatus: and(isAuthenticated, Permissions.isListCommentAuthorized),
    bulkFantasyCommentUpdate: and(isAuthenticated, Permissions.isListCommentAuthorized),
    deleteFantasyComment: and(isAuthenticated, Permissions.isListCommentAuthorized),
    likeDislikeFantasyComment: isUserAuthenticated,
    deleteFantasyFrontComment: isUserAuthenticated
  },
  Query: {
    listFantasyComments: and(isAuthenticated, Permissions.isListCommentAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
