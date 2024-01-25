const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    editImage: isAuthenticated,
    deleteImage: isAuthenticated
  },
  Query: {
    getImage: isAuthenticated,
    getImages: isAuthenticated
  }
}

module.exports = { typeDefs, resolvers, permissions }
