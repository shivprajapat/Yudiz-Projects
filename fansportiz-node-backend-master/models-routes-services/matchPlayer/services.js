const MatchPlayerModel = require('../matchPlayer/model')
const PlayerModel = require('../player/model')
const MatchModel = require('../match/model')
const TeamModel = require('../team/model')
const ApiLogModel = require('../apiLog/ApiLog.model')
const ScorePointModel = require('../scorePoint/model')
const PlayerRoleModel = require('../playerRoles/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { queuePush } = require('../../helper/redis')
const { catchError, pick, removenull, getPaginationValues2, checkValidImageType, convertToDecimal, getBucketName } = require('../../helper/utilities.services')
const config = require('../../config/config')
const axios = require('axios')
const playerServices = require('../player/services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const MatchTeamsModel = require('../matchTeams/model')
const UserTeamModel = require('../userTeam/model')
const s3 = require('../../helper/s3config')
const { bAllowDiskUse, s3MatchPlayers, CACHE_1 } = config
const bucket = require('../../helper/cloudStorage.services')
const { resetMatchPlayerCricket, resetMatchPlayerFootball, fetchPlaying11FromSoccerEntitySport, resetMatchPlayerBasketball, resetMatchPlayerKabaddi, fetchPlaying11FromEntitySport, fetchPlaying11FromSportradar, fetchPlaying11FromSoccerSportradar } = require('./common')
const { oCricketEntityRole, oCricketSportsRadarRole, oFootballEntityRole, oFootballSportsRadarRole, oKabaddiEntityRole, oBaseballEntityRole } = require('../../data')
const CombinationPlayersModel = require('./combinationPlayers.model')
const MatchLeagueModel = require('../matchLeague/model')
class MatchPlayer {
  getMatchPlayers(iMatchId) {
    return MatchPlayerModel.find({ iMatchId: ObjectId(iMatchId) }, { eRole: 1, nFantasyCredit: 1, iTeamId: 1 }).lean().cache(CACHE_1, `matchplayers:${iMatchId}`)
  }

  async fetchPlaying11Cricket(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      let playerKey = []
      if (match.eProvider === 'ENTITYSPORT') {
        const result = await fetchPlaying11FromEntitySport(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        playerKey = result.data
      } else {
        const result = await fetchPlaying11FromSportradar(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        playerKey = result.data
      }
      if (!playerKey.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_lineups })
      await MatchPlayerModel.updateMany({ sKey: { $in: playerKey }, iMatchId: match._id }, { bShow: true })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cplaying11) })
    } catch (error) {
      catchError('MatchPlayer.fetchPlaying11Cricket', error, req, res)
    }
  }

  async fetchPlaying11Football(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      let playerKey = []
      if (match.eProvider === 'ENTITYSPORT') {
        const result = await fetchPlaying11FromSoccerEntitySport(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        playerKey = result.data
      } else {
        const result = await fetchPlaying11FromSoccerSportradar(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        playerKey = result.data
      }
      if (!playerKey.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_lineups })
      await MatchPlayerModel.updateMany({ sKey: { $in: playerKey }, iMatchId: match._id }, { bShow: true })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cplaying11) })
    } catch (error) {
      catchError('MatchPlayer.fetchPlaying11Football', error, req, res)
    }
  }

  // to fetch starting 7 players of kabaddi match
  async fetchStarting7Kabaddi(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match || match.eCategory !== 'KABADDI') return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      let playerKey = []
      if (match.eProvider === 'ENTITYSPORT') {
        const result = await fetchStarting7FromKabaddiEntitySport(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        playerKey = result.data
      }
      if (!playerKey.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_kabaddi_lineups })

      await MatchPlayerModel.updateMany({ sKey: { $in: playerKey }, iMatchId: match._id }, { bShow: true })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cstarting7) })
    } catch (error) {
      catchError('MatchPlayer.fetchStarting7Kabaddi', error, req, res)
    }
  }

  // to fetch starting 5 players of basketball match
  async fetchStarting5Basketball(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match || match.eCategory !== 'BASKETBALL') return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      let playerKey = []
      if (match.eProvider === 'ENTITYSPORT') {
        const result = await fetchStarting5FromBasketballEntitySport(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        playerKey = result.data
      }
      if (!playerKey.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_basketball_lineups })

      await MatchPlayerModel.updateMany({ sKey: { $in: playerKey }, iMatchId: match._id }, { bShow: true })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cstarting5) })
    } catch (error) {
      catchError('MatchPlayer.fetchStarting5Basketball', error, req, res)
    }
  }

  async addV2(req, res) {
    try {
      const { sportsType, iTeamId, iMatchId, aPlayers } = req.body
      const eCategory = sportsType.toUpperCase()

      req.body = pick(req.body, ['iMatchId', 'iTeamId', 'nScoredPoints', 'bShow', 'nSeasonPoints'])

      const match = await MatchModel.findOne({ _id: ObjectId(iMatchId), $or: [{ 'oHomeTeam.iTeamId': ObjectId(iTeamId) }, { 'oAwayTeam.iTeamId': ObjectId(iTeamId) }] }).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cteam) })

      const sTeamKey = await TeamModel.findOne({ sKey: { $in: [match.oHomeTeam.sKey, match.oAwayTeam.sKey] }, eCategory: match.eCategory, eProvider: match.eProvider }).lean()

      req.body.sTeamKey = sTeamKey.sKey
      req.body.sTeamName = sTeamKey.sName

      const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat: match.eFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()
      const aPlayerIds = aPlayers.map(e => e.iPlayerId)

      const [aExistingMatchPlayers, players] = await Promise.all([
        MatchPlayerModel.find({ iPlayerId: { $in: aPlayerIds }, iMatchId }, { _id: 0, iPlayerId: 1 }).lean(),
        PlayerModel.find({ _id: { $in: aPlayerIds }, eCategory }, { _id: 1, sKey: 1, eRole: 1, sImage: 1 }).lean()
      ])
      const existingMatchPlayersSet = new Set(aExistingMatchPlayers.map(existingMatchPlayer => existingMatchPlayer.iPlayerId.toString()))
      const playersMap = players.reduce((obj, player) => {
        const playerId = player._id
        delete player._id
        obj[playerId] = player
        return obj
      }, {})

      const aBulkWriteMatchPlayer = []
      for (const player of aPlayers) {
        if (existingMatchPlayersSet.has(player.iPlayerId.toString())) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].matchPlayer) })
        if (!playersMap[player.iPlayerId]) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cplayer) })
        aBulkWriteMatchPlayer.push({ ...req.body, ...playersMap[player.iPlayerId], ...player, eCategory, aPointBreakup })
      }

      const data = await MatchPlayerModel.create(aBulkWriteMatchPlayer)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cnewMatchPlayer), data })
    } catch (error) {
      catchError('MatchPlayer.addV2', error, req, res)
    }
  }

  // To get details of single MatchPlayer
  async get(req, res) {
    try {
      const data = await MatchPlayerModel.findById(req.params.id).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) })

      const match = await MatchModel.findById(data.iMatchId, { sName: 1 }).lean()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].matchPlayer), data: { ...data, sMatchName: match ? match.sName : '' } })
    } catch (error) {
      catchError('MatchPlayer.get', error, req, res)
    }
  }

  // To get signedUrl for MatchPlayer image
  async getSignedUrl(req, res) {
    try {
      req.body = pick(req.body, ['sFileName', 'sContentType'])
      const { sFileName, sContentType } = req.body

      const valid = checkValidImageType(sFileName, sContentType)
      if (!valid) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].image) })

      const data = await bucket.getSignedUrl({ sFileName, sContentType, path: s3MatchPlayers })
      // const data = await s3.signedUrl(sFileName, sContentType, s3MatchPlayers)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('MatchPlayer.getSignedUrl', error, req, res)
    }
  }

  // To update single MatchPlayer by _id
  async update(req, res) {
    try {
      let { eRole, sportsType, sImage, iTeamId, iMatchId } = req.body

      const eCategory = sportsType.toUpperCase()
      eRole = eRole.toUpperCase()

      req.body = pick(req.body, ['sImage', 'iMatchId', 'bPlayInLastMatch', 'iTeamId', 'iPlayerId', 'sName', 'nScoredPoints', 'bShow', 'nSeasonPoints', 'nFantasyCredit', 'eRole', 'eStatus'])
      removenull(req.body)

      const query = iTeamId ? { _id: ObjectId(iMatchId), $or: [{ 'oHomeTeam.iTeamId': ObjectId(iTeamId) }, { 'oAwayTeam.iTeamId': ObjectId(iTeamId) }] } : { _id: ObjectId(iMatchId) }
      const match = await MatchModel.findOne(query).lean()

      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cteam) })

      if (iTeamId) {
        if (match.oHomeTeam.iTeamId.toString() === iTeamId) {
          req.body.sTeamName = match.oHomeTeam.sName
        } else if (match.oAwayTeam.iTeamId.toString() === iTeamId) {
          req.body.sTeamName = match.oAwayTeam.sName
        }
        const sTeamKey = await TeamModel.findOne({ sName: req.body.sTeamName, sKey: { $in: [match.oHomeTeam.sKey, match.oAwayTeam.sKey] }, eCategory: match.eCategory }).lean()
        req.body.sTeamKey = sTeamKey.sKey
      }

      const role = await PlayerRoleModel.findOne({ eCategory: eCategory }, { aRole: { $elemMatch: { eKey: eRole } } }).lean()
      if (eRole && !role) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cplayerRole) })

      // if match is not in pending status then we won't allow admin to chanege player role
      const oPlayerUpdate = { ...req.body, sImage, eCategory, eRole, dUpdatedAt: Date.now() }

      const existPlayer = await MatchPlayerModel.findById(req.params.id).lean()
      if (!existPlayer) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) })

      if (!['P', 'U'].includes(match.eStatus)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_edit_player_role })

      if (!['P', 'U'].includes(match.eStatus) && eRole !== existPlayer.eRole) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_edit_player_role })

      // if match player is exist is user team then, admin can not edit player
      const exist = await MatchTeamsModel.find({ 'aPlayers.iMatchPlayerId': ObjectId(req.params.id), iMatchId: match._id }, { sHash: 1 }).lean()
      const existHashes = exist.map(({ sHash }) => sHash)

      const userTeams = await UserTeamModel.countDocuments({ sHash: { $in: existHashes } })
      if (userTeams && userTeams >= 1) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].machplayer_exist })

      const player = await MatchPlayerModel.findByIdAndUpdate(req.params.id, oPlayerUpdate, { new: true, runValidators: true }).lean()
      if (!player) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) })

      const { sName, sImage: sImages, nFantasyCredit, iTeamId: teamId, eRole: playerRole } = player

      const oPlayer = { sName, sImage: sImages, nFantasyCredit, eRole: playerRole, iTeamId: teamId }
      await PlayerModel.updateOne({ _id: ObjectId(player.iPlayerId) }, oPlayer)

      const sBucketName = getBucketName()
      const bucketParams = {
        Bucket: sBucketName,
        Key: player.sImage
      }

      let data
      if (bucketParams && player.sImage !== sImage) {
        data = await bucket.deleteObject(bucketParams)
        // data = await s3.deleteObject(s3Params)
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].matchPlayer), data: data || player })
    } catch (error) {
      catchError('MatchPlayer.update', error, req, res)
    }
  }

  // To reset single MatchPlayer by _id
  async resetMatchPlayer(req, res) {
    try {
      const matchPlayer = await MatchPlayerModel.findById(req.params.id).populate('iMatchId', 'sSeasonKey sKey eProvider eCategory oHomeTeam oAwayTeam eStatus').lean()
      if (!matchPlayer) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) }) }

      const { eCategory, eStatus, _id } = matchPlayer.iMatchId

      if (!['U', 'P'].includes(eStatus)) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].matchPlayer) })

      const exist = await MatchTeamsModel.find({ 'aPlayers.iMatchPlayerId': ObjectId(req.params.id), iMatchId: _id }, { sHash: 1 }).lean()
      const existHashes = exist.map(({ sHash }) => sHash)

      const userTeams = await UserTeamModel.countDocuments({ sHash: { $in: existHashes } })
      if (userTeams && userTeams >= 1) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].machplayer_exist })

      let resetPlayer
      switch (eCategory) {
        case 'CRICKET':
          resetPlayer = await resetMatchPlayerCricket(matchPlayer)
          break
        case 'FOOTBALL':
          resetPlayer = await resetMatchPlayerFootball(matchPlayer)
          break
        case 'BASKETBALL':
          resetPlayer = await resetMatchPlayerBasketball(matchPlayer)
          break
        case 'KABADDI':
          resetPlayer = await resetMatchPlayerKabaddi(matchPlayer)
          break
      }
      if (resetPlayer) {
        if (resetPlayer.isSuccess === false) return res.status(resetPlayer.status).jsonp({ status: resetPlayer.status, message: resetPlayer.message })
        await MatchPlayerModel.updateOne({ _id: ObjectId(req.params.id) }, resetPlayer.result)
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) })
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].refresh_success.replace('##', messages[req.userLanguage].matchPlayer) })
    } catch (error) {
      catchError('MatchPlayer.resetMatchPlayer', error, req, res)
    }
  }

  // To delete single MatchPlayer by _id
  async removeV2(req, res) {
    try {
      const match = await MatchModel.countDocuments({ _id: ObjectId(req.query.iMatchId), eStatus: { $in: ['I', 'CMP'] } })
      if (match) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_delete_match_player })

      const exist = await MatchTeamsModel.find({ 'aPlayers.iMatchPlayerId': ObjectId(req.params.id), iMatchId: ObjectId(req.query.iMatchId) }, { sHash: 1 }).lean()
      const existHashes = exist.map(({ sHash }) => sHash)

      const userTeams = await UserTeamModel.countDocuments({ sHash: { $in: existHashes } })
      if (userTeams && userTeams >= 1) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].machplayer_exist })

      const data = await MatchPlayerModel.findByIdAndDelete(req.params.id)
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].matchPlayer), data })
    } catch (error) {
      return catchError('MatchPlayer.removeV2', error, req, res)
    }
  }

  async scoredPointUpdate(req, res) {
    try {
      const { aPointBreakup } = req.body
      let scorePoint = 0
      // bShow === true
      const data = await MatchPlayerModel.findById(req.params.id).lean()
      if (!data) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) }) }

      const aMatchPlayerUpdate = []
      for (const pointBreakup of aPointBreakup) {
        const { _id, nScoredPoints } = pointBreakup
        // await MatchPlayerModel.updateOne({ _id: ObjectId(req.params.id), 'aPointBreakup._id': ObjectId(_id) },
        //   { 'aPointBreakup.$.nScoredPoints': nScoredPoints })
        scorePoint = scorePoint + nScoredPoints
        aMatchPlayerUpdate.push({
          updateOne: {
            filter: { _id: ObjectId(req.params.id), 'aPointBreakup._id': ObjectId(_id) },
            update: { $set: { 'aPointBreakup.$.nScoredPoints': nScoredPoints } }
          }
        })
      }
      await Promise.all([
        MatchPlayerModel.bulkWrite(aMatchPlayerUpdate, { ordered: false }),
        MatchPlayerModel.updateOne({ _id: ObjectId(req.params.id) }, { nScoredPoints: scorePoint })
      ])

      // await MatchPlayerModel.updateOne({ _id: ObjectId(req.params.id) }, { nScoredPoints: scorePoint })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].matchPlayer), data })
    } catch (error) {
      catchError('MatchPlayer.scoredPointUpdate', error, req, res)
    }
  }

  async scoredPointGet(req, res) {
    try {
      const data = await MatchPlayerModel.findById(req.params.id, { aPointBreakup: 1 }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cpointBreakup), data })
    } catch (error) {
      catchError('MatchPlayer.scoredPointGet', error, req, res)
    }
  }

  // To fetch and format cricket MatchPlayers for match from third party API by match_id
  async fetchMatchPlayerCricket(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) }) }

      const { sSeasonKey, oHomeTeam, oAwayTeam, _id, eCategory, eFormat, eProvider } = match

      let homeTeamRes
      let awayTeamRes
      let formatPlayers = []
      let bHomeTeamError = false

      if (eProvider === 'ENTITYSPORT') {
        const result = await fetchCricketPlayerFromEntitySport(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatPlayers = result.data
      } else {
        try {
          homeTeamRes = await axios.get(`https://api.sportradar.com/cricket-p2/en/tournaments/${sSeasonKey}/teams/${oHomeTeam.sKey}/squads.json`, { params: { api_key: config.SPORTSRADAR_API_KEY } })
          bHomeTeamError = true
          awayTeamRes = await axios.get(`https://api.sportradar.com/cricket-p2/en/tournaments/${sSeasonKey}/teams/${oAwayTeam.sKey}/squads.json`, { params: { api_key: config.SPORTSRADAR_API_KEY } })
        } catch (error) {
          if (config.API_LOGS) {
            await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: !bHomeTeamError ? `https://api.sportradar.com/cricket-p2/en/tournaments/${sSeasonKey}/teams/${oHomeTeam.sKey}/squads.json` : `https://api.sportradar.com/cricket-p2/en/tournaments/${sSeasonKey}/teams/${oAwayTeam.sKey}/squads.json` })
          }
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_matchplayer })
        }

        const oApiLogData = { sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider }
        if (config.API_LOGS) {
          await ApiLogModel.insertMany([
            { ...oApiLogData, oData: homeTeamRes.data, sUrl: `https://api.sportradar.com/cricket-p2/en/tournaments/${sSeasonKey}/teams/${oHomeTeam.sKey}/squads.json` },
            { ...oApiLogData, oData: awayTeamRes.data, sUrl: `https://api.sportradar.com/cricket-p2/en/tournaments/${sSeasonKey}/teams/${oAwayTeam.sKey}/squads.json` }
          ])
        }

        const homeTeamPlayers = homeTeamRes.data.players || []
        const awayTeamPlayers = awayTeamRes.data.players || []

        let setFormat = ''
        if ((eFormat === 'ODI') || (eFormat === 'LIST_A')) {
          setFormat = 'ODI'
        } else if ((eFormat === 'T20I') || (eFormat === 'T20') || (eFormat === 'VT20')) {
          setFormat = 'T20'
        } else if ((eFormat === 'T10I') || (eFormat === 'T10')) {
          setFormat = 'T10'
        } else if (eFormat === 'TEST') {
          setFormat = 'TEST'
        } else if (eFormat === '100BALL') {
          setFormat = '100BALL'
        }

        const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat: setFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()

        formatPlayers = homeTeamPlayers.map((player) => {
          const { id, name, type } = player

          const reg = /^.*?(?=,)/
          const reg2 = /[^,]+$/
          const s = name ? reg.exec(name) || [] : []
          const n = name ? reg2.exec(name) || [] : []
          n[0] = n[0] || []
          s[0] = s[0] || []
          const playerName = (n[0] + ' ' + s[0]).trim()
          return {
            iMatchId: _id,
            iTeamId: oHomeTeam.iTeamId,
            sName: playerName,
            sTeamName: oHomeTeam.sName,
            eRole: oCricketSportsRadarRole[type] || 'BATS',
            sKey: id,
            aPointBreakup
          }
        })
        awayTeamPlayers.map((player) => {
          const { id, name, type } = player

          const reg = /^.*?(?=,)/
          const reg2 = /[^,]+$/

          const s = name ? reg.exec(name) || [] : []
          const n = name ? reg2.exec(name) || [] : []
          n[0] = n[0] || []
          s[0] = s[0] || []
          const playerName = (n[0] + ' ' + s[0]).trim()

          formatPlayers.push({
            iMatchId: _id,
            iTeamId: oAwayTeam.iTeamId,
            sName: playerName,
            sTeamName: oAwayTeam.sName,
            // sName: name.replace(/[^a-zA-Z ]/g, ''),
            eRole: oCricketSportsRadarRole[type] || 'BATS',
            sKey: id,
            aPointBreakup
          })
        })
      }

      if (!formatPlayers.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_matchplayer })
      await storeMatchPlayer(req, res, formatPlayers, eCategory, eProvider)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', `${formatPlayers.length} ${messages[req.userLanguage].newMatchPlayers}`) })
    } catch (error) {
      catchError('MatchPlayer.fetchMatchPlayer', error, req, res)
    }
  }

  // To fetch and format football MatchPlayers for match from third party API by match_id
  async fetchMatchPlayerFootball(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) }) }

      const { oHomeTeam, oAwayTeam, _id, eCategory, eFormat, eProvider } = match

      let homeTeamRes
      let awayTeamRes
      let formatPlayers = []
      let bHomeTeamError = false

      if (eProvider === 'ENTITYSPORT') {
        const result = await fetchSoccerPlayerFromEntitySport(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatPlayers = result.data
      } else {
        try {
          homeTeamRes = await axios.get(`https://api.sportradar.us/soccer-x3/global/en/teams/${oHomeTeam.sKey}/profile.json`, { params: { api_key: config.FOOTBALL_API_KEY } })
          bHomeTeamError = true
          awayTeamRes = await axios.get(`https://api.sportradar.us/soccer-x3/global/en/teams/${oAwayTeam.sKey}/profile.json`, { params: { api_key: config.FOOTBALL_API_KEY } })
        } catch (error) {
          if (config.API_LOGS) {
            await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: !bHomeTeamError ? `https://api.sportradar.us/soccer-x3/global/en/teams/${oHomeTeam.sKey}/profile.json` : `https://api.sportradar.us/soccer-x3/global/en/teams/${oAwayTeam.sKey}/profile.json` })
          }
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_matchplayer })
        }

        const oApiLogData = { sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider }
        if (config.API_LOGS) {
          await ApiLogModel.insertMany([
            { ...oApiLogData, oData: homeTeamRes.data, sUrl: `https://api.sportradar.us/soccer-x3/global/en/teams/${oHomeTeam.sKey}/profile.json` },
            { ...oApiLogData, oData: awayTeamRes.data, sUrl: `https://api.sportradar.us/soccer-x3/global/en/teams/${oAwayTeam.sKey}/profile.json` }
          ])
        }

        const homeTeamPlayers = homeTeamRes.data.players || []
        const awayTeamPlayers = awayTeamRes.data.players || []

        if (homeTeamPlayers.length < 1 || awayTeamPlayers.length < 1) { return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_matchplayer }) }
        const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()

        formatPlayers = homeTeamPlayers.map((player) => {
          const { id, name, type } = player

          const reg = /^.*?(?=,)/
          const reg2 = /[^,]+$/
          const s = name ? reg.exec(name) || [] : []
          const n = name ? reg2.exec(name) || [] : []
          n[0] = n[0] || []
          s[0] = s[0] || []
          const playerName = (n[0] + ' ' + s[0]).trim()

          return {
            iMatchId: _id,
            iTeamId: oHomeTeam.iTeamId,
            sName: playerName,
            sTeamName: oHomeTeam.sName,
            eRole: oFootballSportsRadarRole[type] || 'MID',
            sKey: id,
            aPointBreakup
          }
        })
        awayTeamPlayers.map((player) => {
          const { id, name, type } = player

          const reg = /^.*?(?=,)/
          const reg2 = /[^,]+$/
          const s = name ? reg.exec(name) || [] : []
          const n = name ? reg2.exec(name) || [] : []
          n[0] = n[0] || []
          s[0] = s[0] || []
          const playerName = (n[0] + ' ' + s[0]).trim()
          formatPlayers.push({
            iMatchId: _id,
            iTeamId: oAwayTeam.iTeamId,
            sName: playerName,
            sTeamName: oAwayTeam.sName,
            eRole: oFootballSportsRadarRole[type] || 'MID',
            sKey: id,
            aPointBreakup
          })
        })
      }
      if (!formatPlayers.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_matchplayer })

      await storeMatchPlayer(req, res, formatPlayers, eCategory, eProvider)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', `${formatPlayers.length} ${messages[req.userLanguage].newMatchPlayers}`) })
    } catch (error) {
      catchError('MatchPlayer.fetchMatchPlayerFootball', error, req, res)
    }
  }

  // To fetch and format basketball MatchPlayers for match from third party API by match_id
  async fetchMatchPlayerBasketball(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) }) }

      const { oHomeTeam, oAwayTeam, _id, eCategory, eFormat, eProvider } = match

      let homeTeamRes
      let awayTeamRes
      let formatPlayers = []
      let bHomeTeamError = false

      if (eProvider === 'ENTITYSPORT') {
        const result = await fetchBasketballPlayerFromEntitySport(match, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatPlayers = result.data
      } else {
        try {
          homeTeamRes = await axios.get(`https://api.sportradar.com/nba/production/v5/en/teams/${oHomeTeam.sKey}/profile.json`, { params: { api_key: config.NBA_API_KEY } })
          bHomeTeamError = true
          awayTeamRes = await axios.get(`https://api.sportradar.com/nba/production/v5/en/teams/${oAwayTeam.sKey}/profile.json`, { params: { api_key: config.NBA_API_KEY } })
        } catch (error) {
          if (config.API_LOGS) {
            await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: !bHomeTeamError ? `https://api.sportradar.com/nba/production/v5/en/teams/${oHomeTeam.sKey}/profile.json` : `https://api.sportradar.com/nba/production/v5/en/teams/${oAwayTeam.sKey}/profile.json` })
          }
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_matchplayer })
        }

        const oApiLogData = { sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider }
        if (config.API_LOGS) {
          await ApiLogModel.insertMany([
            { ...oApiLogData, oData: homeTeamRes.data, sUrl: `https://api.sportradar.com/nba/production/v5/en/teams/${oHomeTeam.sKey}/profile.json` },
            { ...oApiLogData, oData: awayTeamRes.data, sUrl: `https://api.sportradar.com/nba/production/v5/en/teams/${oAwayTeam.sKey}/profile.json` }
          ])
        }

        const homeTeamPlayers = homeTeamRes.data.players || []
        const awayTeamPlayers = awayTeamRes.data.players || []
        if (homeTeamPlayers.length < 1 || awayTeamPlayers.length < 1) { return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_matchplayer }) }
        const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()

        formatPlayers = homeTeamPlayers.map((player) => {
          const { sr_id: id, full_name: name, primary_position: eRole } = player
          const sName = name || ''
          return {
            iMatchId: _id,
            iTeamId: oHomeTeam.iTeamId,
            sName,
            sTeamName: oHomeTeam.sName,
            eRole,
            sKey: id,
            aPointBreakup
          }
        })
        awayTeamPlayers.map((player) => {
          const { sr_id: id, full_name: name, primary_position: eRole } = player
          const sName = name || ''

          formatPlayers.push({
            iMatchId: _id,
            iTeamId: oAwayTeam.iTeamId,
            sName,
            sTeamName: oAwayTeam.sName,
            eRole,
            sKey: id,
            aPointBreakup
          })
        })
      }

      await storeMatchPlayer(req, res, formatPlayers, eCategory, eProvider)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', `${formatPlayers.length} ${messages[req.userLanguage].newMatchPlayers}`) })
    } catch (error) {
      catchError('MatchPlayer.fetchMatchPlayerBasketball', error, req, res)
    }
  }

  // To fetch and format Baseball MatchPlayers for match from third party API by match_id
  async fetchMatchPlayerBaseball(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      const { oHomeTeam, oAwayTeam, _id, eCategory, sKey, eProvider } = match

      const response = await axios.get(`https://rest.entitysport.com/baseball/matches/${sKey}/fantasy`, { params: { token: config.ENTITYSPORT_BASEBALL_API_KEY } })

      if (config.API_LOGS) {
        await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data.items, sUrl: `https://rest.entitysport.com/baseball/matches/${sKey}/fantasy` })
      }

      const homeTeamPlayers = response.data.response.items.fantasy_squad.home || []
      const awayTeamPlayers = response.data.response.items.fantasy_squad.away || []

      const formatPlayers = homeTeamPlayers.map((player) => {
        const { pid, name, role, rating: nFantasyCredit } = player

        return {
          iMatchId: _id,
          iTeamId: oHomeTeam.iTeamId,
          sName: name.replace(/[^a-zA-Z ]/g, ''),
          eRole: oBaseballEntityRole[role] || 'P',
          nFantasyCredit: nFantasyCredit || undefined,
          sKey: pid
        }
      })
      awayTeamPlayers.forEach((player) => {
        const { pid, name, role, rating: nFantasyCredit } = player

        formatPlayers.push({
          iMatchId: _id,
          iTeamId: oAwayTeam.iTeamId,
          sName: name.replace(/[^a-zA-Z ]/g, ''),
          nFantasyCredit: nFantasyCredit || undefined,
          eRole: oBaseballEntityRole[role] || 'P',
          sKey: pid
        })
      })
      storeMatchPlayer(req, res, formatPlayers, eCategory, eProvider)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', `${formatPlayers.length} ${messages[req.userLanguage].newMatchPlayers}`), data: formatPlayers })
    } catch (error) {
      catchError('MatchPlayer.fetchMatchPlayerBaseball', error, req, res)
    }
  }

  // To fetch and format Kabaddi MatchPlayers for match from third party API by match_id
  async fetchMatchPlayerKabaddi(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) }) }

      const { eCategory, eProvider } = match

      let formatPlayers = []

      const result = await fetchKabaddiPlayerFromEntitySport(match, req.userLanguage)
      if (result.isSuccess === false) {
        return res.status(result.status).jsonp({ status: result.status, message: result.message })
      }
      formatPlayers = result.data
      if (!formatPlayers.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_matchplayer })

      await storeMatchPlayer(req, res, formatPlayers, eCategory, eProvider)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', `${formatPlayers.length} ${messages[req.userLanguage].newMatchPlayers}`) })
    } catch (error) {
      catchError('MatchPlayer.fetchMatchPlayerKabaddi', error, req, res)
    }
  }

  // To get List of MatchPlayers (match wise) with or without pagination, sorting and searching
  async list(req, res) {
    try {
      //! update with tba players
      const { eRole, start, limit, iTeamId = '' } = req.query
      const { sorting, search } = getPaginationValues2(req.query)

      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) }) }

      let query = eRole ? { eRole, iMatchId: ObjectId(req.params.id) } : { iMatchId: ObjectId(req.params.id) }
      query = search ? { ...query, sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : query

      let results = []

      const projection = {
        iMatchId: 1,
        sTeamName: 1,
        iPlayerId: 1,
        sImage: 1,
        sName: 1,
        eRole: 1,
        nScoredPoints: 1,
        nSeasonPoints: 1,
        nFantasyCredit: 1,
        bPlayInLastMatch: 1,
        bShow: 1,
        eStatus: 1,
        dCreatedAt: 1
      }

      /* const teamIdFilter = []
      if (iTeamId) {
        teamIdFilter.push(ObjectId(iTeamId))
      } else {
        teamIdFilter.push(match.oHomeTeam.iTeamId)
        teamIdFilter.push(match.oAwayTeam.iTeamId)
      } */

      if (iTeamId) {
        query = {
          ...query,
          iTeamId: ObjectId(iTeamId)
        }
      }

      if (start && limit) {
        results = await MatchPlayerModel.find(query, projection).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()
      } else {
        results = await MatchPlayerModel.find(query, projection).sort(sorting).lean()
      }

      const total = await MatchPlayerModel.countDocuments({ ...query })
      const data = [{ total, results, bLineupsOut: match.bLineupsOut }]

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].matchPlayer), data: data })
    } catch (error) {
      return catchError('MatchPlayer.list', error, req, res)
    }
  }

  // For Calculate season point in single match or all match.
  async calculateSeasonPointV2(req, res) {
    try {
      let matches = []
      const aBulkMatchPlayer = []
      if (req.body.id) {
        const match = await MatchModel.findById(req.body.id).lean()
        if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })
        matches.push(match)
      } else {
        matches = await MatchModel.find({ eStatus: 'U', bDisabled: false, dStartDate: { $gte: new Date() } }).select({ oHomeTeam: 1, oAwayTeam: 1, sSeasonKey: 1, eCategory: 1, eFormat: 1 }).lean()
      }
      for (const match of matches) {
        const team = [match.oHomeTeam.iTeamId, match.oAwayTeam.iTeamId]

        const seasonMatches = await MatchModel.find({ sSeasonKey: match.sSeasonKey, eFormat: match.eFormat, eCategory: match.eCategory, $or: [{ 'oHomeTeam.iTeamId': { $in: team } }, { 'oAwayTeam.iTeamId': { $in: team } }], eStatus: 'CMP' }).select({ _id: 1 }).lean()

        const aMatchIds = seasonMatches.map(m => ObjectId(m._id))
        const data = await MatchPlayerModel.aggregate([
          {
            $match: {
              iMatchId: { $in: aMatchIds }
            }
          }, {
            $group: {
              _id: '$iPlayerId',
              sum: { $sum: '$nScoredPoints' },
              data: {
                $push: '$$ROOT'
              }
            }
          },
          {
            $project: {
              nSeasonPoints: '$sum',
              iPlayerId: '$_id'
            }
          }
        ]).allowDiskUse(bAllowDiskUse).exec()
        if (!data.length) continue
        const aBulkMatchPlayer = []
        for (const matchPlayer of data) {
          aBulkMatchPlayer.push({
            updateOne: {
              filter: { iPlayerId: ObjectId(matchPlayer.iPlayerId), iMatchId: ObjectId(match._id) },
              update: { $set: { nSeasonPoints: matchPlayer.nSeasonPoints, bPointCalculated: true } }
            }
          })
        }
      }
      if (!aBulkMatchPlayer.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].matches_not_completed })
      await MatchPlayerModel.bulkWrite(aBulkMatchPlayer, { writeConcern: { w: 'majority' }, ordered: false })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cseasonPoint) })
    } catch (error) {
      catchError('MatchPlayer.calculateSeasonPointV2', error, req, res)
    }
  }

  async matchPlayerInfo(req, res) {
    try {
      const matchPlayer = await MatchPlayerModel.findById(req.params.id, { sImage: 1, nSetBy: 1, nCaptainBy: 1, nViceCaptainBy: 1, bShow: 1, nScoredPoints: 1, eRole: 1, sName: 1, nFantasyCredit: 1 }).lean()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].matchPlayer), data: matchPlayer })
    } catch (error) {
      catchError('MatchPlayer.matchPlayerInfo', error, req, res)
    }
  }

  // To get MatchPlayer list of single match
  async matchPlayerListUserV2(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id, { aPlayerRole: 1 }).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      const data = await MatchPlayerModel.find({ iMatchId: req.params.id }, { aPointBreakup: 0 }).populate('iTeamId', ['sShortName', 'sName', 'sKey']).lean()
      if (!data.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) })

      const teamExist = data.every((p) => p.iTeamId && p.iTeamId._id)
      if (!teamExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cteam) })

      const matchPlayerData = data.map(p => {
        p.nScoredPoints = convertToDecimal(p.nScoredPoints)
        const player = { ...p, oTeam: { ...p.iTeamId, iTeamId: p.iTeamId._id } }
        delete player.iTeamId
        delete player.oTeam._id
        return player
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].matchPlayer), data: { matchPlayer: matchPlayerData, aPlayerRole: match.aPlayerRole } })
    } catch (error) {
      catchError('MatchPlayer.matchPlayerListUserV2', error, req, res)
    }
  }

  // fetch last match player
  async fetchLastMatchPlayer(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id, { aPlayerRole: 1, iSeasonId: 1, dStartDate: 1, 'oHomeTeam.iTeamId': 1, 'oAwayTeam.iTeamId': 1 }).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      const [lastHomeTeamMatch, lastAwayTeamMatch] = await Promise.all([
        MatchModel.findOne({ $or: [{ 'oHomeTeam.iTeamId': match.oHomeTeam.iTeamId }, { 'oAwayTeam.iTeamId': match.oHomeTeam.iTeamId }], _id: { $ne: match._id }, iSeasonId: match.iSeasonId, dStartDate: { $lt: match.dStartDate }, eStatus: 'CMP' }, { dStartDate: 1, oHomeTeam: 1, oAwayTeam: 1 }).sort({ dStartDate: -1 }).lean(),
        MatchModel.findOne({ $or: [{ 'oHomeTeam.iTeamId': match.oAwayTeam.iTeamId }, { 'oAwayTeam.iTeamId': match.oAwayTeam.iTeamId }], _id: { $ne: match._id }, iSeasonId: match.iSeasonId, dStartDate: { $lt: match.dStartDate }, eStatus: 'CMP' }, { dStartDate: 1, oHomeTeam: 1, oAwayTeam: 1 }).sort({ dStartDate: -1 }).lean()
      ])
      const matchId = []
      if (lastAwayTeamMatch) matchId.push(lastAwayTeamMatch._id)
      if (lastHomeTeamMatch) matchId.push(lastHomeTeamMatch._id)
      if (!matchId.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_available.replace('##', messages[req.userLanguage].LastMatchPlayer) })
      const lastMatchPlayer = await MatchPlayerModel.find({ iMatchId: { $in: matchId }, iTeamId: { $in: [match.oAwayTeam.iTeamId, match.oHomeTeam.iTeamId] }, bShow: true }, { iPlayerId: 1 }).lean()
      if (!lastMatchPlayer.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_available.replace('##', messages[req.userLanguage].LastMatchPlayer) })
      const matchPlayer = lastMatchPlayer.map(a => a.iPlayerId)
      await Promise.all([
        MatchPlayerModel.updateMany({ iPlayerId: { $in: matchPlayer }, iMatchId: req.params.id }, { $set: { bPlayInLastMatch: true } }),
        MatchPlayerModel.updateMany({ iPlayerId: { $nin: matchPlayer }, iMatchId: req.params.id }, { $set: { bPlayInLastMatch: false } })
      ])
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].LastMatchPlayer) })
    } catch (error) {
      catchError('MatchPlayer.fetchLastMatchPlayer', error, req, res)
    }
  }

  // To get MatchPlayer points season wise
  async matchPlayerSeasonPointV2(req, res) {
    try {
      const matchPlayer = await MatchPlayerModel.findById(req.params.id, { sName: 1, sTeamName: 1, bShow: 1, iPlayerId: 1, nSetBy: 1, nCaptainBy: 1, nViceCaptainBy: 1, nFantasyCredit: 1, sImage: 1, eRole: 1, nSeasonPoints: 1 }).lean().populate('iMatchId')
      if (!matchPlayer) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      const seasonMatches = await MatchModel.find({ sSeasonKey: matchPlayer.iMatchId.sSeasonKey, eCategory: matchPlayer.iMatchId.eCategory, eStatus: 'CMP' }, { _id: 1 }).lean()
      const aMatchIds = seasonMatches.map(m => ObjectId(m._id))

      const data = await MatchPlayerModel.find({ iMatchId: { $in: aMatchIds }, iPlayerId: matchPlayer.iPlayerId }, { sName: 1, sTeamName: 1, bShow: 1, nSetBy: 1, nCaptainBy: 1, nViceCaptainBy: 1, nFantasyCredit: 1, nScoredPoints: 1, nSeasonPoints: 1 }).lean().populate('iMatchId', ['sName', 'eFormat', 'dStartDate'])

      const matchData = data.map(p => {
        const match = { ...p, oMatch: { ...p.iMatchId, iMatchId: p.iMatchId._id } }
        delete match.iMatchId
        delete match.oMatch._id
        return match
      })
      matchPlayer.iMatchId = undefined
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].matchPlayer), data: { player: matchPlayer, match: matchData } })
    } catch (error) {
      catchError('MatchPlayer.matchPlayerSeasonPointV2', error, req, res)
    }
  }

  // To get single matchPlayer's scorepoints
  async matchPlayerScorePointUser(req, res) {
    try {
      const data = await MatchPlayerModel.findById(req.params.id, { nScoredPoints: 1, aPointBreakup: 1 }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cscorePoints) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cscorePoints), data })
    } catch (error) {
      catchError('MatchPlayer.matchPlayerScorePointUser', error, req, res)
    }
  }

  async updateCombinationBotPlayers(req, res) {
    try {
      let { players, aMatchLeagueId } = req.body

      const match = await MatchModel.findById(req.params.iMatchId, { eStatus: 1, bLineupsOut: 1, eCategory: 1 }).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })
      if (match && match.eStatus !== 'U') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].match_not_upcoming })

      let aMatchleaguesCMB = []
      if (aMatchLeagueId && aMatchLeagueId.length) {
        aMatchLeagueId = aMatchLeagueId.map(id => ObjectId(id))
        const nTotalMatchLeague = await MatchLeagueModel.countDocuments({ _id: { $in: aMatchLeagueId } })
        if (nTotalMatchLeague !== aMatchLeagueId.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].someMatchContest) })

        const cmbPlayersForLeagues = await CombinationPlayersModel.find({ iMatchLeagueId: { $in: aMatchLeagueId } }, { bBotCreated: 1, oRules: 1, aMatchPlayers: 1, dTeamEditedAt: 1, eTeamEdited: 1, iMatchLeagueId: 1 }).lean()
        aMatchleaguesCMB = cmbPlayersForLeagues.filter(l => l.bBotCreated === true)
      }
      const cmbPlayers = await CombinationPlayersModel.findOne({ iMatchId: match._id }, { bBotCreated: 1, oRules: 1, aMatchPlayers: 1, dTeamEditedAt: 1, eTeamEdited: 1 }).lean()
      if (!cmbPlayers || !cmbPlayers.bBotCreated) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].bot) })

      if (aMatchleaguesCMB && aMatchleaguesCMB.length) {
        aMatchLeagueId.map(l => {
          queuePush('CombinationBotUpdate', { iMatchId: match._id, aPlayers: players, iMatchLeagueId: l, oCombinationPlayers: cmbPlayers })
        })
      } else {
        await queuePush('CombinationBotUpdate', { iMatchId: match._id, aPlayers: players, oCombinationPlayers: cmbPlayers })
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].combination_update })
    } catch (error) {
      catchError('MatchPlayer.updateCombinationBotPlayers', error, req, res)
    }
  }

  async getCombinationBotPlayers(req, res) {
    try {
      const query = { iMatchId: ObjectId(req.params.iMatchId) }
      if (req.query && req.query.iMatchLeagueId) query.iMatchLeagueId = ObjectId(req.query.iMatchLeagueId)
      const cmbPlayers = await CombinationPlayersModel.findOne(query,
        { iMatchLeagueId: 1, bLineUpsUpdated: 1, bBotCreated: 1, eTeamEdited: 1, aError: 1, aSuccess: 1, oRules: 1, nTotalTeamEdited: 1, nTotalTeam: 1, _id: 0 }).populate([{ path: 'oMatchLeague', select: 'sName' }]).lean()
      if (!cmbPlayers) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].combination_bot) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].combination_bot), data: cmbPlayers })
    } catch (error) {
      catchError('MatchPlayer.getCombinationBotPlayers', error, req, res)
    }
  }
}

/**
 * It'll process particular cricket match player details from third part apis and according to our schema and store into our system.
 * @param {req} req request object
 * @param {res} match response object
 * @param {object} formatPlayers match players details
 * @param {eCategory} eCategory Sport Category
 * @param {eProvider} eProvider Sport api provider
 * @returns It'll process particular cricket match player details from third part apis and according to our schema and store into our system.
 */

async function storeMatchPlayer(req, res, formatPlayers, eCategory, eProvider) {
  const playerKeys = formatPlayers.map(({ sKey }) => sKey)

  const players = await PlayerModel.find({ sKey: { $in: playerKeys }, eCategory: eCategory }).lean()
  const existPlayers = players.map((player) => player.sKey)

  const newPlayers = []
  for (const formatPlayer of formatPlayers) {
    if (!existPlayers.includes(formatPlayer.sKey.toString())) {
      if (!newPlayers.some(({ sKey }) => sKey.toString() === formatPlayer.sKey.toString())) {
        let s3Res
        if (formatPlayer.sLogoUrl) s3Res = await bucket.getCloudImageURL({ url: formatPlayer.sLogoUrl, path: config.S3_BUCKET_PLAYER_THUMB_URL_PATH })
        formatPlayer.sImage = s3Res ? s3Res.sPath : ''
        newPlayers.push({
          sKey: formatPlayer.sKey,
          sName: formatPlayer.sName,
          sLogoUrl: formatPlayer.sLogoUrl || '',
          sImage: formatPlayer.sImage,
          eCategory: eCategory,
          eRole: formatPlayer.eRole,
          sTeamKey: formatPlayer.iTeamId,
          eProvider
        })
      }
    }
  }

  await playerServices.add(req, res, newPlayers)
  const { aPlayerKeys, aPlayerMatchIds, aPlayerTeamIds, aPlayerTeamName } = formatPlayers.reduce((acc, { sKey, iMatchId, iTeamId, sTeamName }) => {
    acc.aPlayerKeys.push(sKey)
    acc.aPlayerMatchIds.push(iMatchId)
    acc.aPlayerTeamIds.push(iTeamId)
    acc.aPlayerTeamName.push(sTeamName)
    return acc
  }, { aPlayerKeys: [], aPlayerMatchIds: [], aPlayerTeamIds: [], aPlayerTeamName: [] })

  const [aPlayerInfo, teamKey] = await Promise.all([
    PlayerModel.find({ sKey: { $in: aPlayerKeys }, eCategory: eCategory }).lean(),
    MatchModel.findOne({ _id: aPlayerMatchIds[0], eCategory }, { 'oHomeTeam.sKey': 1, 'oAwayTeam.sKey': 1 }).lean()
  ])

  const playerInfoMap = aPlayerInfo.reduce((obj, playerInfo) => {
    obj[playerInfo.sKey] = playerInfo
    return obj
  }, {})

  const { oHomeTeam, oAwayTeam } = teamKey
  const aTeamKey = await TeamModel.find({ sName: { $in: Array.from(new Set(aPlayerTeamName)) }, sKey: { $in: [oHomeTeam.sKey, oAwayTeam.sKey] }, eCategory }, { sName: 1, sKey: 1 }).lean()
  const teamKeyMap = aTeamKey.reduce((obj, team) => {
    obj[team.sName] = team.sKey
    return obj
  }, {})

  const aExistingPlayers = await MatchPlayerModel.find({
    iMatchId: { $in: Array.from(new Set(aPlayerMatchIds)) },
    iTeamId: { $in: Array.from(new Set(aPlayerTeamIds)) },
    iPlayerId: { $in: aPlayerInfo.map(({ _id }) => _id) }
  }, { _id: 0, iPlayerId: 1 }).lean()

  const existingPlayersSet = new Set(aExistingPlayers.map(({ iPlayerId }) => iPlayerId.toString()))

  const aNewMatchPlayers = []
  for (const formatPlayer of formatPlayers) {
    const { sKey, sTeamName } = formatPlayer
    if (!existingPlayersSet.has(playerInfoMap[sKey]._id.toString()) && teamKeyMap[sTeamName]) {
      aNewMatchPlayers.push({
        ...formatPlayer,
        sKey: sKey,
        sTeamKey: teamKeyMap[sTeamName],
        iPlayerId: playerInfoMap[sKey]._id,
        sImage: playerInfoMap[sKey].sImage
      })
    }
  }
  await MatchPlayerModel.create(aNewMatchPlayers)
}

/**
 * It'll dump particular cricket match player details from Entity sports api to our system.
 * @param {object} match details
 * @param {*} userLanguage English or Hindi(In future)
 * @returns It'll dump particular cricket match player details from Entity sports api to our system.
 */
async function fetchCricketPlayerFromEntitySport(match, userLanguage = 'English') {
  const { sSeasonKey, oHomeTeam, oAwayTeam, _id, eCategory, eFormat, sKey } = match

  let response
  const formatPlayers = []

  let setFormat = ''
  if (eFormat === 'ODI') {
    setFormat = 'ODI'
  } else if (eFormat === 'T20') {
    setFormat = 'T20'
  } else if (eFormat === 'T10') {
    setFormat = 'T10'
  } else if (eFormat === 'TEST') {
    setFormat = 'TEST'
  } else if (eFormat === '100BALL') {
    setFormat = '100BALL'
  }

  const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat: setFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()

  try {
    response = await axios.get(`https://rest.entitysport.com/v2/competitions/${sSeasonKey}/squads/${sKey}`,
      {
        params: {
          token: config.ENTITYSPORT_CRICKET_API_KEY
        }
      })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data?.response?.data, sUrl: `https://rest.entitysport.com/v2/competitions/${sSeasonKey}/squads/${sKey}` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_matchplayer,
      data: {}
    }
  }

  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data.response, sUrl: `https://rest.entitysport.com/v2/competitions/${sSeasonKey}/squads/${sKey}` })
  }

  const squadResult = response.data.response.squads || []

  for (const squadRes of squadResult) {
    const squad = squadRes
    const playersData = squad.players
    let iTeamId
    let sTeamName

    if (oHomeTeam.sKey === squad.team_id) {
      iTeamId = oHomeTeam.iTeamId
      sTeamName = oHomeTeam.sName
    } else if (oAwayTeam.sKey === squad.team_id) {
      iTeamId = oAwayTeam.iTeamId
      sTeamName = oAwayTeam.sName
    }

    const playerData = playersData.map((player) => {
      const { pid, title, playing_role: role, fantasy_player_rating: nFantasyCredit, logo_url: sLogoUrl } = player

      return {
        iMatchId: _id,
        iTeamId: iTeamId,
        sName: title,
        sLogoUrl,
        sTeamName: sTeamName,
        eRole: oCricketEntityRole[role] || 'BATS',
        sKey: pid,
        nFantasyCredit: nFantasyCredit || undefined,
        aPointBreakup
      }
    })
    formatPlayers.push(...playerData)
  }

  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatPlayers
  }
}

/**
 * It'll dump particular soccer match player details from Entity sports api to our system.
 * @param {object} match details
 * @param {*} userLanguage English or Hindi(In future)
 * @returns It'll dump particular soccer match player details from Entity sports api to our system.
 */
async function fetchSoccerPlayerFromEntitySport(match, userLanguage = 'English') {
  const { oHomeTeam, oAwayTeam, _id, eCategory, eFormat, sKey } = match
  let response
  try {
    response = await axios.get(`https://soccer.entitysport.com/matches/${sKey}/newfantasy`, { params: { token: config.ENTITYSPORT_SOCCER_API_KEY, fantasy: 'new2point' } })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: `https://soccer.entitysport.com/matches/${sKey}/fantasy` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_matchplayer,
      data: {}
    }
  }
  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data.response.items, sUrl: `https://soccer.entitysport.com/matches/${sKey}/newfantasy` })
  }

  const homeTeamPlayers = response.data.response.items.teams.home || []
  const awayTeamPlayers = response.data.response.items.teams.away || []

  if (homeTeamPlayers.length < 1 || awayTeamPlayers.length < 1) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_matchplayer,
      data: {}
    }
  }
  const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()

  const formatPlayers = homeTeamPlayers.map((player) => {
    const { pid: id, pname: sName, role: type, rating: nFantasyCredit } = player

    return {
      iMatchId: _id,
      iTeamId: oHomeTeam.iTeamId,
      sName,
      sTeamName: oHomeTeam.sName,
      eRole: oFootballEntityRole[type] || 'MID',
      sKey: id,
      nFantasyCredit: nFantasyCredit || undefined,
      aPointBreakup
    }
  })
  awayTeamPlayers.map((player) => {
    const { pid: id, pname: sName, role: type, rating: nFantasyCredit } = player

    formatPlayers.push({
      iMatchId: _id,
      iTeamId: oAwayTeam.iTeamId,
      sName,
      sTeamName: oAwayTeam.sName,
      eRole: oFootballEntityRole[type] || 'MID',
      sKey: id,
      nFantasyCredit,
      aPointBreakup
    })
  })

  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatPlayers
  }
}

/**
 * It'll dump particular kabaddi match player details from Entity sports api to our system.
 * @param  {object} match details
 * @param  {*} userLanguage='English' or 'Hindi
 * @returns It'll return particular kabaddi match players
 */
async function fetchKabaddiPlayerFromEntitySport(match, userLanguage = 'English') {
  const { oHomeTeam, oAwayTeam, _id, eCategory, eFormat, sKey } = match
  let response
  try {
    response = await axios.get(`https://kabaddi.entitysport.com/matches/${sKey}/info`, { params: { token: config.ENTITYSPORT_KABADDI_API_KEY } })
  } catch (err) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: err?.response?.data, sUrl: `https://kabaddi.entitysport.com/matches/${sKey}/info` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_matchplayer,
      data: {}
    }
  }

  const oApiLogData = { sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider }
  if (config.API_LOGS) {
    await ApiLogModel.insertMany([{ ...oApiLogData, oData: response.data.response.items, sUrl: `https://kabaddi.entitysport.com/matches/${sKey}/info` }])
  }

  const homeTeamData = response.data.response.items.squad.home
  const awayTeamData = response.data.response.items.squad.away

  const homeTeamPlayers = homeTeamData || []
  const awayTeamPlayers = awayTeamData || []
  if (homeTeamPlayers.length < 1 || awayTeamPlayers.length < 1) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_matchplayer,
      data: {}
    }
  }
  const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()

  const formatPlayers = homeTeamPlayers.map((player) => {
    const { pid: id, fullname: sName, positionname: type } = player

    return {
      iMatchId: _id,
      iTeamId: oHomeTeam.iTeamId,
      sName,
      sTeamName: oHomeTeam.sName,
      eRole: oKabaddiEntityRole[type] || 'DEF',
      sKey: id,
      aPointBreakup
    }
  })

  awayTeamPlayers.map((player) => {
    const { pid: id, fullname: sName, positionname: type } = player

    formatPlayers.push({
      iMatchId: _id,
      iTeamId: oAwayTeam.iTeamId,
      sName,
      sTeamName: oAwayTeam.sName,
      eRole: oKabaddiEntityRole[type] || 'DEF',
      sKey: id,
      aPointBreakup
    })
  })

  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatPlayers
  }
}

/**
 * It'll dump particular kabaddi match player details from Entity sports api to our system.
 * @param  {object} match details
 * @param  {*} userLanguage='English' or 'Hindi
 * @returns It'll return particular kabaddi match players
 */
async function fetchBasketballPlayerFromEntitySport(match, userLanguage = 'English') {
  const { oHomeTeam, oAwayTeam, _id, eCategory, eFormat } = match
  let homeTeamResponse
  let awayTeamResponse
  let bHomeTeamError = false
  try {
    homeTeamResponse = await axios.get(`https://basketball.entitysport.com/team/${oHomeTeam.sKey}/info`, { params: { token: config.ENTITYSPORT_BASKETBALL_API_KEY } })
    bHomeTeamError = true
    awayTeamResponse = await axios.get(`https://basketball.entitysport.com/team/${oAwayTeam.sKey}/info`, { params: { token: config.ENTITYSPORT_BASKETBALL_API_KEY } })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: !bHomeTeamError ? `https://basketball.entitysport.com/team/${oHomeTeam.sKey}/info` : `https://basketball.entitysport.com/team/${oAwayTeam.sKey}/info` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_matchplayer,
      data: {}
    }
  }

  const oApiLogData = { sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider }
  if (config.API_LOGS) {
    await ApiLogModel.insertMany([
      { ...oApiLogData, oData: homeTeamResponse.data.response.items, sUrl: `https://basketball.entitysport.com/team/${oHomeTeam.sKey}/info` },
      { ...oApiLogData, oData: awayTeamResponse.data.response.items, sUrl: `https://basketball.entitysport.com/team/${oAwayTeam.sKey}/info` }
    ])
  }

  const [homeTeamData] = homeTeamResponse.data.response.items
  const [awayTeamData] = awayTeamResponse.data.response.items

  const homeTeamPlayers = homeTeamData.squads || []
  const awayTeamPlayers = awayTeamData.squads || []

  if (homeTeamPlayers.length < 1 || awayTeamPlayers.length < 1) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_matchplayer,
      data: {}
    }
  }

  const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()

  const formatPlayers = homeTeamPlayers.map((player) => {
    const { pid: id, fullname: sName, primaryposition: eRole, fantasyplayerrating: nFantasyCredit } = player
    return {
      iMatchId: _id,
      iTeamId: oHomeTeam.iTeamId,
      sName,
      sTeamName: oHomeTeam.sName,
      eRole,
      nFantasyCredit: nFantasyCredit || undefined,
      sKey: id,
      aPointBreakup
    }
  })

  awayTeamPlayers.map((player) => {
    const { pid: id, fullname: sName, primaryposition: eRole, fantasyplayerrating: nFantasyCredit } = player
    formatPlayers.push({
      iMatchId: _id,
      iTeamId: oAwayTeam.iTeamId,
      sName,
      sTeamName: oAwayTeam.sName,
      eRole,
      nFantasyCredit: nFantasyCredit || undefined,
      sKey: id,
      aPointBreakup
    })
  })

  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatPlayers
  }
}

/**
 * It'll dump particular soccer match's lineUpsOut match player details from Entity sports api to our system.
 * @param {object} match details
 * @param {*} userLanguage English or Hindi(In future)
 * @returns It'll dump particular soccer match's lineUpsOut match player details from Entity sports api to our system.
 */

/**
 * It'll dump particular kabaddi match's starting7 match player details from Entity sports api to our system.
 * @param {object} match details
 * @param {*} userLanguage English or Hindi(In future)
 * @returns It'll dump particular kabaddi match's starting7 match player details from Entity sports api to our system.
 */
async function fetchStarting7FromKabaddiEntitySport(match, userLanguage = 'English') {
  const { sKey } = match
  let response
  try {
    response = await axios.get(`https://kabaddi.entitysport.com/matches/${sKey}/info`, { params: { token: config.ENTITYSPORT_KABADDI_API_KEY } })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: `https://kabaddi.entitysport.com/matches/${sKey}/info` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_kabaddi_lineups,
      data: []
    }
  }
  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data.response.items, sUrl: `https://kabaddi.entitysport.com/matches/${sKey}/info` })
  }
  const { home, away } = response.data.response.items.lineup
  const teamA = home ? home.starting7 : []
  const teamB = away ? away.starting7 : []
  const finalPlayersData = [...teamA, ...teamB]

  const playerKey = []
  for (const data of finalPlayersData) {
    playerKey.push(data.pid)
  }
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: playerKey
  }
}

/**
 * It'll dump particular basketball match's starting5 match player details from Entity sports api to our system.
 * @param {object} match details
 * @param {*} userLanguage English or Hindi(In future)
 * @returns It'll dump particular basketball match's starting5 match player details from Entity sports api to our system.
 */
async function fetchStarting5FromBasketballEntitySport(match, userLanguage = 'English') {
  const { sKey } = match
  let response
  try {
    response = await axios.get(`https://basketball.entitysport.com/matches/${sKey}/info`, { params: { token: config.ENTITYSPORT_BASKETBALL_API_KEY } })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: `https://basketball.entitysport.com/matches/${sKey}/info` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_basketball_lineups,
      data: []
    }
  }
  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data.response.items, sUrl: `https://basketball.entitysport.com/matches/${sKey}/info` })
  }
  const { home, away } = response.data.response.items.lineup.players
  const teamA = home || []
  const teamB = away || []
  const finalPlayersData = [...teamA, ...teamB]

  const playerKey = []
  for (const data of finalPlayersData) {
    playerKey.push(data.pid)
  }
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: playerKey
  }
}

module.exports = new MatchPlayer()
