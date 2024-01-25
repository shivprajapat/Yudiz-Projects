const { getDefaultRoles, getPermissions, addRole, getRoles, getRoleById, deleteRole, editRole, getUserPermissions } = require('./controllers')

const Query = {
  getPermissions,
  getRoles,
  getRoleById,
  getDefaultRoles,
  getUserPermissions
}

const Mutation = {
  addRole,
  deleteRole,
  editRole
}

const resolvers = { Mutation, Query }

module.exports = resolvers
