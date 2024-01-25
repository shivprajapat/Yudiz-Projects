const UserTeamModel = require('./model')
const UserModel = require('../user/model')
const MatchModel = require('../match/model')
const PlayerRoleModel = require('../playerRoles/model')
const UserLeagueModel = require('../userLeague/model')
const MyMatchesModel = require('../myMatches/model')
const MatchTeamsModel = require('../matchTeams/model')
const StatisticsModel = require('../user/statistics/model')
const validateMatch = require('./common')
const MatchPlayerModel = require('../matchPlayer/model')
const crypto = require('crypto')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, pick, getPaginationValues2, handleCatchError } = require('../../helper/utilities.services')
const { CACHE_2, bAllowDiskUse, SUPERUSER_ID } = require('../../config/config')
const { processAuthLogs } = require('../queue/authLogsQueue')
const { pushPlayReturnNotify, referCodeBonusNotify, registerBonusNotify, registerReferNotifify, withdrawRejectNotify, sendSms, sendMails, notificationScheduler, birthdayBonusNotification } = require('../queue/notificationQueue')
const { matchLive, generateFairPlay, autoCreateLeague, prizeDistributionBySeries, processUserCashbackReturnV2, processMatchLeague, checkRedisJoinedCount, CopyTeamUpdate } = require('../queue/matchQueue')
const { redisClient } = require('../../helper/redis')
const CopyTeamLogModel = require('../userLeague/CopyTeamLogModel')
const BackUpUserTeamsModel = require('./backupUserTeam.model')
const BackUpMatchTeamsModel = require('../matchTeams/backupMatchTeams.model')
const BackupCopyTeamLogModel = require('../userLeague/backupCopyTeamLogModel')
const { winReturnByLeagueV2 } = require('./pd')

class UserTeam {
  // To get List of UserTeams (MatchLeague wise) with pagination, sorting and searching
  async list(req, res) {
    try {
      const { start, limit, sorting, search } = getPaginationValues2(req.query)

      let query = search ? { sUserName: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : { }
      query = { ...query, iMatchLeagueId: ObjectId(req.params.id) }

      const [results, total] = await Promise.all([
        UserLeagueModel.find(query,
          { iUserTeamId: 1, sUserName: 1, sTeamName: 1, sMatchName: 1, dCreatedAt: 1 })
          .sort(sorting)
          .skip(Number(start))
          .limit(Number(limit)).lean(),
        UserLeagueModel.countDocuments({ ...query })])

      const data = [{ total, results }]

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].userTeam), data: data })
    } catch (error) {
      return catchError('UserTeam.list', error, req, res)
    }
  }

  // To get match wise user teams
  async matchWiseUserTeamList(req, res) {
    try {
      const { iMatchId, iUserId } = req.body
      let data

      const oMatch = await MatchModel.findOne({ _id: iMatchId }, { bUserTeamBackUp: 1 }).lean()

      if (oMatch.bUserTeamBackUp) data = await BackUpUserTeamsModel.find({ iMatchId: ObjectId(iMatchId), iUserId: ObjectId(iUserId) }).populate('iMatchId', 'sName').populate('iUserId', ['sName', 'sUsername', 'eType'])
      else data = await UserTeamModel.find({ iMatchId: ObjectId(iMatchId), iUserId: ObjectId(iUserId) }).populate('iMatchId', 'sName').populate('iUserId', ['sName', 'sUsername', 'eType'])

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].userTeam), data: data })
    } catch (error) {
      return catchError('matchWiseUserTeamList.list', error, req, res)
    }
  }

  async userTeamPlayersAdminV2(req, res) {
    try {
      let hashData = await UserTeamModel.findById(req.params.id, { _id: 1, sName: 1, iMatchId: 1, iCaptainId: 1, iViceCaptainId: 1, sHash: 1, eCategory: 1 }).lean()
      if (!hashData) {
        hashData = await BackUpUserTeamsModel.findById(req.params.id, { _id: 1, sName: 1, iMatchId: 1, iCaptainId: 1, iViceCaptainId: 1, sHash: 1, eCategory: 1 }).lean()
        if (!hashData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].userTeam) })
      }
      const points = await PlayerRoleModel.findOne({ eCategory: hashData.eCategory }).lean().cache(CACHE_2, `playerPoints:${hashData.eCategory}`)

      let oTeamData = await MatchTeamsModel.findOne({ sHash: hashData.sHash }, { aPlayers: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.iTeamId', select: ['sName'] }]).lean()
      if (!oTeamData) {
        oTeamData = await BackUpMatchTeamsModel.findOne({ sHash: hashData.sHash }, { aPlayers: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.iTeamId', select: ['sName'] }]).lean()
        if (!oTeamData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cMatchTeams) })
      }

      const aPlayers = oTeamData.aPlayers.map((player) => {
        const { _id } = player.iMatchPlayerId
        if (_id.toString() === hashData.iCaptainId.toString()) {
          player.nScoredPoints = player.nScoredPoints * points.nCaptainPoint
        } else if (_id.toString() === hashData.iViceCaptainId.toString()) {
          player.nScoredPoints = player.nScoredPoints * points.nViceCaptainPoint
        }
        return player
      })
      const data = { ...hashData, aPlayers }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].teamPlayers), data })
    } catch (error) {
      catchError('UserTeam.userTeamPlayersAdminV2', error, req, res)
    }
  }

  async userCopyTeams(req, res) {
    try {
      const { iTeamId } = req.query
      let oUserTeam = await UserTeamModel.findById(iTeamId, { sHash: 1, iCaptainId: 1, iViceCaptainId: 1 }).lean()
      if (!oUserTeam) {
        oUserTeam = await BackUpUserTeamsModel.findById(iTeamId, { sHash: 1, iCaptainId: 1, iViceCaptainId: 1 }).lean()
        if (!oUserTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cteam) })
      }

      let [aCopyTeams, oUserMatchTeamData] = await Promise.all([
        CopyTeamLogModel.find({ iUserTeamId: oUserTeam._id }, { iUserId: 1, iSystemUserId: 1, iSystemUserTeamId: 1, eTeamType: 1 }).populate({ path: 'oSystemUserTeam', select: ['iCaptainId', 'iViceCaptainId', 'nTotalPoints', 'sName', 'sHash'], populate: { path: 'oMatchTeamHash', select: ['aPlayers.iMatchPlayerId'] } }).populate({ path: 'oSystemUser', select: 'sName sUsername' }).lean(),
        MatchTeamsModel.findOne({ sHash: oUserTeam.sHash }, { aPlayers: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.iTeamId', select: ['sName'] }]).lean()
      ])

      if (!aCopyTeams.length) {
        aCopyTeams = BackupCopyTeamLogModel.find({ iUserTeamId: oUserTeam._id }, { iUserId: 1, iSystemUserId: 1, iSystemUserTeamId: 1, eTeamType: 1 }).populate({ path: 'oSystemUserTeam', select: ['iCaptainId', 'iViceCaptainId', 'nTotalPoints', 'sName', 'sHash'], populate: { path: 'oMatchTeamHash', select: ['aPlayers.iMatchPlayerId'] } }).populate({ path: 'oSystemUser', select: 'sName sUsername' }).lean()
        if (!aCopyTeams.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cBotLogs) })
      }
      if (!oUserMatchTeamData) {
        oUserMatchTeamData = await BackUpMatchTeamsModel.findOne({ sHash: oUserTeam.sHash }, { aPlayers: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.iTeamId', select: ['sName'] }]).lean()

        if (!oUserMatchTeamData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cMatchTeams) })
      }
      const aCopyBotTeamData = aCopyTeams.map(dataObj => {
        const aPlayersOfCopyTeam = dataObj.oSystemUserTeam.oMatchTeamHash.aPlayers
        const aPlayerIds = aPlayersOfCopyTeam.map(idObj => {
          return idObj.iMatchPlayerId
        })
        return { ...dataObj, oSystemUserTeam: { ...dataObj.oSystemUserTeam, oMatchTeamHash: { ...dataObj.oSystemUserTeam.oMatchTeamHash, aPlayers: aPlayerIds } } }
      })
      const data = { ...oUserTeam, aPlayers: oUserMatchTeamData.aPlayers, nTotalCopyBotTeams: aCopyTeams.length, aCopyBotTeams: aCopyBotTeamData }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].teamPlayers), data })
    } catch (error) {
      catchError('UserTeam.useruserCopyTeams', error, req, res)
    }
  }

  // ********** User **********

  // Create new team
  async addV3(req, res) {
    try {
      const { iMatchId, aPlayers, sName, iCaptainId, iViceCaptainId } = req.body
      const iUserId = req.user._id

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
        const userTeams = await UserTeamModel.countDocuments({ iMatchId: ObjectId(iMatchId), iUserId }, { readPreference: 'primary' })
        teamName = `T${userTeams + 1}`
      }

      const user = await UserModel.findById(iUserId, { eType: 1 }).lean()
      if (!user) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

      // check team is exist
      const UserTeamPlayer = aPlayers.sort((a, b) => a > b ? 1 : -1)
      const TeamHash = crypto.createHash('sha1').update(JSON.stringify(UserTeamPlayer).toString()).digest('hex')

      const matchingTeam = await UserTeamModel.findOne({
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

      const data = await UserTeamModel.create({ iMatchId, sName: teamName, sHash: TeamHash, iCaptainId, iViceCaptainId, iUserId, eCategory: match.eCategory, eType: user.eType })
      if (!data) {
        return res.status(status.InternalServerError).jsonp({
          status: jsonStatus.InternalServerError,
          message: messages[req.userLanguage].error,
          type: 'userteam_create_nodata'
        })
      }

      await MyMatchesModel.updateOne({ iMatchId: ObjectId(iMatchId), iUserId }, { $inc: { nTeams: 1 }, nWinnings: 0, eMatchStatus: match.eStatus, eCategory: match.eCategory, dStartDate: match.dStartDate }, { upsert: true })

      const matchTeam = await MatchTeamsModel.findOne({ iMatchId: ObjectId(iMatchId), sHash: TeamHash }, { _id: 1 }, { readPreference: 'primary' }).lean() // in redis

      if (!matchTeam) {
        await MatchTeamsModel.create({ aPlayers: matchPlayerMap, iMatchId, sHash: TeamHash, nTotalCredit, eCategory: match.eCategory })
      }

      await StatisticsModel.updateOne({ iUserId }, { $inc: { nTeams: 1 } }, { upsert: true })
      data.eType = undefined
      data.bSwapped = undefined

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cnewUserTeam), data })
    } catch (error) {
      catchError('UserTeam.addV3', error, req, res)
    }
  }

  // To update userTeam without validation
  async updateV3(req, res) {
    try {
      const { iMatchId, aPlayers, sName, iCaptainId, iViceCaptainId } = req.body
      const iUserId = req.user._id
      req.body = pick(req.body, ['iMatchId', 'sName', 'aPlayers', 'iCaptainId', 'iViceCaptainId'])
      req.body.bIsUpdate = true
      const result = await validateMatch(req.body, iUserId, req.userLanguage)

      if (result.isSuccess === false) return res.status(result.status).jsonp({ status: result.status, message: result.message })
      const matchPlayerMap = result.matchPlayerMap
      const nTotalCredit = result.nTotalCredit
      // check team is exist
      const UserTeamPlayer = aPlayers.sort((a, b) => a > b ? 1 : -1)
      const TeamHash = crypto.createHash('sha1').update(JSON.stringify(UserTeamPlayer).toString()).digest('hex')

      const matchingTeam = await UserTeamModel.findOne({
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

      const userTeam = await UserTeamModel.findByIdAndUpdate(req.params.id, { iMatchId, dUpdatedAt: Date.now(), sName, iCaptainId, iViceCaptainId, sHash: TeamHash, iUserId }, { new: true, runValidators: true, readPreference: 'primary' }).lean()
      if (!userTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].userTeam) })

      await UserLeagueModel.updateMany({ iUserTeamId: userTeam._id, iUserId: userTeam.iUserId, iMatchId }, { $set: { dUpdatedAt: Date.now(), sTeamName: sName } }).w('majority')

      if (!userTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].userTeam) })

      const matchTeam = await MatchTeamsModel.findOne({ iMatchId: ObjectId(iMatchId), sHash: TeamHash }, { _id: 1 }, { readPreference: 'primary' }).lean() // in redis
      if (!matchTeam) {
        await MatchTeamsModel.create({ aPlayers: matchPlayerMap, iMatchId, sHash: TeamHash, nTotalCredit })
      }

      if (userTeam) { // For update copy system user team
        updateCopyUserTeam(userTeam, iMatchId, userTeam.iUserId)
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cuserTeamDetails), data: { ...userTeam, eType: undefined, bSwapped: undefined } })
    } catch (error) {
      catchError('UserTeam.updateV3', error, req, res)
    }
  }

  // Get count of total team in match
  async userTeamCount(req, res) {
    try {
      const userTeams = await UserTeamModel.countDocuments({ iMatchId: ObjectId(req.params.id), iUserId: req.user._id }, { readPreference: 'primaryPreferred' })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].userTeamCount), data: { nCount: userTeams } })
    } catch (error) {
      catchError('UserTeam.userTeamCount', error, req, res)
    }
  }

  async userTeamsV3(req, res) {
    try {
      const iUserId = req.user._id

      let teamData = await UserTeamModel.find({ iUserId, iMatchId: ObjectId(req.params.id) }, { _id: 1, sName: 1, iMatchId: 1, iUserId: 1, iCaptainId: 1, iViceCaptainId: 1, nTotalPoints: 1, sHash: 1 })
        .populate('oMatchTeamHash', ['aPlayers.iMatchPlayerId'])
        .lean()

      if (!teamData) {
        teamData = await BackUpUserTeamsModel.find({ iUserId, iMatchId: ObjectId(req.params.id) }, { _id: 1, sName: 1, iMatchId: 1, iUserId: 1, iCaptainId: 1, iViceCaptainId: 1, nTotalPoints: 1, sHash: 1 })
          .populate('oMatchTeamHash', ['aPlayers.iMatchPlayerId'])
          .lean()
        if (!teamData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserTeams) })
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
      catchError('UserTeam.userTeamsV3', error, req, res)
    }
  }

  // used in native app
  async userTeamPlayersForLeaderBoardV2(req, res) {
    try {
      const hashData = await UserTeamModel.findById(req.params.iUserTeamId, { _id: 1, sName: 1, iMatchId: 1, iUserId: 1, iCaptainId: 1, iViceCaptainId: 1, nTotalPoints: 1, sHash: 1 }).lean()
      let backupHashData
      if (!hashData) {
        backupHashData = await BackUpUserTeamsModel.findById(req.params.iUserTeamId, { _id: 1, sName: 1, iMatchId: 1, iUserId: 1, iCaptainId: 1, iViceCaptainId: 1, nTotalPoints: 1, sHash: 1 }).lean()
        if (!backupHashData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].userTeam) })
      }
      if (hashData.iUserId.toString() !== req.user._id.toString()) {
        if (backupHashData?.iUserId.toString() !== req.user._id.toString()) {
          const iMatchId = hashData?.iMatchId ? hashData.iMatchId : backupHashData.iMatchId
          const match = await MatchModel.findOne({ _id: iMatchId, eStatus: { $in: ['L', 'CMP', 'I'] } }).cache(CACHE_2, `match:live:${iMatchId}`).lean()
          if (!match) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].match_not_started })
        }
      }
      const sHash = hashData?.sHash ? hashData.sHash : backupHashData?.sHash
      let oTeamData = await MatchTeamsModel.findOne({ sHash }, {
        nTotalPoint: 0,
        nTotalCredit: 0,
        sHash: 0,
        eCategory: 0,
        dUpdatedAt: 0,
        dCreatedAt: 0,
        sExternalId: 0,
        'aPlayers._id': 0,
        'aPlayers.nScoredPoints': 0,
        _id: 0
      })
        .populate('aPlayers.iMatchPlayerId', ['sName', 'sImage', 'eRole', 'nFantasyCredit', 'nScoredPoints', 'bShow', 'sKey'])
        .populate('aPlayers.iTeamId', ['sName', 'sImage'])
        .lean()
      if (!oTeamData) {
        oTeamData = await BackUpMatchTeamsModel.findOne({ sHash }, {
          nTotalPoint: 0,
          nTotalCredit: 0,
          sHash: 0,
          eCategory: 0,
          dUpdatedAt: 0,
          dCreatedAt: 0,
          sExternalId: 0,
          'aPlayers._id': 0,
          'aPlayers.nScoredPoints': 0,
          _id: 0
        })
          .populate('aPlayers.iMatchPlayerId', ['sName', 'sImage', 'eRole', 'nFantasyCredit', 'nScoredPoints', 'bShow', 'sKey'])
          .populate('aPlayers.iTeamId', ['sName', 'sImage'])
          .lean()
        if (!oTeamData.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cMatchTeams) })
      }

      const player = oTeamData ? oTeamData.aPlayers || [] : []
      const data = hashData ? { ...hashData, sHash: undefined, aPlayers: player.map(p => ({ ...p.iMatchPlayerId, iMatchPlayerId: p.iMatchPlayerId._id, _id: undefined, oTeam: { ...p.iTeamId, iTeamId: p.iTeamId._id, _id: undefined } })) } : { ...backupHashData, sHash: undefined, aPlayers: player.map(p => ({ ...p.iMatchPlayerId, iMatchPlayerId: p.iMatchPlayerId._id, _id: undefined, oTeam: { ...p.iTeamId, iTeamId: p.iTeamId._id, _id: undefined } })) }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserTeams), data })
    } catch (error) {
      catchError('UserTeam.userTeamPlayersForLeaderBoardV2', error, req, res)
    }
  }

  async userTeamPlayersForLeaderBoardV3(req, res) {
    try {
      const hashData = await UserLeagueModel.findById(req.params.iUserLeagueId).populate({ path: 'iUserTeamId', select: ['_id', 'sName', 'iMatchId', 'iUserId', 'iCaptainId', 'iViceCaptainId', 'nTotalPoints', 'sHash'] }).lean()

      if (!hashData || !hashData.iUserTeamId) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].userTeam) })

      const { iUserTeamId, nRank, sProPic, sUserName, _id } = hashData
      const team = { ...iUserTeamId, nRank, sProPic, sUserName, iUserLeagueId: _id }

      if (team.iUserId.toString() !== req.user._id.toString()) {
        const match = await MatchModel.findOne({ _id: team.iMatchId, eStatus: { $in: ['L', 'CMP', 'I'] } }, { _id: 1 }).cache(CACHE_2, `match:live:${team.iMatchId}`).lean()
        if (!match) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].match_not_started })
      }

      let oTeamData = await MatchTeamsModel.findOne({ sHash: team.sHash }, {
        nTotalPoint: 0,
        nTotalCredit: 0,
        sHash: 0,
        eCategory: 0,
        dUpdatedAt: 0,
        dCreatedAt: 0,
        sExternalId: 0,
        'aPlayers._id': 0,
        'aPlayers.nScoredPoints': 0,
        _id: 0
      })
        .populate('aPlayers.iMatchPlayerId', ['sName', 'sImage', 'eRole', 'nFantasyCredit', 'nScoredPoints', 'bShow', 'sKey'])
        .populate('aPlayers.iTeamId', ['sName', 'sImage', 'sShortName'])
        .lean()

      if (!oTeamData) {
        oTeamData = await BackUpMatchTeamsModel.findOne({ sHash: team.sHash }, {
          nTotalPoint: 0,
          nTotalCredit: 0,
          sHash: 0,
          eCategory: 0,
          dUpdatedAt: 0,
          dCreatedAt: 0,
          sExternalId: 0,
          'aPlayers._id': 0,
          'aPlayers.nScoredPoints': 0,
          _id: 0
        })
        if (!oTeamData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].cMatchTeams })
      }

      const player = oTeamData ? oTeamData.aPlayers || [] : []
      const data = { ...team, sHash: undefined, aPlayers: player.map(p => ({ ...p.iMatchPlayerId, iMatchPlayerId: p.iMatchPlayerId._id, _id: undefined, oTeam: { ...p.iTeamId, iTeamId: p.iTeamId._id, _id: undefined } })) }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserTeams), data })
    } catch (error) {
      catchError('UserTeam.userTeamPlayersForLeaderBoardV3', error, req, res)
    }
  }

  async userUniqueTeamPlayers(req, res) {
    try {
      const iUserId = req.user._id
      let data = await UserTeamModel.aggregate([
        {
          $match: {
            iMatchId: ObjectId(req.params.id),
            iUserId
          }
        }, {
          $lookup: {
            from: 'matchteams',
            localField: 'sHash',
            foreignField: 'sHash',
            as: 'players'
          }
        }, {
          $addFields: {
            aPlayers: {
              $arrayElemAt: ['$players.aPlayers', 0]
            }
          }
        }, {
          $unwind: {
            path: '$aPlayers'
          }
        }, {
          $group: {
            _id: '$aPlayers.iMatchPlayerId'
          }
        }
      ]).allowDiskUse(bAllowDiskUse).exec()

      if (!data.length) {
        data = await BackUpUserTeamsModel.aggregate([
          {
            $match: {
              iMatchId: ObjectId(req.params.id),
              iUserId
            }
          }, {
            $lookup: {
              from: 'backupmatchteams',
              localField: 'sHash',
              foreignField: 'sHash',
              as: 'players'
            }
          }, {
            $addFields: {
              aPlayers: {
                $arrayElemAt: ['$players.aPlayers', 0]
              }
            }
          }, {
            $unwind: {
              path: '$aPlayers'
            }
          }, {
            $group: {
              _id: '$aPlayers.iMatchPlayerId'
            }
          }
        ]).allowDiskUse(bAllowDiskUse).exec()
        if (!data.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cMatchTeams) })
      }

      data = data.map(matchPlayer => matchPlayer?._id)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].teamPlayers), data: data })
    } catch (error) {
      catchError('UserTeam.userUniqueTeamPlayers', error, req, res)
    }
  }

  async userUniqueTeamPlayersLeagueV2(req, res) {
    try {
      const iUserId = req.user._id
      const hashData = await UserLeagueModel.find({ iUserId, iMatchLeagueId: ObjectId(req.params.id) }, { iUserTeamId: 1 }).populate({ path: 'iUserTeamId', select: 'sHash' }).lean()
      const hash = hashData.map(hash => hash.iUserTeamId.sHash)

      let data = []
      let oTeamData = await MatchTeamsModel.find({ sHash: { $in: hash } }, { aPlayers: 1, _id: 0 }).lean()
      if (!oTeamData.length) {
        oTeamData = await BackUpMatchTeamsModel.find({ sHash: { $in: hash } }, { aPlayers: 1, _id: 0 }).lean()
        if (!oTeamData.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cMatchTeams) })
      }
      for (const player of oTeamData) {
        const { aPlayers } = player
        const playerIds = aPlayers.map(player => player.iMatchPlayerId)
        const ids = new Set(playerIds)
        data.push(...ids)
      }
      data = [...new Set(data)]

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].teamPlayers), data })
    } catch (error) {
      catchError('UserTeam.userUniqueTeamPlayersLeague', error, req, res)
    }
  }

  // To get super user's team list
  async baseTeamList(req, res) {
    try {
      const { nSkip, nLimit } = req.query
      const { id: iMatchId } = req.params

      let [aUserTeams, nTotal, oMatch, oUser] = await Promise.all([
        UserTeamModel.find({ iMatchId: ObjectId(iMatchId), iUserId: ObjectId(SUPERUSER_ID) }).skip(Number(nSkip)).limit(Number(nLimit)).lean(),
        UserTeamModel.countDocuments({ iMatchId: ObjectId(iMatchId), iUserId: ObjectId(SUPERUSER_ID) }),
        MatchModel.findOne({ _id: iMatchId }, { sName: 1 }),
        UserModel.findOne({ _id: SUPERUSER_ID }, { sUsername: 1 })
      ])

      if (!(aUserTeams.length && nTotal)) {
        [aUserTeams, nTotal] = [
          BackUpUserTeamsModel.find({ iMatchId: ObjectId(iMatchId), iUserId: ObjectId(SUPERUSER_ID) }).skip(Number(nSkip)).limit(Number(nLimit)).lean(),
          BackUpUserTeamsModel.countDocuments({ iMatchId: ObjectId(iMatchId), iUserId: ObjectId(SUPERUSER_ID) })]
        if (!aUserTeams.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].baseTeam) })
      }
      const aHashes = aUserTeams.map(data => data.sHash)

      let aTeamData = await MatchTeamsModel.find({ iMatchId: ObjectId(iMatchId), sHash: { $in: aHashes } }, { aPlayers: 1, sHash: 1, _id: 0 }).populate([{ path: 'aPlayers.oMatchPlayer', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.oTeams', select: 'sName' }]).lean()

      if (!aTeamData.length) {
        aTeamData = await BackUpMatchTeamsModel.find({ iMatchId: ObjectId(iMatchId), sHash: { $in: aHashes } }, { aPlayers: 1, sHash: 1, _id: 0 }).populate([{ path: 'aPlayers.oMatchPlayer', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.oTeams', select: 'sName' }]).lean()
        if (!aTeamData.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cMatchTeams) })
      }
      const aResult = aUserTeams.map(userTeam => {
        const matchTeam = aTeamData.find(oTeamHash => oTeamHash.sHash === userTeam.sHash)
        if (matchTeam) {
          userTeam.aPlayers = matchTeam.aPlayers
        }
        userTeam.sHash = undefined
        userTeam.dCreatedAt = undefined
        userTeam.dUpdatedAt = undefined
        userTeam.__v = undefined
        userTeam.eType = undefined
        userTeam.bPointCalculated = undefined
        return userTeam
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].baseTeam), data: { nTotal, oMatch, oUser, aResult } })
    } catch (error) {
      return catchError('matchWiseUserTeamList.baseTeamList', error, req, res)
    }
  }
}

/**
 * For update copy system user team
 * @param {object} userTeam
 * @param {ObjectId} iMatchId
 * @param {ObjectId} iUserId
 */
async function updateCopyUserTeam(userTeam, iMatchId, iUserId) {
  try {
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
  } catch (error) {
    handleCatchError(error)
  }
}

setTimeout(() => {
  winReturnByLeagueV2()
  matchLive()
  generateFairPlay()
  pushPlayReturnNotify()
  autoCreateLeague()
  referCodeBonusNotify()
  registerBonusNotify()
  registerReferNotifify()
  withdrawRejectNotify()
  birthdayBonusNotification()
  prizeDistributionBySeries()
  sendSms()
  sendMails()
  notificationScheduler()
  processUserCashbackReturnV2()
  processAuthLogs()
  processMatchLeague()
  checkRedisJoinedCount()
}, 2000)

module.exports = new UserTeam()
