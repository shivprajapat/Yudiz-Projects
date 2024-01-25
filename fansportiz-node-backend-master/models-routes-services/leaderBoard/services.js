const UserLeagueModel = require('../userLeague/model')
const MatchLeagueModel = require('../matchLeague/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { leaderboardCommonFunction, checkCached } = require('./common')
const { catchError, handleCatchError } = require('../../helper/utilities.services')
const { redisClient2 } = require('../../helper/redis')
const ObjectId = require('mongoose').Types.ObjectId
const config = require('../../config/config')

class LeaderBoard {
  async userTeamListV2(req, res) {
    try {
      let data = []
      const iMatchLeagueId = req.params.id

      const { matchLeague, iMatchId, sLastUpdatedTill } = await leaderboardCommonFunction(iMatchLeagueId)
      if (!matchLeague) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      const isCached = await checkCached(iMatchId, iMatchLeagueId)

      if (isCached[0] && matchLeague?.eMatchStatus !== 'CMP') {
        const teamIds = []
        const userData = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(req.params.id), iUserId: req.user._id }, { sType: 0, eType: 0, bSwapped: 0 }).lean()

        userData.forEach(s => {
          teamIds.push(s.iUserTeamId)
        })
        const redisData = await redisClient2.evalsha('5111ebb3688a5c52bd02c6df453b42710ede8f94', 1, `ml:{${iMatchId}}:${iMatchLeagueId}`, ...teamIds)

        userData.forEach(s => {
          redisData.forEach(singleTeam => {
            if (s.iUserTeamId.toString() === singleTeam[0]) {
              const obj = { ...s }
              obj.nTotalPoints = parseFloat(singleTeam[1])
              obj.nRank = singleTeam[2]
              data.push(obj)
            }
          })
        })
      } else {
        data = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(req.params.id), iUserId: req.user._id }, { sType: 0, eType: 0, bSwapped: 0 }).sort({ nRank: 1 }).lean()
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leaderboard), data, nJoined: matchLeague.nJoined, sLastUpdatedTill })
    } catch (error) {
      return catchError('LeaderBoard.userTeamList', error, req, res)
    }
  }

  async allTeamListV2(req, res) {
    try {
      const { nPutTime } = req.query
      const iMatchLeagueId = req.params.id
      let { nLimit, nOffset } = req.query

      const { matchLeague, iMatchId } = await leaderboardCommonFunction(iMatchLeagueId)
      if (!matchLeague) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      const isCached = await checkCached(iMatchId, iMatchLeagueId)

      let teams
      let bFullResponse = false
      let bCached = false

      if (isCached[0] && matchLeague.eMatchStatus !== 'CMP') {
        bCached = !!isCached[0]
        if (nPutTime && parseInt(isCached[1]) > parseInt(nPutTime)) {
          nLimit = parseInt(nOffset) + parseInt(nLimit)
          nOffset = 0
          bFullResponse = true
        }
        teams = await redisLeaderBoard(iMatchId, parseInt(nOffset), parseInt(nLimit), iMatchLeagueId)
        teams.sort((a, b) => (a.nRank > b.nRank ? 1 : -1))
        teams = teams.map(team => { return { ...team, eType: undefined, sType: undefined } })
      } else {
        nLimit = parseInt(nLimit) || 100
        nOffset = parseInt(nOffset) || 0
        teams = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(iMatchLeagueId), bCancelled: false }, { sType: 0, eType: 0, bSwapped: 0 }).sort({ nRank: 1 }).skip(nOffset).limit(nLimit).lean()
      }

      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leaderboard),
        data: teams,
        bCached: bCached,
        nPutTime: isCached[1],
        bFullResponse: bFullResponse
      })
    } catch (error) {
      return catchError('LeaderBoard.allTeamList', error, req, res)
    }
  }

  async adminTeamList(req, res) {
    try {
      const { nPutTime } = req.query
      const iMatchLeagueId = req.params.id
      let { nLimit, nOffset } = req.query

      const { matchLeague, iMatchId } = await leaderboardCommonFunction(iMatchLeagueId)
      if (!matchLeague) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      const isCached = await checkCached(iMatchId, iMatchLeagueId)

      let teams
      let bFullResponse = false
      let bCached = false

      if (Number(isCached[0])) {
        bCached = !!Number(isCached[0])
        if (nPutTime && parseInt(isCached[1]) > parseInt(nPutTime)) {
          nLimit = parseInt(nOffset) + parseInt(nLimit)
          nOffset = 0
          bFullResponse = true
        }
        teams = await redisLeaderBoard(iMatchId, parseInt(nOffset), parseInt(nLimit), iMatchLeagueId)
        teams.sort((a, b) => (a.nRank > b.nRank ? 1 : -1))
        teams = teams.map(team => { return { ...team, eType: undefined, sType: undefined } })
      } else {
        nLimit = parseInt(nLimit) || 100
        nOffset = parseInt(nOffset) || 0
        teams = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(iMatchLeagueId) }, { sType: 0, eType: 0, bSwapped: 0 }).sort({ nRank: 1 }).skip(nOffset).limit(nLimit).lean()
      }

      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leaderboard),
        data: teams,
        bCached: bCached,
        nPutTime: isCached[1],
        bFullResponse: bFullResponse
      })
    } catch (error) {
      return catchError('LeaderBoard.adminTeamList', error, req, res)
    }
  }
}

async function redisLeaderBoard(iMatchId, start = 0, end = 10, iMatchLeagueId = null) {
  try {
    const data = await redisClient2.evalsha('5b9a4657e92b7ce3a7abe5cbb7441730454eda5e', 1, `ml:{${iMatchId}}:${iMatchLeagueId}`, start, start + end - 1)
    const userTeams = {}
    const finalData = []
    if (data.length > 0) {
      data.forEach(s => { userTeams[s[0]] = { nTotalPoints: parseFloat(s[1]), nRank: s[2] } })
      let ids = Object.keys(userTeams)
      ids = ids.map(s => ObjectId(s))

      const userData = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(iMatchLeagueId), iUserTeamId: { $in: ids }, bCancelled: false }, { __v: 0 }, { readPreference: 'primary' }).lean()

      userData.forEach(s => {
        const obj = { ...s }
        obj.nTotalPoints = userTeams[s.iUserTeamId].nTotalPoints
        obj.nRank = userTeams[s.iUserTeamId].nRank
        finalData.push(obj)
      })
    }

    return finalData
  } catch (error) {
    handleCatchError(error)
    return { isSuccess: false }
  }
}

module.exports = new LeaderBoard()
