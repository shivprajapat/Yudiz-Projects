const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const { isUserAuthenticated } = require('../Common/permissions')

const permissions = {
  Query: {
    getUserArticleClap: isUserAuthenticated
  }
}

module.exports = { typeDefs, resolvers, permissions }
