const { bulkUpdateUsers, deleteUserAdmin, listUsers, viewUserDetail, deleteUser } = require('./controllers')

const Mutation = {
  bulkUpdateUsers,
  deleteUserAdmin,
  deleteUser
}

const Query = {
  listUsers,
  viewUserDetail
}

const resolvers = { Query, Mutation }

module.exports = resolvers
