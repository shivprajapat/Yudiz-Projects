const { and } = require('graphql-shield')
const { isAuthenticated } = require('../Common/permissions')
const permission = require('./permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Query: {
    getPlayerById: and(isAuthenticated, permission.editPlayerTag),
    getTeamById: and(isAuthenticated, permission.editTeamTag),
    listPlayerTags: and(isAuthenticated, permission.listTag),
    listTeamTags: and(isAuthenticated, permission.listTag)
  },
  Mutation: {
    bulkEnableStatus: and(isAuthenticated, permission.bulkActionAuthorized),
    editPlayer: and(isAuthenticated, permission.editPlayerTag),
    bulkUpdateOtherTag: and(isAuthenticated, permission.approveRejectTag),
    editTeam: and(isAuthenticated, permission.editTeamTag)
  }
}

module.exports = { typeDefs, resolvers, permissions }
