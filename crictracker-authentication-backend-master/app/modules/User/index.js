const { gql } = require('graphql-tag')
const auth = require('./Auth')
const profile = require('./profile')
const common = require('./Common')
const commonAdmin = require('../Admin/Common')
const user = require('./Auth')
const management = require('./management')
const { and } = require('graphql-shield')

const permissions = {
  Mutation: {
    updateProfile: common.permissions.isUserAuthenticated,
    updateProfileImage: common.permissions.isUserAuthenticated,
    generateProfilePreSignedUrl: common.permissions.isUserAuthenticated,
    bulkUpdateUsers: management.permissions.isUpdateUserAuthorized,
    deleteUser: management.permissions.isDeletUserAuthorized,
    userChangePassword: common.permissions.isUserAuthenticated,
    deleteUserAdmin: and(commonAdmin.permissions.isAuthenticated, management.permissions.isUpdateUserAuthorized)
  },
  Query: {
    getUser: common.permissions.isUserAuthenticated,
    listUsers: management.permissions.isListUserAuthorized,
    viewUserDetail: management.permissions.isViewUserAuthorized
  }
}

const Mutation = {
  ...auth.resolvers.Mutation,
  ...profile.resolvers.Mutation,
  ...management.resolvers.Mutation
}

const Query = {
  ...profile.resolvers.Query,
  ...management.resolvers.Query
}

const resolvers = { Mutation, Query, user: user.resolvers.user, Date: common.resolvers.Date }
const typeDefs = gql`${auth.typeDefs} ${profile.typeDefs} ${management.typeDefs}`

module.exports = { typeDefs, resolvers, permissions }
