const { and } = require('graphql-shield')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')

const permissions = {
  Mutation: {
    bulkPlaylistUpdate: and(isAuthenticated, Permissions.isEditPlaylistAuthorized),
    updatePlaylist: and(isAuthenticated, Permissions.isEditPlaylistAuthorized)
  },
  Query: {
    getPlaylists: and(isAuthenticated, Permissions.isListPlaylistAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
