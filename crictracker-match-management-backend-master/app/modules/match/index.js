// const { and } = require('graphql-shield')
// const Permissions = require('./permissions')
// const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

// const permissions = {
//   Mutation: {

//   },
//   Query: {

//   }
// }

module.exports = { typeDefs, resolvers }
