const { listPlayerTags, updatePlayerTagStatus, editPlayer, bulkUpdatePlayerTag, getPlayerById, listCountry, listTeamTags, bulkUpdateTeamTag, updateTeamTagStatus, bulkEnableStatus, bulkUpdateOtherTag, editTeam, getTeamById, getCount, getPopularPlayers, listGlobalTeams, listScheduleByTeamId, listResultByTeamId, listFantasyArticlesByTeamId } = require('./controllers')

const Mutation = {
  updatePlayerTagStatus,
  editPlayer,
  bulkUpdatePlayerTag,
  bulkUpdateTeamTag,
  updateTeamTagStatus,
  bulkEnableStatus,
  bulkUpdateOtherTag,
  editTeam
}

const Query = {
  listPlayerTags,
  getPlayerById,
  listCountry,
  listTeamTags,
  getTeamById,
  getCount,
  getPopularPlayers,
  listGlobalTeams,
  listScheduleByTeamId,
  listResultByTeamId,
  listFantasyArticlesByTeamId
}

const resolvers = { Mutation, Query }

module.exports = resolvers
