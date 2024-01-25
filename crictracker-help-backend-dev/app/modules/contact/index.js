const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    deleteContact: and(isAuthenticated, Permissions.isDeleteContactAuthorized),
    bulkContactDelete: and(isAuthenticated, Permissions.isDeleteContactAuthorized)
  },
  Query: {
    getContacts: and(isAuthenticated, Permissions.isListContactAuthorized),
    getContactById: and(isAuthenticated, Permissions.isGetContactAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
