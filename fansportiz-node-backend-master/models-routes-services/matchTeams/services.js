const UserTeamModel = require('../userTeam/model')
const UserLeagueModel = require('../userLeague/model')
const MyMatchesModel = require('../myMatches/model')
const { catchError, pick, getIp } = require('../../helper/utilities.services')
const validateMatch = require('../userTeam/common')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const MatchTeamsModel = require('../matchTeams/model')
const MatchPlayerModel = require('../matchPlayer/model')
const StatisticsModel = require('../user/statistics/model')
const crypto = require('crypto')
const { createAdminLog } = require('../commonRules/grpc/clientServices')
const { redisClient } = require('../../helper/redis')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { CopyTeamUpdate } = require('../queue/matchQueue')

class MatchTeams {
  async createTeam(req, res) {
    try {
      const { iMatchId, aPlayers, sName, iCaptainId, iViceCaptainId, bAdminRecomended } = req.body
      const iUserId = req.admin.iAdminId
      req.body = pick(req.body, ['iMatchId', 'sName', 'aPlayers', 'iCaptainId', 'iViceCaptainId'])

      const result = await validateMatch(req.body, iUserId, req.userLanguage)
      if (result.isSuccess === false) return res.status(result.status).jsonp({ status: result.status, message: result.message })
      const matchPlayerMap = result.matchPlayerMap
      const nTotalCredit = result.nTotalCredit
      const match = result.match

      // generate team name
      let teamName
      if (sName) {
        teamName = sName
      } else {
        const userTeams = await UserTeamModel.countDocuments({ iMatchId: ObjectId(iMatchId), iUserId, bAdminRecomended: true }, { readPreference: 'primary' })
        teamName = `T${userTeams + 1}`
      }

      // check team is exist
      const UserTeamPlayer = aPlayers.sort((a, b) => a > b ? 1 : -1)
      const TeamHash = crypto.createHash('sha1').update(JSON.stringify(UserTeamPlayer).toString()).digest('hex')

      const matchingTeam = await UserTeamModel.findOne({
        bAdminRecomended: true,
        iMatchId: ObjectId(iMatchId),
        iUserId,
        $or: [{
          sHash: TeamHash,
          iCaptainId: ObjectId(iCaptainId),
          iViceCaptainId: ObjectId(iViceCaptainId)
        }, {
          sName
        }]
      }, { sName: 1 }, { readPreference: 'primary' }).lean()

      if (matchingTeam) {
        if (matchingTeam.sName === sName) {
          return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cteamName) })
        }
        return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cteam), data: { _id: matchingTeam._id } })
      }

      const matchPlayer = await MatchPlayerModel.countDocuments({ _id: { $in: aPlayers }, eStatus: 'N' })
      if (matchPlayer) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].matchPlayer_deleted, type: 'refresh_matchplayer_data' })

      const nSameTeamCount = await redisClient.incrby(`${iUserId}:${iMatchId}:${TeamHash}:${iCaptainId}:${iViceCaptainId}`, 1)
      await redisClient.expire(`${iUserId}:${iMatchId}:${TeamHash}:${iCaptainId}:${iViceCaptainId}`, 10)
      if (nSameTeamCount > 1) { return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cnewUserTeam), type: 'concurrent_same_team' }) }

      const data = await UserTeamModel.create({ iMatchId, sName: teamName, sHash: TeamHash, iCaptainId, iViceCaptainId, iUserId, eCategory: match.eCategory, eType: 'U', bAdminRecomended: true })
      if (!data) {
        return res.status(status.InternalServerError).jsonp({
          status: jsonStatus.InternalServerError,
          message: messages[req.userLanguage].error,
          type: 'userteam_create_nodata'
        })
      }

      await MyMatchesModel.updateOne({ iMatchId: ObjectId(iMatchId), iUserId }, { $inc: { nTeams: 1 }, nWinnings: 0, eMatchStatus: match.eStatus, eCategory: match.eCategory, dStartDate: match.dStartDate }, { upsert: true })

      const matchTeam = await MatchTeamsModel.findOne({ iMatchId: ObjectId(iMatchId), sHash: TeamHash, bAdminRecomended: true }, { _id: 1 }, { readPreference: 'primary' }).lean()

      if (!matchTeam) {
        await MatchTeamsModel.create({ aPlayers: matchPlayerMap, iMatchId, sHash: TeamHash, nTotalCredit, eCategory: match.eCategory, bAdminRecomended: true })
      }

      await StatisticsModel.updateOne({ iUserId }, { $inc: { nTeams: 1 } }, { upsert: true })
      data.eType = undefined
      data.bSwapped = undefined

      if (bAdminRecomended) {
        const oNewFields = { ...data }
        const logData = { oOldFields: {}, oNewFields, sIP: getIp(req), iAdminId: iUserId, eKey: 'PC' }
        await createAdminLog(logData)
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cnewUserTeam), data })
    } catch (error) {
      catchError('MatchTeams.createTeam', error, req, res)
    }
  }

  async upateRecomendetedTeam(req, res) {
    try {
      const { iMatchId, aPlayers, sName, iCaptainId, iViceCaptainId } = req.body
      const iUserId = req.user._id
      req.body = pick(req.body, ['iMatchId', 'sName', 'aPlayers', 'iCaptainId', 'iViceCaptainId'])
      req.body.bIsUpdate = true
      const result = await this.validateMatch(req.body, iUserId, req.userLanguage)

      if (result.isSuccess === false) return res.status(result.status).jsonp({ status: result.status, message: result.message })
      const matchPlayerMap = result.matchPlayerMap
      const nTotalCredit = result.nTotalCredit
      // check team is exist
      const UserTeamPlayer = aPlayers.sort((a, b) => a > b ? 1 : -1)
      const TeamHash = crypto.createHash('sha1').update(JSON.stringify(UserTeamPlayer).toString()).digest('hex')

      const matchingTeam = await UserTeamModel.findOne({
        bAdminRecomended: true,
        iMatchId: ObjectId(iMatchId),
        iUserId,
        _id: { $ne: ObjectId(req.params.id) },
        $or: [{
          sHash: TeamHash,
          iCaptainId: ObjectId(iCaptainId),
          iViceCaptainId: ObjectId(iViceCaptainId)
        }, {
          sName
        }]
      }, { sName: 1 }, { readPreference: 'primary' }).lean()

      if (matchingTeam) {
        if (matchingTeam.sName === sName) {
          return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cteamName) })
        }
        return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cteam) })
      }

      const matchPlayer = await MatchPlayerModel.countDocuments({ _id: { $in: aPlayers }, eStatus: 'N' })
      if (matchPlayer) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].matchPlayer_deleted, type: 'refresh_matchplayer_data' })

      const userTeam = await UserTeamModel.findByIdAndUpdate(req.params.id, { iMatchId, dUpdatedAt: Date.now(), sName, iCaptainId, iViceCaptainId, sHash: TeamHash, iUserId, bAdminRecomended: true }, { new: true, runValidators: true, readPreference: 'primary' }).lean()
      if (!userTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].userTeam) })

      await UserLeagueModel.updateMany({ iUserTeamId: userTeam._id, iUserId: userTeam.iUserId, iMatchId }, { $set: { dUpdatedAt: Date.now(), sTeamName: sName } }).w('majority')

      if (!userTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].userTeam) })

      const matchTeam = await MatchTeamsModel.findOne({ iMatchId: ObjectId(iMatchId), sHash: TeamHash, bAdminRecomended: true }, { _id: 1 }, { readPreference: 'primary' }).lean() // in redis
      if (!matchTeam) {
        await MatchTeamsModel.create({ aPlayers: matchPlayerMap, iMatchId, sHash: TeamHash, nTotalCredit })
      }

      if (userTeam) { // For update copy system user team
        const joinedContestWithTeam = await UserLeagueModel.find({ iUserTeamId: userTeam._id, iMatchId: ObjectId(iMatchId), iUserId: ObjectId(iUserId) }, { iMatchLeagueId: 1, _id: 1 })
          .populate('iMatchLeagueId', ['bCopyBotInit', 'bBotCreate', 'bCancelled'])
          .lean()

        const leagues = joinedContestWithTeam.filter((ul) => ul.iMatchLeagueId.bCopyBotInit && ul.iMatchLeagueId.bBotCreate && ul.iMatchLeagueId.bCancelled === false)
        const matchLeagueIds = leagues.map((l) => l.iMatchLeagueId._id)
        if (matchLeagueIds.length) {
          CopyTeamUpdate({ matchLeagueIds, iMatchId, iUserId, iUserTeamId: userTeam._id })
        }
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cuserTeamDetails), data: { ...userTeam, eType: undefined, bSwapped: undefined } })
    } catch (error) {
      catchError('MatchTeams.upateRecomendetedTeam', error, req, res)
    }
  }

  async getRecommendedTeams(req, res) {
    try {
      let teamData
      if (req.query.iMatchId) {
        teamData = await UserTeamModel.find({ iMatchId: ObjectId(req.params.id), bAdminRecomended: true }, { _id: 1, sName: 1, iMatchId: 1, iUserId: 1, iCaptainId: 1, iViceCaptainId: 1, nTotalPoints: 1, sHash: 1, bAdminRecomended: 1 })
          .populate('oMatchTeamHash', ['aPlayers.iMatchPlayerId'])
          .lean()
      } else {
        teamData = await UserTeamModel.find({ id: ObjectId(req.params.id), bAdminRecomended: true }, { _id: 1, sName: 1, iMatchId: 1, iUserId: 1, iCaptainId: 1, iViceCaptainId: 1, nTotalPoints: 1, sHash: 1, bAdminRecomended: 1 })
          .populate('oMatchTeamHash', ['aPlayers.iMatchPlayerId'])
          .lean()
      }
      if (!teamData.length) {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserTeams) })
      }
      const data = []
      if (Array.isArray(teamData) && teamData.length) {
        teamData.forEach((team) => {
          if (team.oMatchTeamHash && team.oMatchTeamHash.aPlayers) {
            data.push({ ...team, aPlayers: team.oMatchTeamHash.aPlayers.map(p => p.iMatchPlayerId), sHash: undefined, oMatchTeamHash: undefined })
          }
        })
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserTeams), data })
    } catch (error) {
      catchError('MatchTeams.getRecommendedTeams', error, req, res)
    }
  }
}
module.exports = new MatchTeams()
