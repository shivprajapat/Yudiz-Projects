const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    bulkEnquiryUpdate: and(isAuthenticated, Permissions.isEditEnquiryAuthorized),
    deleteEnquiry: and(isAuthenticated, Permissions.isDeleteEnquiryAuthorized)
  },
  Query: {
    getEnquiries: and(isAuthenticated, Permissions.isListEnquiryAuthorized),
    getEnquiryById: and(isAuthenticated, Permissions.isGetEnquiryAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
