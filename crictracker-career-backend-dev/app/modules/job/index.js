const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addJob: and(isAuthenticated, Permissions.isCreateJobAuthorized),
    editJob: and(isAuthenticated, Permissions.isEditJobAuthorized),
    bulkJobUpdate: and(isAuthenticated, Permissions.isUpdateJobStatusAuthorized),
    deleteJob: and(isAuthenticated, Permissions.isDeleteJobAuthorized)
  },
  Query: {
    getJobs: and(isAuthenticated, Permissions.isListJobAuthorized),
    getJobById: and(isAuthenticated, Permissions.isGetJobAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
