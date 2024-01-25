const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addPoll: and(isAuthenticated, Permissions.isAddPollAuthorized),
    editPoll: and(isAuthenticated, Permissions.isEditPollAuthorized),
    bulkDeletePoll: and(isAuthenticated, Permissions.isDeletePollAuthorized)
  },
  Query: {
    getPollById: and(isAuthenticated, Permissions.isViewPollAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
