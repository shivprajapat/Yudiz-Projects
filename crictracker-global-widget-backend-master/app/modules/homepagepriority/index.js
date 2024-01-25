const { isAuthenticated } = require('../Common/permissions')

const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    updateHomePagePriority: isAuthenticated
  },
  Query: {
    getHomePagePriority: isAuthenticated
  }
}

module.exports = { typeDefs, resolvers, permissions }
