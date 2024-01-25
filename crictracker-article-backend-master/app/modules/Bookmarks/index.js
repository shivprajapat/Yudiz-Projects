const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const { isUserAuthenticated } = require('../Common/permissions')

const permissions = {
  Mutation: {
    addUserBookmark: isUserAuthenticated,
    deleteBookmark: isUserAuthenticated
  },
  Query: {
    listBookmarks: isUserAuthenticated,
    getBookmarks: isUserAuthenticated
  }
}

module.exports = { typeDefs, resolvers, permissions }
