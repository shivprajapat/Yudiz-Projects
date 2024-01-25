const { and } = require('graphql-shield')
const { isUserAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addFavourite: and(isUserAuthenticated),
    deleteFavourite: and(isUserAuthenticated)
  },
  Query: {
    listFavourite: and(isUserAuthenticated)
  }
}

const exp = { typeDefs, resolvers, permissions }

module.exports = exp
