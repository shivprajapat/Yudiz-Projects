const { insertContact, deleteContact, getContacts, getContactById, bulkContactDelete, getContactQueryType } = require('./controllers')

const Mutation = {
  insertContact,
  bulkContactDelete,
  deleteContact
}

const Query = {
  getContacts,
  getContactById,
  getContactQueryType
}

const resolvers = { Mutation, Query }

module.exports = resolvers
