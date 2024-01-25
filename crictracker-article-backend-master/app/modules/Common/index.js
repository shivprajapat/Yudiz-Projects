const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
  },
  Query: {
  }
}

module.exports = { typeDefs, resolvers, permissions }
