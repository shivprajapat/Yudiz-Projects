const { getRankings, getPlayerRanking, getTeamRanking, getRankingsOverview } = require('./controllers')

const Query = {
  getRankings,
  getPlayerRanking,
  getTeamRanking,
  getRankingsOverview
}

const resolvers = { Query }

module.exports = resolvers
