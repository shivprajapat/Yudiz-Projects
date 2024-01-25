const BotLogModel = require('../botLogs/model')
const axios = require('axios')
const config = require('../../config/config')
const { handleCatchError } = require('../../helper/utilities.services')
const cachegoose = require('recachegoose')
const { queuePush } = require('../../helper/redis')

async function joinCopyBotAfterMinJoinCount(payload) {
  /* eType=user.eType
    iMatchId: matchLeague.iMatchId,
*/
  const { bDoCopyBot, token, eType, iMatchId, iMatchLeagueId, teamCount, nMinTeamCount, iAdminId } = payload
  if (bDoCopyBot && token && eType === 'U') {
    try {
      const botlog = await BotLogModel.create({
        iMatchId,
        iMatchLeagueId,
        nTeams: teamCount * nMinTeamCount,
        iAdminId,
        bInstantAdd: false,
        eType: 'CB'
      })

      axios.post(`${config.FANTASY_NODE_URL}/api/admin/copy-joined-user-team/${iMatchId}/v1`, {
        iMatchLeagueId: iMatchLeagueId,
        iBotLogId: botlog._id,
        teamCount: teamCount
      }, { headers: { 'Content-Type': 'application/json', Authorization: token } }).catch(e => {
        (async () => {
          handleCatchError(e)
          // await BotLogModel.updateOne({ _id: ObjectId(botlog._id) }, { $inc: { nErrors: 1 }, $push: { aError: e } })
          await queuePush('BOTLOGS_UPDATE_COUNT', { id: botlog._id.toString(), nErrorsCount: 1, error: e })
        })()
      })
    } catch (e) {
      handleCatchError(e)
    }
    cachegoose.clearCache(`matchLeague:${iMatchLeagueId}:active`)
  }
}

async function normalCopyBotJoin(payload) {
  try {
    /**
       iMatchId = matchLeague.iMatchId,
       iUserTeamId = remainTeam.iUserTeamId
       */
    let { nCopyBotsPerTeam, token, iAdminId, iMatchId, iMatchLeagueId, iUserId, iUserTeamId, bDoCopyBot, bCopyBotInit } = payload

    if (token) {
      const botlog = await BotLogModel.create({
        iMatchId,
        iMatchLeagueId,
        nTeams: nCopyBotsPerTeam,
        iAdminId,
        bInstantAdd: false,
        eType: 'CB'
      })
      try {
        await axios.post(`${config.FANTASY_NODE_URL}/api/admin/copy-user-team/${iMatchId}/v1`, {
          iMatchLeagueId: iMatchLeagueId,
          iUserId: iUserId,
          iBotLogId: botlog._id,
          aUserTeamId: [iUserTeamId],
          teamCount: nCopyBotsPerTeam
        }, { headers: { 'Content-Type': 'application/json', Authorization: token } })

        bDoCopyBot = (bCopyBotInit === false)
        return bDoCopyBot
      } catch (e) {
        // await BotLogModel.updateOne({ _id: ObjectId(botlog._id) }, { $inc: { nErrors: 1 }, $push: { aError: e } })
        await queuePush('BOTLOGS_UPDATE_COUNT', { id: botlog._id.toString(), nErrorsCount: 1, error: e })
        handleCatchError(e)
      }
    }
  } catch (e) {
    handleCatchError(e)
  }
}

module.exports = {
  joinCopyBotAfterMinJoinCount,
  normalCopyBotJoin
}
