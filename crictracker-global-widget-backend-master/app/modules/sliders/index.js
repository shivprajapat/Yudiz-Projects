const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const { isAuthenticated } = require('../Common/permissions')

const permissions = {
  Mutation: {
    addSlider: isAuthenticated
  }
}

module.exports = { typeDefs, resolvers, permissions }
