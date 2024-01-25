const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addHeaderMenu: isAuthenticated
  }
}

module.exports = { typeDefs, resolvers, permissions }
