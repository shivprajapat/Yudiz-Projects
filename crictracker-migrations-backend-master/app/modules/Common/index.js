const { isAuthenticated } = require('./permissions')
const resolvers = require('./resolvers')
const typeDefs = require('./typedef')

const permissions = {
  Mutation: {
    mergeTag: isAuthenticated
  },
  Query: {
  }
}

module.exports = { typeDefs, resolvers, permissions }
