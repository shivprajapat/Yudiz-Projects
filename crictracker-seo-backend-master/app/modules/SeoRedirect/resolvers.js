const { addSeoRedirect, editSeoRedirect, getSeoRedirect, getSeoRedirectById, bulkSeoRedirectUpdate, bulkSeoRedirectUpdateV2 } = require('./controllers')

const Mutation = {
  bulkSeoRedirectUpdate,
  addSeoRedirect,
  editSeoRedirect,
  bulkSeoRedirectUpdateV2
}

const Query = {
  getSeoRedirect,
  getSeoRedirectById
}

const resolvers = { Mutation, Query }

module.exports = resolvers
