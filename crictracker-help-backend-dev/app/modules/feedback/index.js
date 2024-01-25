const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    deleteFeedback: and(isAuthenticated, Permissions.isDeleteFeedbackAuthorized),
    bulkFeedbackDelete: and(isAuthenticated, Permissions.isDeleteFeedbackAuthorized)
  },
  Query: {
    getFeedbacks: and(isAuthenticated, Permissions.isListFeedbackAuthorized),
    getFeedbackById: and(isAuthenticated, Permissions.isGetFeedbackAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
