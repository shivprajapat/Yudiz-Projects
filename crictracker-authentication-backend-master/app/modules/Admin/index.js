const { gql } = require('graphql-tag')
const auth = require('./Auth')
const roles = require('./Roles')
const common = require('./Common')
const subAdmin = require('./Sub-admin')
const { and } = require('graphql-shield')

const permissions = {
  Mutation: {
    addRole: and(common.permissions.isAuthenticated, roles.permissions.isRoleNameUnique, roles.permissions.isCreateRoleAuthorized, roles.permissions.areParentRolePermissionsPresent),
    adminLogout: common.permissions.isAuthenticated,
    deleteRole: and(common.permissions.isAuthenticated, roles.permissions.isDeleteRoleAuthorized, roles.permissions.isRoleAssigned),
    editRole: and(common.permissions.isAuthenticated, roles.permissions.isRoleNameSameOrUnique, roles.permissions.isEditRoleAuthorized, roles.permissions.areParentRolePermissionsPresent),
    createSubAdmin: and(common.permissions.isAuthenticated, subAdmin.permissions.isCreateSubAdminAuthorized),
    generatePreSignedUrl: common.permissions.isAuthenticated,
    editSubAdmin: and(common.permissions.isAuthenticated, subAdmin.permissions.isEditSubAdminAuthorized),
    editProfile: common.permissions.isAuthenticated,
    bulkAction: and(common.permissions.isAuthenticated, subAdmin.permissions.isBulkActionAuthorized),
    editSubAdminProfilePicture: common.permissions.isAuthenticated,
    changePassword: common.permissions.isAuthenticated,
    changeAdminPicture: and(common.permissions.isAuthenticated, subAdmin.permissions.isChangePictureAuthorized)
  },
  Query: {
    getProfile: common.permissions.isAuthenticated,
    getPermissions: common.permissions.isAuthenticated,
    getUserPermissions: common.permissions.isAuthenticated,
    getRoles: and(common.permissions.isAuthenticated, roles.permissions.isListRoleAuthorized),
    getRoleById: common.permissions.isAuthenticated,
    getDefaultRoles: common.permissions.isAuthenticated,
    generateUsername: common.permissions.isAuthenticated,
    listSubAdmins: and(common.permissions.isAuthenticated, subAdmin.permissions.isListAdminAuthorized),
    getSubAdmin: and(common.permissions.isAuthenticated, subAdmin.permissions.isEditSubAdminAuthorized),
    authenticateAdmin: common.permissions.isAuthenticated
  }
}

const Mutation = {
  ...auth.resolvers.Mutation,
  ...roles.resolvers.Mutation,
  ...common.resolvers.Mutation,
  ...subAdmin.resolvers.Mutation
}

const Query = {
  ...roles.resolvers.Query,
  ...common.resolvers.Query,
  ...subAdmin.resolvers.Query
}

const resolvers = { Mutation, Query, subAdmin: subAdmin.resolvers.subAdmin }
const typeDefs = gql`${auth.typeDefs} ${roles.typeDefs} ${common.typeDefs} ${subAdmin.typeDefs}`

module.exports = { typeDefs, resolvers, permissions }
