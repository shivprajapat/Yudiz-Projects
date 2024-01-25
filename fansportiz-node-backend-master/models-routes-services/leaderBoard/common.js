const MatchLeagueModel = require('../matchLeague/model')
const config = require('../../config/config')
const { redisClient2 } = require('../../helper/redis')

async function leaderboardCommonFunction(iMatchLeagueId) {
  const matchLeague = await MatchLeagueModel.findOne({ _id: iMatchLeagueId }, { aPlayerRole: 0 }).lean().cache(config.CACHE_2, `matchLeague:${iMatchLeagueId}`)

  const iMatchId = matchLeague?.iMatchId?._id ? matchLeague.iMatchId._id.toString() : matchLeague.iMatchId
  const sLastUpdatedTill = matchLeague.iMatchId.sLastUpdatedTill
  return { matchLeague, iMatchId, sLastUpdatedTill }
}

async function checkCached (iMatchId, iMatchLeagueId) {
  const cached = await redisClient2.hmget(`hml:{${iMatchId}}:${iMatchLeagueId}`, 'exists', 'putTime', 'expireTime', 'matchId')
  return cached
}

module.exports = { leaderboardCommonFunction, checkCached }
