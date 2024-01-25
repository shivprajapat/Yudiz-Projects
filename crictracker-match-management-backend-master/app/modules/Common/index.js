const { and } = require('graphql-shield')
const resolvers = require('./resolvers')
const { isAuthenticated } = require('../Common/permissions')

const typeDefs = require('./typedef')

const permission = {
  Mutation: {
    removeWeatherCache: and(isAuthenticated)
  }
}

module.exports = { resolvers, typeDefs, permission }
