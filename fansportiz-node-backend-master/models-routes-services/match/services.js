/* eslint-disable eqeqeq */
const async = require('async')
const MatchModel = require('./model')
const TeamModel = require('../team/model')
const PlayerRoleModel = require('../playerRoles/model')
const MatchPlayerModel = require('../matchPlayer/model')
const MatchLeagueModel = require('../matchLeague/model')
const SeasonModel = require('../season/model')
const SeriesLeaderBoardModel = require('../seriesLeaderBoard/model')
const MyMatchesModel = require('../myMatches/model')
const UserLeagueModel = require('../userLeague/model')
const SettingModel = require('../setting/model')
const MatchTeamModel = require('../matchTeams/model')
const ApiLogModel = require('../apiLog/ApiLog.model')
const sportServices = require('../sports/services')
const sportsData = require('../../data')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { pushTopicNotification } = require('../../helper/firebase.services')
const { catchError, pick, getPaginationValues, getPaginationValues2, handleCatchError, getIp } = require('../../helper/utilities.services')
const config = require('../../config/config')
const axios = require('axios')
const moment = require('moment')
const teamServices = require('../team/services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { CACHE_2, bAllowDiskUse } = require('../../config/config')
const { queuePush, redisClient2 } = require('../../helper/redis')
const { loadMatchToRedis } = require('../cron/services')
const { getCloudImageURL } = require('../../helper/cloudStorage.services')
const ScorePointModel = require('../scorePoint/model')
const {
  getCricketRefreshMatchData,
  getFootballRefreshMatchData,
  getBaseballRefreshMatchData,
  getBasketBallRefreshMatchData,
  getKabaddiRefreshMatchData
} = require('./common')
const {
  storeFantasyTips,
  getEntitySportCricketData,
  getEntitySportSoccerData,
  getEntitySportKabaddiData,
  getEntitySportBasketballData
} = require('./externalCall')
const { findNotificationMessage } = require('./grpc/clientServices')
const { createAdminLog } = require('../commonRules/grpc/clientServices')
const LeagueCategoryModel = require('../leagueCategory/model')

class Match {
  // To get details of single Match by _id
  async get(req, res) {
    try {
      const data = await MatchModel.findById(req.params.id).populate([{ path: 'oSeries', select: 'sName sKey' }, { path: 'oSeason', select: 'sName sKey' }]).lean()

      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      if (data.iGrandLeagueId) {
        const oGrandLeague = await MatchLeagueModel.findById(data.iGrandLeagueId, { sName: 1, nTotalPayout: 1 }).lean()
        data.oGrandLeague = oGrandLeague
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].match), data })
    } catch (error) {
      return catchError('Match.get', error, req, res)
    }
  }

  async matchStreamButton(req, res) {
    try {
      const btnSetting = await SettingModel.findOne({ sKey: 'STREAM_BUTTON', eStatus: 'Y' }, { _id: 0 }).lean()
      const data = btnSetting ? { bShowStreamButton: true } : { bShowStreamButton: false }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].match), data })
    } catch (error) {
      return catchError('Match.matchStreamButton', error, req, res)
    }
  }

  async matchStreamList(req, res) {
    try {
      let { nLimit, nOffset } = req.query
      nLimit = parseInt(nLimit) || 10
      nOffset = parseInt(nOffset) || 0

      const eStatus = req.params.type.toUpperCase()

      // We'll show match stream data only in live, completed and in-review match stag.
      if (!['L', 'CMP', 'I'].includes(eStatus)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].matchStatus) })

      const matchStatus = eStatus === 'CMP' ? ['CMP', 'I'] : ['L']
      const data = await MatchModel.find({ sStreamUrl: { $nin: ['', null], $exists: true }, eStatus: { $in: matchStatus } }, { aPlayerRole: 0, nRankCount: 0, nPrizeCount: 0, nWinDistCount: 0, dUpdatedAt: 0, iSeasonId: 0, iSeriesId: 0 }).skip(nOffset).limit(nLimit).lean()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].match), data })
    } catch (error) {
      return catchError('Match.matchStreamList', error, req, res)
    }
  }

  // To manually add new match
  async add(req, res) {
    try {
      const { sName, dStartDate, iHomeTeamId, nHomeTeamScore, iAwayTeamId, nAwayTeamScore, eCategory, eFormat, iTossWinnerId, eTossWinnerAction, iSeriesId, sSeasonName, iSeasonId } = req.body
      req.body = pick(req.body, ['bMatchOnTop', 'eFormat', 'sName', 'sSeasonKey', 'sVenue', 'eStatus', 'dStartDate', 'eCategory', 'sInfo', 'bDisabled', 'iSeriesId', 'nMaxTeamLimit', 'sSponsoredText', 'sFantasyPost', 'sStreamUrl', 'sLeagueText', 'sWinning', 'iSeasonId', 'sPitchDetails', 'nAvgVenueScore'])

      // For Match there should be two team exist exist in our db also. and both team aren't same.
      let oHomeTeam = await TeamModel.findOne({ _id: ObjectId(iHomeTeamId), eCategory: eCategory.toUpperCase() }).lean()
      if (!oHomeTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].chomeTeam) })

      let oAwayTeam = await TeamModel.findOne({ _id: ObjectId(iAwayTeamId), eCategory: eCategory.toUpperCase() }).lean()
      if (!oAwayTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cawayTeam) })

      // We assign series to match also that exist in our series leader board.
      if (iSeriesId) {
        const series = await SeriesLeaderBoardModel.findById(iSeriesId).lean()
        if (!series) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cseries) })
      }

      if (iSeasonId) {
        const season = await SeasonModel.findById(iSeasonId).lean()
        if (!season) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].season) })
      }

      if (iHomeTeamId === iAwayTeamId) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cteam) })

      // Toss winner either home team or away team of match.
      if (iTossWinnerId) {
        if (!((iTossWinnerId == oHomeTeam._id) || (iTossWinnerId == oAwayTeam._id))) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].ctossWinnerTeam) })
        }
        req.body.iTossWinnerId = iTossWinnerId
        if (eTossWinnerAction) {
          req.body.eTossWinnerAction = eTossWinnerAction
        }
      }

      oHomeTeam = { ...oHomeTeam, nScore: nHomeTeamScore, iTeamId: oHomeTeam._id }
      oAwayTeam = { ...oAwayTeam, nScore: nAwayTeamScore, iTeamId: oAwayTeam._id }

      // player role details of this sport category match should be exist in our system.
      const roles = await PlayerRoleModel.findOne({ eCategory: eCategory.toUpperCase() }, { aRole: 1, _id: 0 }).lean()
      if (!roles) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].croles) })

      const data = await MatchModel.create({ ...req.body, sKey: `${sName.toLocaleLowerCase().split(' ').join('-')}:${+new Date(dStartDate)}`, sSeasonName, oHomeTeam, oAwayTeam, aPlayerRole: roles.aRole, eFormat: eFormat.toUpperCase(), eCategory: eCategory.toUpperCase() })

      const { _id: iAdminId } = req.admin
      const oNewFields = { ...req.body }
      const logData = { oOldFields: {}, oNewFields, sIP: getIp(req), iAdminId: ObjectId(iAdminId), eKey: 'M' }
      await createAdminLog(logData)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].newMatch), data })
    } catch (error) {
      catchError('Match.add', error, req, res)
    }
  }

  // To update single match by _id
  async update(req, res) {
    try {
      const { iHomeTeamId, sSponsoredText, sStreamUrl, nHomeTeamScore, iAwayTeamId, nAwayTeamScore, eCategory, eFormat, iTossWinnerId, eTossWinnerAction, iSeriesId, eStatus, dStartDate, nMaxTeamLimit, sFantasyPost, sName, iSeasonId, iGrandLeagueId } = req.body

      req.body = pick(req.body, ['iTossWinnerId', 'eTossWinnerAction', 'bMatchOnTop', 'eFormat', 'sName', 'sSeasonKey', 'sVenue', 'eStatus', 'dStartDate', 'eCategory', 'sInfo', 'bDisabled', 'iSeriesId', 'nMaxTeamLimit', 'sStreamUrl', 'sLeagueText', 'sWinning', 'iSeasonId', 'sSeasonName', 'bScorecardShow', 'eStreamType', 'iGrandLeagueId', 'bDreamTeam', 'sPitchDetails', 'nAvgVenueScore'])

      req.body.iTossWinnerId = !iTossWinnerId ? null : iTossWinnerId
      req.body.iSeriesId = !iSeriesId ? null : iSeriesId
      req.body.iSeasonId = !iSeasonId ? null : iSeasonId
      // req.body.eTossWinnerAction = !eTossWinnerAction ? undefined : eTossWinnerAction

      const aQuery = []

      if (iSeriesId) aQuery.push(SeriesLeaderBoardModel.findById(iSeriesId).lean())
      if (iSeasonId) aQuery.push(SeasonModel.findById(iSeasonId).lean())

      let aTeamArr = [
        TeamModel.findOne({ _id: ObjectId(iHomeTeamId), eCategory: eCategory.toUpperCase() }).lean(),
        TeamModel.findOne({ _id: ObjectId(iAwayTeamId), eCategory: eCategory.toUpperCase() }).lean()
      ]
      if (aQuery.length) aTeamArr = aTeamArr.concat(aQuery)

      let [oHomeTeam, oAwayTeam, series, season] = await Promise.all(aTeamArr)

      if (!oHomeTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].chomeTeam) })
      if (!oAwayTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cawayTeam) })
      if (iSeriesId && !series) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cseries) })
      if (iSeasonId && !season) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].season) })

      if (eStatus === 'U') {
        // If match going to upcoming stage then we check if any match player doesn't exist in more than once.

        const isPlayerExist = await MatchPlayerModel.aggregate([
          { $match: { iMatchId: ObjectId(req.params.id) } },
          {
            $facet: {
              nameExist: [
                { $group: { _id: '$sName', count: { $sum: 1 } } },
                { $match: { _id: { $ne: null }, count: { $gt: 1 } } }
              ],
              keyExist: [
                { $group: { _id: '$sKey', count: { $sum: 1 } } },
                { $match: { _id: { $ne: null }, count: { $gt: 1 } } }
              ]
            }
          }
        ]).allowDiskUse(bAllowDiskUse).exec()

        if (isPlayerExist[0]?.nameExist.length > 0) { return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cplayerWithSameName) }) }
        if (isPlayerExist[0]?.keyExist.length > 0) { return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cplayerWithSameKey) }) }
      } else if (eStatus === 'CMP') {
        // If match going to completed stag then we'll check if there is no any match contest without cancelled or prize distribution.
        const data = await MatchLeagueModel.find({ iMatchId: ObjectId(req.params.id) }, { _id: 1, bPrizeDone: 1, bCancelled: 1, bWinningDone: 1 }).lean()
        if (data.length) {
          const bIsExist = data.find(({ bCancelled, bWinningDone }) => (bWinningDone === false && bCancelled === false))
          if (bIsExist) {
            return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].match_update_err.replace('##', messages[req.userLanguage].cmatchLeague) })
          }
        }
        data.filter(({ bPrizeDone }) => bPrizeDone === true).map(({ _id }) => redisClient2.hset(`hml:{${req.params.id}}:${_id.toString()}`, 'exists', 0).then(() => { Promise.resolve() }))
      } else if ((eStatus === 'L') && (new Date(Number(dStartDate)) > new Date())) {
        // If match going to live state then we'll check it's start date has future date or not.
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].future_date_err.replace('##', messages[req.userLanguage].match) })
      } else if (eStatus === 'I') {
        const sportsValidation = await sportServices.findSport(eCategory.toUpperCase())
        const { nTotalPlayers } = sportsValidation.oRule

        const invalidTeamsExist = await MatchTeamModel.aggregate(
          [
            {
              $match: {
                iMatchId: ObjectId(req.params.id)
              }
            },
            {
              $project: {
                numOfPlayer: { $size: '$aPlayers' }
              }
            },
            { $match: { numOfPlayer: { $ne: Number(nTotalPlayers) } } }
          ]).allowDiskUse(bAllowDiskUse).exec()

        if (invalidTeamsExist[0]) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_team_size_err })
      }

      let fieldRemoveQuery = {}
      if (iTossWinnerId) {
        if (!(iTossWinnerId == oHomeTeam._id || iTossWinnerId == oAwayTeam._id)) {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].ctossWinnerTeam) })
        }
        req.body.iTossWinnerId = iTossWinnerId
        if (eTossWinnerAction) {
          req.body.eTossWinnerAction = eTossWinnerAction
        } else {
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].required.replace('##', messages[req.userLanguage].ctossWinnerAction) })
        }
      } else {
        delete req.body.eTossWinnerAction
        fieldRemoveQuery = { $unset: { eTossWinnerAction: true } }
      }

      if (oHomeTeam._id === oAwayTeam._id) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].cteam) })

      oHomeTeam = { ...oHomeTeam, nScore: nHomeTeamScore, iTeamId: oHomeTeam._id }
      oAwayTeam = { ...oAwayTeam, nScore: nAwayTeamScore, iTeamId: oAwayTeam._id }

      const isExist = await MatchModel.findById(req.params.id).populate([{ path: 'oSeries', select: 'sName sKey' }, { path: 'oSeason', select: 'sName sKey' }]).lean()
      if (!isExist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      if (isExist.eStatus === 'U' && eStatus === 'I') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].match_update_error.replace('##', messages[req.userLanguage].cInreview).replace('#', messages[req.userLanguage].cLive) })

      // If the win is already distributed for the match then we won't change the format
      if (isExist.nWinDistCount && isExist.nWinDistCount > 0 && isExist.eFormat !== eFormat) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_update_match_format })
      } else if (isExist.eFormat !== eFormat) {
        const aPointBreakup = await ScorePointModel.find({ eCategory, eFormat }, { sKey: 1, sName: 1, nPoint: 1 }).lean()
        await MatchPlayerModel.updateMany({ iMatchId: ObjectId(isExist._id) }, { aPointBreakup })
      }

      const { sFantasyPost: iPostId = '' } = isExist
      // If there is any fantasy tips available, then we'll process or store in our db also.
      if (sFantasyPost && (iPostId !== sFantasyPost || !iPostId)) {
        const postResponse = await storeFantasyTips(sFantasyPost, eCategory.toUpperCase())
        if (!postResponse.isSuccess) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].went_wrong_with.replace('##', messages[req.userLanguage].sfantasyTips) })
      }
      if (sName && isExist.sName !== sName) {
        req.body.bIsNameUpdated = true
      }
      if (iGrandLeagueId) {
        const oTotalPayout = await MatchLeagueModel.findOne({ _id: ObjectId(iGrandLeagueId) }, { nTotalPayout: 1 }).lean()
        if (!oTotalPayout) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchLeague) })
        req.body.nLeagueTotalPayout = oTotalPayout?.nTotalPayout ?? 0
        req.body.iGrandLeagueId = ObjectId(iGrandLeagueId)
      }
      const data = await MatchModel.findByIdAndUpdate(req.params.id, { ...req.body, sFantasyPost, sSponsoredText, oHomeTeam, oAwayTeam, nMaxTeamLimit, sStreamUrl, eFormat: eFormat.toUpperCase(), eCategory: eCategory.toUpperCase(), ...fieldRemoveQuery, dUpdatedAt: Date.now() }, { new: true, runValidators: true }).populate([{ path: 'oSeries', select: 'sName sKey' }, { path: 'oSeason', select: 'sName sKey' }]).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      const { _id: iAdminId } = req.admin
      const logData = { oOldFields: isExist, oNewFields: data, sIP: getIp(req), iAdminId: ObjectId(iAdminId), eKey: 'M' }

      const [notification] = await Promise.all([
        findNotificationMessage('MATCH_TIPS'),
        createAdminLog(logData),
        MyMatchesModel.updateMany({ iMatchId: data._id }, { $set: { eMatchStatus: data.eStatus, dStartDate } }),
        MatchLeagueModel.updateMany({ iMatchId: data._id }, { $set: { eMatchStatus: data.eStatus } })
      ])

      if (notification && notification.bEnableNotifications) {
        const { sHeading, sDescription, ePlatform } = notification

        const msg = sDescription.replace('##', data.sName)
        await pushTopicNotification(ePlatform, sHeading, msg)
      }

      if (sName && sName.length > 0) {
        await UserLeagueModel.updateMany({ iMatchId: data._id }, { $set: { sMatchName: sName } })
      }

      if (data.eStatus === 'U') {
        const aMatchLeagues = await MatchLeagueModel.find({ iMatchId: ObjectId(req.params.id), bCancelled: false }, { _id: 1, iMatchId: 1 }).lean()

        if (aMatchLeagues.length) {
          async.eachSeries(aMatchLeagues, async (s, cb) => {
            redisClient2.hset(`hml:{${s.iMatchId}}:${s._id}`, 'exists', 0).then(() => { Promise.resolve() })
          }, (err, data) => {
            if (err) {
              handleCatchError(err)
            }
          })
        }
      } else if (data.eStatus === 'L') {
        const matchLeagues = await MatchLeagueModel.find({ iMatchId: data._id, bCancelled: false }, { _id: 1, iMatchId: 1, bPoolPrize: 1, bPrivateLeague: 1, nPrice: 1, nJoined: 1, nMax: 1, bConfirmLeague: 1, nMin: 1, eCategory: 1, iUserId: 1, bCancelled: 1, bCashbackEnabled: 1, nMinCashbackTeam: 1, nCashbackAmount: 1, eCashbackType: 1, bIsProcessed: 1, sName: 1, nTotalPayout: 1, sFairPlay: 1, bUnlimitedJoin: 1 }).lean()
        loadMatchToRedis(req.params.id)
        matchLeagues.map((matchLeague) => queuePush('MatchLive', matchLeague))
      } else if (data.eStatus === 'CNCL') {
        // if match updated to cancelled then we'll cancelled all the contest of this match.
        const leagues = await MatchLeagueModel.find({ iMatchId: data._id, bCancelled: false, bPrizeDone: false }).lean()

        const aLeagueId = leagues.map(({ _id }) => _id)
        await MatchLeagueModel.updateMany({ _id: { $in: aLeagueId } }, { bPlayReturnProcess: true })

        for (const league of leagues) {
          try {
            // league.bCancelled = true
            // const matchLeague = await league.save()

            const type = 'MATCHLEAGUE'
            this.processPlayReturn(league, type, ObjectId(iAdminId), getIp(req), 'ADMIN')
          } catch (error) {
            throw new Error(error)
          }
        }
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].match), data })
    } catch (error) {
      catchError('Match.update', error, req, res)
    }
  }

  // To update lineupsOut by _id
  async lineupsOutUpdate(req, res) {
    try {
      const { bLineupsOut } = req.body
      const data = await MatchModel.findByIdAndUpdate(req.params.id, { bLineupsOut, dUpdatedAt: Date.now() }, { new: true, runValidators: true }).lean()

      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      if (data.bLineupsOut === true) {
        const notification = await findNotificationMessage('LINEUPS')
        if (notification && notification.bEnableNotifications) {
          const { sHeading, sDescription, ePlatform } = notification

          const msg = sDescription.replace('##', data.sName)
          await pushTopicNotification(ePlatform, sHeading, msg) // push notification to all users for LinesUpsOut player data.
        }
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].cmatchLineupsOut), data })
    } catch (error) {
      catchError('Match.lineupsOutUpdate', error, req, res)
    }
  }

  // To fetch and format cricket matches for particular date from third party API
  async fetchCricket(req, res) {
    try {
      let { dDate, eProvider } = req.body
      dDate = moment(new Date(dDate)).format('YYYY-MM-DD')
      const endDate = moment(new Date(dDate)).add(1, 'd').format('YYYY-MM-DD')
      let formatMatches = []
      let oApiStoreData

      if (eProvider === 'ENTITYSPORT') {
        const result = await getEntitySportCricketData(dDate, endDate, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatMatches = result.data
        oApiStoreData = result.apiData
      } else {
        const result = await getSportradarCricketData(dDate)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatMatches = result.data
        oApiStoreData = result.apiData
      }

      await Promise.all(formatMatches).then(formatMatch => {
        (async () => {
          const seasonData = formatMatch.map(({ seasonData }) => seasonData)
          await storeSeason(seasonData)
          await storeSeries(seasonData)

          const data = await storeMatch(req, res, formatMatch)
          const { isSuccess, status, message } = data
          storeLog(oApiStoreData)
          if (isSuccess) { return res.status(status).jsonp({ status, message }) }
        })()
      }).catch(error => {
        catchError('Match.fetchCricket', error, req, res)
      })
    } catch (error) {
      catchError('Match.fetchCricket', error, req, res)
    }
  }

  // To fetch and format football matches from third party API
  async fetchFootball(req, res) {
    try {
      let { dDate, eProvider } = req.body
      dDate = moment(new Date(dDate)).format('YYYY-MM-DD')
      const endDate = moment(new Date(dDate)).add(1, 'd').format('YYYY-MM-DD')
      let formatMatches = []
      let oApiStoreData

      if (eProvider === 'ENTITYSPORT') {
        const result = await getEntitySportSoccerData(dDate, endDate, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatMatches = result.data
        oApiStoreData = result.apiData
      } else {
        const result = await getSportsradarSoccerData(dDate, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatMatches = result.data
        oApiStoreData = result.apiData
      }
      Promise.all(formatMatches).then(formatMatch => {
        (async () => {
          const seasonData = formatMatch.map(({ seasonData }) => seasonData)
          await storeSeason(seasonData)
          await storeSeries(seasonData)

          const data = await storeMatch(req, res, formatMatch)
          const { isSuccess, status, message } = data
          storeLog(oApiStoreData)
          if (isSuccess) { return res.status(status).jsonp({ status, message }) }
        })()
      }).catch(error => {
        catchError('Match.fetchFootball', error, req, res)
      })
    } catch (error) {
      catchError('Match.fetchFootball', error, req, res)
    }
  }

  // To fetch and format basketball matches from third party API
  async fetchBasketball(req, res) {
    try {
      let { dDate, eProvider } = req.body
      dDate = moment(new Date(dDate)).format('YYYY/MM/DD')
      let formatMatches = []
      let oApiStoreData

      if (eProvider === 'ENTITYSPORT') {
        const result = await getEntitySportBasketballData(req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatMatches = result.data
        oApiStoreData = result.apiData
      } else {
        const result = await getSportsradarBasketballData(dDate, req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatMatches = result.data
        oApiStoreData = result.apiData
      }

      await Promise.all(formatMatches).then(formatMatch => {
        (async () => {
          if (eProvider === 'ENTITYSPORT') {
            const seasonData = formatMatch.map(({ seasonData }) => seasonData)
            if (seasonData.length) {
              const uniqueSeasonData = Array.isArray(seasonData) && seasonData.length ? [...new Map(seasonData.map((item) => [item.sKey, item])).values()] : []
              if (uniqueSeasonData.length) {
                await storeSeason(uniqueSeasonData)
                await storeSeries(uniqueSeasonData)
              }
            }
          }
          const { isSuccess, status, message } = await storeMatch(req, res, formatMatch)
          storeLog(oApiStoreData)
          if (isSuccess) { return res.status(status).jsonp({ status, message }) }
        })()
      }).catch(error => {
        catchError('Match.fetchBasketball', error, req, res)
      })
    } catch (error) {
      catchError('Match.fetchBasketball', error, req, res)
    }
  }

  // To fetch and format baseball matches from third party API
  async fetchBaseball(req, res) {
    try {
      const { eProvider } = req.body
      let formatMatches = []
      let oApiStoreData
      if (eProvider === 'ENTITYSPORT') {
        const result = await getEntitySportBaseballData(req.userLanguage)
        if (result.isSuccess === false) {
          return res.status(result.status).jsonp({ status: result.status, message: result.message })
        }
        formatMatches = result.data
        oApiStoreData = result.apiData
      }

      const responseData = await storeMatch(req, res, formatMatches)
      const { isSuccess, status, message } = responseData
      storeLog(oApiStoreData)
      if (isSuccess) { return res.status(status).jsonp({ status, message }) }
    } catch (error) {
      catchError('Match.fetchBaseball', error, req, res)
    }
  }

  // To fetch and format kabaddi matches from third party API
  async fetchKabaddi(req, res) {
    try {
      const { eProvider } = req.body

      let formatMatches = []
      let oApiStoreData
      if (eProvider === 'ENTITYSPORT') {
        const result = await getEntitySportKabaddiData(req.userLanguage)
        if (result.isSuccess === false) return res.status(result.status).jsonp({ status: result.status, message: result.message })
        formatMatches = result.data
        oApiStoreData = result.apiData
      }
      formatMatches = await Promise.all(formatMatches)
      const seasonData = formatMatches.map(({ seasonData }) => seasonData)
      const uniqueSeasonData = [...new Map(seasonData.map((item) => [item.sKey, item])).values()]
      await storeSeason(uniqueSeasonData)
      await storeSeries(uniqueSeasonData)

      const { isSuccess, status, message } = await storeMatch(req, res, formatMatches)
      storeLog(oApiStoreData)
      if (isSuccess) { return res.status(status).jsonp({ status, message }) }
    } catch (error) {
      catchError('Match.fetchKabaddi', error, req, res)
    }
  }

  // To get List of matches (SportsType wise) with pagination, sorting and searching
  async list(req, res) {
    try {
      req.query = pick(req.query, ['start', 'limit', 'sort', 'order', 'search', 'filter', 'dateFilter', 'sportsType', 'datefrom', 'dateto', 'eProvider', 'eFormat', 'iSeasonId'])
      const { filter, sportsType, datefrom, dateto, eProvider, eFormat, iSeasonId } = req.query

      const { start, limit, sorting, search } = getPaginationValues2(req.query)

      const filters = filter ? { eStatus: filter.toUpperCase() } : {}

      const dateFilter = datefrom && dateto ? { dStartDate: { $gte: (datefrom), $lte: (dateto) } } : {}

      const eProviderFilter = eProvider ? [eProvider] : sportsData.matchProvider

      let query = search ? { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : {}
      const cricketFormat = sportsData.cricketFormat || []
      if (sportsType.toUpperCase() === 'CRICKET' && eFormat && cricketFormat.includes(eFormat.toString())) {
        query = { ...query, eFormat: eFormat.toUpperCase() }
      }

      query = ObjectId.isValid(iSeasonId) ? { ...query, iSeasonId } : query

      query = {
        ...query,
        eCategory: sportsType.toUpperCase(),
        eProvider: { $in: eProviderFilter }
      }
      const [results, setMegaContest] = await Promise.all([
        MatchModel.find({ ...filters, ...dateFilter, ...query }, {
          sKey: 1,
          eFormat: 1,
          sName: 1,
          sSeasonKey: 1,
          eStatus: 1,
          dStartDate: 1,
          iTossWinnerId: 1,
          eTossWinnerAction: 1,
          bMatchOnTop: 1,
          oHomeTeam: 1,
          oAwayTeam: 1,
          sWinning: 1,
          eCategory: 1,
          sInfo: 1,
          sSeasonName: 1,
          sSponsoredText: 1,
          iSeriesId: 1,
          eProvider: 1,
          bLineupsOut: 1,
          sFantasyPost: 1,
          sStreamUrl: 1,
          dCreatedAt: 1,
          bDisabled: 1,
          eStreamType: 1,
          iGrandLeagueId: 1,
          nLeagueTotalPayout: 1
        }).populate({ path: 'iGrandLeagueId', model: MatchLeagueModel, select: 'ePayoutType iLeagueCatId' }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean(),
        SettingModel.findOne({ sKey: 'MEGA_CONTEST', eStatus: 'Y' }).lean().cache(CACHE_2, 'setting:MEGA_CONTEST')
      ])

      let data = []
      if (setMegaContest) {
        const nTotalPayoutAmount = setMegaContest.nMegaContestAmount

        const aMatchIds = results.map((m) => m._id)
        const megaContest = await MatchLeagueModel.find({ iMatchId: { $in: aMatchIds }, nTotalPayout: { $exists: true, $gte: nTotalPayoutAmount }, bPrivateLeague: false, bCancelled: false }, { _id: 0, iMatchId: 1, sName: 1, nTotalPayout: 1 }).lean()

        for (const match of results) {
          const { _id, ePayoutType, iLeagueCatId } = match.iGrandLeagueId || {}
          match.isMegaContest = false
          match.nTotalPayout = 0
          if (_id) {
            const oLeagueCategory = await LeagueCategoryModel.findOne({ _id: ObjectId(iLeagueCatId) }, { sImage: 1, sTitle: 1 }).lean()
            match.iGrandLeagueId = _id
            match.eGrandPayoutType = ePayoutType
            match.sGrandLeagueName = oLeagueCategory?.sTitle || ''
            match.sGrandLeagueImage = oLeagueCategory?.sImage || ''
          }

          megaContest.find((mContest) => {
            if (match._id.toString() === mContest.iMatchId.toString()) {
              match.isMegaContest = true
              match.nTotalPayout = mContest.nTotalPayout || 0
            }
          })
        }
      } else {
        for (const match of results) {
          const { _id, ePayoutType, iLeagueCatId } = match.iGrandLeagueId || {}
          if (_id) {
            const oLeagueCategory = await LeagueCategoryModel.findOne({ _id: ObjectId(iLeagueCatId) }, { sImage: 1, sTitle: 1 }).lean()
            match.iGrandLeagueId = _id
            match.eGrandPayoutType = ePayoutType
            match.sGrandLeagueName = oLeagueCategory?.sTitle || ''
            match.sGrandLeagueImage = oLeagueCategory?.sImage || ''
          }
        }
      }
      data = [{ results }]
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].match), data })
    } catch (error) {
      return catchError('Match.list', error, req, res)
    }
  }

  // To get counts of matches (SportsType wise) with searching
  async getCounts(req, res) {
    try {
      req.query = pick(req.query, ['search', 'filter', 'dateFilter', 'sportsType', 'datefrom', 'dateto', 'eProvider', 'eFormat', 'iSeasonId'])
      const { filter, sportsType, datefrom, dateto, eProvider, eFormat, iSeasonId } = req.query

      const { search } = getPaginationValues2(req.query)

      const filters = filter ? { eStatus: filter.toUpperCase() } : {}

      const dateFilter = datefrom && dateto ? { dStartDate: { $gte: (datefrom), $lte: (dateto) } } : {}

      const eProviderFilter = eProvider ? [eProvider] : sportsData.matchProvider

      let query = search ? { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : {}

      const cricketFormat = sportsData.cricketFormat || []
      if (sportsType === 'CRICKET' && eFormat && cricketFormat.includes(eFormat.toString())) {
        query = { ...query, eFormat: eFormat.toUpperCase() }
      }

      query = ObjectId.isValid(iSeasonId) ? { ...query, iSeasonId } : query

      query = {
        ...query,
        eCategory: sportsType.toUpperCase(),
        eProvider: { $in: eProviderFilter }
      }

      const count = await MatchModel.countDocuments({ ...filters, ...dateFilter, ...query })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', `${messages[req.userLanguage].match} ${messages[req.userLanguage].cCounts}`), data: { count } })
    } catch (error) {
      return catchError('Match.getCounts', error, req, res)
    }
  }

  // To get List of matches with pagination, sorting and searching
  async fullList(req, res) {
    try {
      req.query = pick(req.query, ['start', 'limit', 'sort', 'order', 'search', 'filter', 'dateFilter', 'sportsType', 'datefrom', 'dateto', 'eProvider'])
      const { filter, sportsType, datefrom, dateto, eProvider } = req.query

      const { start, limit, sorting, search } = getPaginationValues(req.query)

      const filters = filter ? { eStatus: filter.toUpperCase() } : {}

      const dateFilter = datefrom && dateto ? { $or: [{ dStartDate: { $gte: (datefrom), $lte: (dateto) } }] } : {}

      const eProviderFilter = eProvider ? [eProvider] : sportsData.matchProvider

      let query = {
        dStartDate: { $gt: new Date() },
        eStatus: 'U',
        eProvider: { $in: eProviderFilter }
      }
      query = sportsType ? { ...query, eCategory: sportsType.toUpperCase() } : query
      query = search ? { ...query, sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : query

      const results = await MatchModel.find({ ...filters, ...dateFilter, ...query }, {
        sKey: 1,
        eFormat: 1,
        sName: 1,
        sSeasonKey: 1,
        eStatus: 1,
        dStartDate: 1,
        iTossWinnerId: 1,
        eTossWinnerAction: 1,
        bMatchOnTop: 1,
        oHomeTeam: 1,
        oAwayTeam: 1,
        sWinning: 1,
        eCategory: 1,
        sInfo: 1,
        sSeasonName: 1,
        sSponsoredText: 1,
        iSeriesId: 1,
        eProvider: 1,
        bLineupsOut: 1,
        sFantasyPost: 1,
        sStreamUrl: 1,
        dCreatedAt: 1,
        eStreamType: 1
      }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()

      const total = await MatchModel.countDocuments({ ...filters, ...dateFilter, ...query })

      const data = [{ total, results }]
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].match), data: data })
    } catch (error) {
      return catchError('Match.list', error, req, res)
    }
  }

  // to merge manually added match with api generated match
  async mergeMatch(req, res) {
    try {
      const { id, apiMatchId, aPlayers } = req.body
      const mappingPlayersId = aPlayers.map((obj) => (Object.values(obj))).flat()
      const apiMappingPlayersId = aPlayers.map((obj) => (Object.values(obj)[1])).flat()

      // finding both match players
      const allPlayers = MatchPlayerModel.find({ iMatchId: { $in: [ObjectId(id), ObjectId(apiMatchId)] } }, { sKey: 1, iMatchId: 1 }).lean()

      // manually added and api generated match
      const [manualMatch, apiMatch] = await Promise.all([MatchModel.findById(id).lean(), MatchModel.findById(apiMatchId).select({ _id: 0, dCreatedAt: 0, __v: 0 }).lean()])
      if (!manualMatch || !apiMatch) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      if (manualMatch.eCategory !== apiMatch.eCategory) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].match) })

      // updated manual match
      await MatchModel.updateOne({ _id: ObjectId(id) }, apiMatch)

      // all match players
      const allMatchPlayers = await allPlayers
      const mappingPlayers = []
      const remainingApiMatchPlayersId = []
      allMatchPlayers.forEach((player) => {
        if (mappingPlayersId.includes(player._id.toString())) {
          mappingPlayers.push(player)
        } else if (!mappingPlayersId.includes(player._id.toString()) && player.iMatchId.toString() === apiMatchId) {
          remainingApiMatchPlayersId.push(ObjectId(player._id))
        }
      })

      if (mappingPlayers.length !== mappingPlayersId.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].matchPlayer) })

      // updating all manual matchplayers with api matchPlayers key
      const bulkArray = aPlayers.map((data) => ({
        updateOne: {
          filter: { _id: data.oldId },
          update: { $set: { sKey: mappingPlayers.find((elem) => elem._id.toString() === data.newId).sKey } }
        }
      }))
      // updating all remaining api match players with manual match id
      bulkArray.push({
        updateMany: {
          filter: { _id: { $in: remainingApiMatchPlayersId } },
          update: { $set: { iMatchId: ObjectId(id) } }
        }
      })
      await MatchPlayerModel.bulkWrite(bulkArray, { ordered: false })

      // deleting apiMatch and apiMatchPlayers
      await Promise.all([MatchPlayerModel.deleteMany({ _id: { $in: apiMappingPlayersId } }), MatchModel.deleteOne({ _id: apiMatchId })])

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].action_success.replace('##', messages[req.userLanguage].cMerge) })
    } catch (error) {
      catchError('Match.mergeMatch', error, req, res)
    }
  }

  // To refresh match data
  async refreshMatchData(req, res) {
    try {
      const match = await MatchModel.findById(req.params.id).lean()
      if (!match) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })
      const { eCategory, sKey, eProvider, _id } = match

      let refreshData

      switch (eCategory) {
        case 'CRICKET':
          refreshData = await getCricketRefreshMatchData({ sKey, eProvider, _id })
          break
        case 'FOOTBALL':
          refreshData = await getFootballRefreshMatchData({ sKey, eProvider, _id })
          break
        case 'KABADDI':
          refreshData = await getKabaddiRefreshMatchData({ sKey, eProvider, _id })
          break
        case 'BASEBALL':
          refreshData = await getBaseballRefreshMatchData({ sKey, eProvider, _id })
          break
        case 'BASKETBALL':
          refreshData = await getBasketBallRefreshMatchData({ sKey, eProvider, _id })
          break
      }

      if (refreshData) {
        if (refreshData.isSuccess === false) return res.status(refreshData.status).jsonp({ status: refreshData.status, message: refreshData.message })
        await MatchModel.updateOne({ _id: ObjectId(req.params.id) }, refreshData.data)
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].refresh_success.replace('##', messages[req.userLanguage].match) })
    } catch (error) {
      catchError('Match.refreshMatchData', error, req, res)
    }
  }

  // ************ User ************
  async upcomingMatchList(req, res) {
    try {
      const { sportsType = 'CRICKET' } = req.query

      const [setMegaContest, aMatchData] = await Promise.all([
        SettingModel.findOne({ sKey: 'MEGA_CONTEST', eStatus: 'Y' }).lean().cache(CACHE_2, 'setting:MEGA_CONTEST'),
        MatchModel.find({ eStatus: 'U', eCategory: sportsType.toUpperCase(), dStartDate: { $gt: new Date() } }, { aPlayerRole: 0, nRankCount: 0, nPrizeCount: 0, nWinDistCount: 0, dUpdatedAt: 0, sWinning: 0, iSeasonId: 0, iSeriesId: 0 }).populate({ path: 'iGrandLeagueId', model: MatchLeagueModel, select: 'ePayoutType iLeagueCatId' }).lean()
      ])

      let data = []

      if (setMegaContest) {
        const nTotalPayoutAmount = setMegaContest.nMegaContestAmount

        const aMatchIds = aMatchData.map((m) => m._id)
        const megaContest = await MatchLeagueModel.find({ iMatchId: { $in: aMatchIds }, nTotalPayout: { $exists: true, $gte: nTotalPayoutAmount }, bPrivateLeague: false, bCancelled: false }, { _id: 0, iMatchId: 1, sName: 1, nTotalPayout: 1 }).lean()

        for (const match of aMatchData) {
          const { _id, ePayoutType, iLeagueCatId } = match.iGrandLeagueId || {}
          match.isMegaContest = false
          match.nTotalPayout = 0
          if (_id) {
            const oLeagueCategory = await LeagueCategoryModel.findOne({ _id: ObjectId(iLeagueCatId) }, { sImage: 1, sTitle: 1 }).lean()
            match.iGrandLeagueId = _id
            match.eGrandPayoutType = ePayoutType
            match.sGrandLeagueName = oLeagueCategory?.sTitle || ''
            match.sGrandLeagueImage = oLeagueCategory?.sImage || ''
          }

          megaContest.find((mContest) => {
            if (match._id.toString() === mContest.iMatchId.toString()) {
              match.isMegaContest = true
              match.nTotalPayout = mContest.nTotalPayout || 0
            }
          })
        }
      } else {
        for (const match of aMatchData) {
          const { _id, ePayoutType, iLeagueCatId } = match.iGrandLeagueId || {}
          if (_id) {
            const oLeagueCategory = await LeagueCategoryModel.findOne({ _id: ObjectId(iLeagueCatId) }, { sImage: 1, sTitle: 1 }).lean()
            match.iGrandLeagueId = _id
            match.eGrandPayoutType = ePayoutType
            match.sGrandLeagueName = oLeagueCategory?.sTitle || ''
            match.sGrandLeagueImage = oLeagueCategory?.sImage || ''
          }
        }
      }
      data = aMatchData
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cupcomingMatch), data })
    } catch (error) {
      return catchError('Match.upcomingMatchList', error, req, res)
    }
  }

  // To get details of single Match by _id user side
  async getMatchInfo(req, res) {
    try {
      const data = await MatchModel.findById(req.params.id, { aPlayerRole: 0, __v: 0, dCreatedAt: 0 }).lean()

      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].match), data })
    } catch (error) {
      return catchError('Match.getMatchInfo', error, req, res)
    }
  }
}

/**
 * It'll process the all required third party data according to our system requirements schema and store in db.
 * @param {*} req reqest object
 * @param {*} endDate response object
 * @param {*} formatMatches Match details
 * @returns It'll process the all required third party data according to our system requirements schema and store in db.
 */
async function storeMatch(req, res, formatMatches) {
  try {
    // need to remove duplicate matches from format matches
    if (!formatMatches.length) { return { isSuccess: true, status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', `${formatMatches.length} ${messages[req.userLanguage].newMatch}`) } }

    const eCategory = formatMatches[0].eCategory
    const eProvider = formatMatches[0].eProvider
    const matchKeys = []
    const teamKeys = []

    const roles = await PlayerRoleModel.findOne({ eCategory }, { aRole: 1, _id: 0 }).lean()
    if (!roles) { return { isSuccess: true, status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].croles) } }
    for (const formatMatch of formatMatches) {
      if (formatMatch.oHomeTeam && formatMatch.oHomeTeam.sKey) teamKeys.push(formatMatch.oHomeTeam.sKey)
      if (formatMatch.oAwayTeam && formatMatch.oAwayTeam.sKey) teamKeys.push(formatMatch.oAwayTeam.sKey)
      matchKeys.push(formatMatch.sKey)
    }

    const teams = await TeamModel.find({ sKey: { $in: teamKeys }, eCategory: eCategory }, { sKey: 1, _id: 0 }).read('primary').readConcern('majority').lean()
    const existTeamKeys = teams.map((team) => team.sKey)
    // Add new teams in TeamModel
    const newTeams = []
    for (const formatTeam of formatMatches) {
      const { oHomeTeam, oAwayTeam } = formatTeam
      if (oHomeTeam.sKey && (!existTeamKeys.includes(oHomeTeam.sKey.toString()))) {
        if (!newTeams.some(({ sKey }) => sKey.toString() === oHomeTeam.sKey.toString())) {
          if (oHomeTeam.sLogoUrl) {
            const s3Res = await getCloudImageURL({ url: oHomeTeam.sLogoUrl, path: config.S3_BUCKET_TEAM_THUMB_URL_PATH })
            oHomeTeam.sImage = s3Res.sPath
          }
          newTeams.push({ ...oHomeTeam, eCategory, eProvider })
        }
      }
      if (oAwayTeam.sKey && (!existTeamKeys.includes(oAwayTeam.sKey.toString()))) {
        if (!newTeams.some(({ sKey }) => sKey.toString() === oAwayTeam.sKey.toString())) {
          if (oAwayTeam.sLogoUrl) {
            const s3Res = await getCloudImageURL({ url: oAwayTeam.sLogoUrl, path: config.S3_BUCKET_TEAM_THUMB_URL_PATH })
            oAwayTeam.sImage = s3Res.sPath
          }
          newTeams.push({ ...oAwayTeam, eCategory, eProvider })
        }
      }
    }
    await teamServices.add(req, res, newTeams)
    const newMatch = []
    const matches = await MatchModel.find({ sKey: { $in: matchKeys }, eCategory: eCategory }, { sKey: 1, _id: 0 }).read('primary').readConcern('majority').lean()
    const existMatchKeys = matches.map((match) => match.sKey)

    const aHomeTeamsKeys = []
    const aAwayTeamsKeys = []
    const aSeasonKeys = []

    formatMatches.map((e) => {
      aHomeTeamsKeys.push(e.oHomeTeam.sKey.toString())
      aAwayTeamsKeys.push(e.oAwayTeam.sKey)
      aSeasonKeys.push(e.sSeasonKey)
    })

    const [aAllTeamsInfo, aSeasonsInfo, aSeriesInfo] = await Promise.all([
      TeamModel.find({ sKey: { $in: [...aHomeTeamsKeys, ...aAwayTeamsKeys] }, eCategory: eCategory }, { sKey: 1, _id: 1, sImage: 1, sName: 1, sShortName: 1 }).lean(),
      SeasonModel.find({ sKey: { $in: aSeasonKeys }, eCategory: eCategory }, { _id: 1, sKey: 1 }).lean(),
      SeriesLeaderBoardModel.find({ sKey: { $in: aSeasonKeys }, eCategory: eCategory }, { _id: 1, sKey: 1 }).lean()
    ])

    formatMatches.forEach(async (eMatch, index) => {
      if (!existMatchKeys.includes(eMatch.sKey.toString())) {
        if (!newMatch.some((match) => match.sKey.toString() === eMatch.sKey.toString())) {
          const oHomeTeamInfo = aAllTeamsInfo[aAllTeamsInfo.findIndex((e) => eMatch.oHomeTeam.sKey.toString() === e.sKey)]
          const oAwayTeamInfo = aAllTeamsInfo[aAllTeamsInfo.findIndex((e) => eMatch.oAwayTeam.sKey === e.sKey)]
          const oSeasonInfo = aSeasonsInfo[aSeasonsInfo.findIndex((e) => eMatch.sSeasonKey.toString() === e.sKey)]
          const oSeriesInfo = aSeriesInfo[aSeriesInfo.findIndex((e) => eMatch.sSeasonKey.toString() === e.sKey)]

          eMatch.oHomeTeam = { ...oHomeTeamInfo, iTeamId: oHomeTeamInfo._id }
          if (eMatch?.oAwayTeam && eMatch?.oAwayTeam?.sKey) {
            eMatch.oAwayTeam = { ...oAwayTeamInfo, iTeamId: oAwayTeamInfo._id }
          } else {
            eMatch.oAwayTeam = {}
          }
          eMatch.aPlayerRole = roles.aRole ? [...roles.aRole] : []

          if (oSeasonInfo) eMatch.iSeasonId = oSeasonInfo._id
          if (oSeriesInfo) eMatch.iSeriesId = oSeriesInfo._id

          newMatch.push(eMatch)
        }
      }
    })

    await MatchModel.insertMany(newMatch, { ordered: false })
    return { isSuccess: true, status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', `${newMatch.length} ${messages[req.userLanguage].newMatch}`) }
  } catch (error) {
    handleCatchError(error)
    return { isSuccess: true, status: jsonStatus.OK, message: messages[req.userLanguage].no_match_scheduled }
  }
}

async function getSportradarCricketData(dDate, userLanguage = 'English') {
  let response
  try {
    response = await axios.get(`https://api.sportradar.us/cricket-p2/en/schedules/${dDate}/schedule.json`, { params: { api_key: config.SPORTSRADAR_API_KEY } })
  } catch (error) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_match_scheduled,
      data: {}
    }
  }
  const data = response.data ? response.data.sport_events : []
  const oStoreData = { eCategory: 'CRICKET', eType: 'MATCHES', eProvider: 'SPORTSRADAR', sUrl: `https://api.sportradar.us/cricket-p2/en/schedules/${dDate}/schedule.json` }

  const formatMatches = data.map(async (sportEvent) => {
    const { id, tournament = {}, season, venue, competitors, scheduled } = sportEvent
    let { name = '', gender, type = '' } = tournament

    if (!gender) {
      const arr = name.split(' ')
      gender = (arr[arr.length - 1] === 'Women') ? 'women' : 'men'
    }
    let oHomeTeam = {}
    let oAwayTeam = {}
    for (const competitor of competitors) {
      if (competitor.qualifier === 'home') {
        oHomeTeam = {
          sKey: competitor.id,
          sName: (gender === 'women') ? competitor.name.toString().concat(' -Women') : competitor.name,
          sShortName: (gender === 'women') ? competitor.abbreviation.toString().concat(' -W') : competitor.abbreviation
        }
      } else if (competitor.qualifier === 'away') {
        oAwayTeam = {
          sKey: competitor.id,
          sName: (gender === 'women') ? competitor.name.toString().concat(' -Women') : competitor.name,
          sShortName: (gender === 'women') ? competitor.abbreviation.toString().concat(' -W') : competitor.abbreviation
        }
      }
    }
    let eFormat
    type = type.toUpperCase()
    if (type === 'T20I' || type === 'VT20' || type === 'T20') {
      eFormat = 'T20'
    } else if (type === 'T10' || type === 'T10I') {
      eFormat = 'T10'
    } else if (type === 'TEST') {
      eFormat = 'TEST'
    } else if (type === '100BALL') {
      eFormat = '100BALL'
    } else {
      eFormat = 'ODI'
    }

    return {
      sKey: id,
      sName: oHomeTeam.sShortName.concat(' vs ', oAwayTeam.sShortName),
      // sName: (gender === 'women') ? competitors[0].abbreviation.concat('-W vs ', competitors[1].abbreviation.concat('-W')) : competitors[0].abbreviation.concat(' vs ', competitors[1].abbreviation),
      eFormat,
      sSeasonKey: season ? season.id : '',
      sVenue: venue ? venue.name.toString().concat(' ', venue.city_name, ' ', venue.country_name) : '',
      dStartDate: new Date(scheduled),
      dEntryCloseTime: new Date(scheduled),
      oHomeTeam: oHomeTeam,
      oAwayTeam: oAwayTeam,
      eCategory: 'CRICKET', // default
      eProvider: 'SPORTSRADAR', // default,
      sSeasonName: season ? season.name : '',
      seasonData: {
        sName: season.name,
        sKey: season.id,
        eCategory: 'CRICKET',
        dStartDate: season.start_date,
        dEndDate: season.end_date,
        eProvider: 'SPORTSRADAR'
      }
    }
  })
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatMatches,
    apiData: { oStoreData, aApiMatches: data }
  }
}

async function getSportsradarSoccerData(dDate, userLanguage = 'English') {
  let response
  try {
    // response = await axios.get(`https://api.sportradar.us/soccer-x3/global/en/schedules/${dDate}/schedule.json`, { params: { api_key: config.FOOTBALL_API_KEY } })
    response = await axios.get(`https://api.sportradar.com/soccer-extended/production/v4/en/schedules/${dDate}/summaries.json`, { params: { api_key: config.FOOTBALL_API_KEY } })
  } catch (error) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_match_scheduled,
      data: {}
    }
  }
  const data = response.data ? response.data.summaries : []

  const oStoreData = { eCategory: 'FOOTBALL', eType: 'MATCHES', eProvider: 'SPORTSRADAR', sUrl: `https://api.sportradar.com/soccer-extended/production/v4/en/schedules/${dDate}/summaries.json` }

  const formatMatches = data.map(async (sportEvent) => {
    const { id, venue, competitors, start_time: scheduled, sport_event_context: sportContext } = sportEvent.sport_event
    const { season, competition } = sportContext
    let { name = '', gender } = competition
    if (!gender) {
      const arr = name.split(' ')
      gender = (arr[arr.length - 1] === 'Women') ? 'women' : 'men'
    }

    let oHomeTeam = {}
    let oAwayTeam = {}

    for (const competitor of competitors) {
      if (competitor.qualifier === 'home') {
        oHomeTeam = {
          sKey: competitor.id,
          sName: (gender === 'women') ? competitor.name.toString().concat(' -Women') : competitor.name,
          sShortName: (gender === 'women') ? competitor.abbreviation.toString().concat(' -W') : competitor.abbreviation,
          nScore: 0
        }
      } else if (competitor.qualifier === 'away') {
        oAwayTeam = {
          sKey: competitor.id,
          sName: (gender === 'women') ? competitor.name.toString().concat(' -Women') : competitor.name,
          sShortName: (gender === 'women') ? competitor.abbreviation.toString().concat(' -W') : competitor.abbreviation,
          nScore: 0
        }
      }
    }

    return {
      sKey: id,
      sName: oHomeTeam.sShortName.concat(' vs ', oAwayTeam.sShortName),
      // sName: (gender === 'women') ? competitors[0].abbreviation.concat('-W vs ', competitors[1].abbreviation.concat('-W')) : competitors[0].abbreviation.concat(' vs ', competitors[1].abbreviation),
      eFormat: 'FOOTBALL',
      sSeasonKey: season ? season.id : '',
      sVenue: venue ? venue.name.toString().concat(' ', venue.city_name, ' ', venue.country_name) : '',
      dStartDate: new Date(scheduled),
      dEntryCloseTime: new Date(scheduled),
      oHomeTeam: oHomeTeam,
      oAwayTeam: oAwayTeam,
      eCategory: 'FOOTBALL', // default
      eProvider: 'SPORTSRADAR', // default,
      sLeagueText: '1000',
      sSeasonName: season ? season.name : '',
      seasonData: {
        sName: season.name,
        sKey: season.id,
        eCategory: 'FOOTBALL',
        dStartDate: season.start_date,
        dEndDate: season.end_date,
        eProvider: 'SPORTSRADAR'
      }
    }
  })
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatMatches,
    apiData: { oStoreData, aApiMatches: data }
  }
}

async function getSportsradarBasketballData(dDate, userLanguage = 'English') {
  let response
  try {
    response = await axios.get(`https://api.sportradar.us/nba/production/v5/en/games/${dDate}/schedule.json`, { params: { api_key: config.NBA_API_KEY } })
  } catch (error) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_match_scheduled,
      data: {}
    }
  }

  const data = response.data ? response.data.games : []
  const oStoreData = { eCategory: 'BASKETBALL', eType: 'MATCHES', eProvider: 'SPORTSRADAR', sUrl: `https://api.sportradar.us/nba/production/v5/en/games/${dDate}/schedule.json` }
  if (data.length < 1) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_match_scheduled,
      data: {}
    }
  }
  const formatMatches = data.map(async (sportEvent) => {
    const { sr_id: id, season, venue, home, away, scheduled } = sportEvent

    let oHomeTeam = {}
    let oAwayTeam = {}

    oHomeTeam = {
      sKey: home.sr_id,
      sName: home.name,
      sShortName: home.alias,
      nScore: 0
    }
    oAwayTeam = {
      sKey: away.sr_id,
      sName: away.name,
      sShortName: away.alias,
      nScore: 0
    }

    return {
      sKey: id,
      sName: oHomeTeam.sShortName.concat(' vs ', oAwayTeam.sShortName),
      // sName: home.alias.concat(' vs ', away.alias),
      eFormat: 'BASKETBALL',
      // sSeasonKey: season ? season.id : '',
      sVenue: venue ? venue.name.toString().concat(' ', venue.city, ' ', venue.country) : '',
      dStartDate: new Date(scheduled),
      dEntryCloseTime: new Date(scheduled),
      oHomeTeam: oHomeTeam,
      oAwayTeam: oAwayTeam,
      eCategory: 'BASKETBALL',
      sSeasonName: season ? season.name : '',
      eProvider: 'SPORTSRADAR'
    }
  })
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatMatches,
    apiData: { oStoreData, aApiMatches: data }
  }
}

async function getEntitySportBaseballData(userLanguage = 'English') {
  let response
  try {
    response = await axios.get('https://rest.entitysport.com/baseball/matches', { params: { status: 1, token: config.ENTITYSPORT_BASEBALL_API_KEY, per_page: 200 } })
  } catch (error) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_match_scheduled,
      data: {}
    }
  }
  const data = response.data.response || {}
  const items = data.items || []
  const oStoreData = { eCategory: 'BASEBALL', eType: 'MATCHES', eProvider: 'ENTITYSPORT', sUrl: 'https://rest.entitysport.com/baseball/matches' }
  const formatMatches = items.map((item) => {
    const { mid, teams, competition, venue, datestart } = item
    const { home, away } = teams

    return {
      sKey: mid,
      eFormat: 'BASEBALL',
      sName: (home && away) ? home.abbr.concat(' vs ', away.abbr) : '',
      sSeasonKey: competition.cid,
      sVenue: venue,
      dStartDate: datestart ? new Date(datestart) : '',
      dEntryCloseTime: datestart ? new Date(datestart) : '',
      oHomeTeam: {
        sKey: home ? home.tid.toString() : '',
        sName: home ? home.tname : '',
        nScore: 0
      },
      oAwayTeam: {
        sKey: away ? away.tid.toString() : '',
        sName: away ? away.tname : '',
        nScore: 0
      },
      eCategory: 'BASEBALL',
      sSeasonName: competition ? competition.name : '',
      eProvider: 'ENTITYSPORT'
    }
  })
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatMatches,
    apiData: { oStoreData, aApiMatches: items }
  }
}

async function storeSeason(seasonData) {
  try {
    if (seasonData.length) {
      const eCategory = seasonData[0].eCategory

      const keys = seasonData.map(({ sKey }) => sKey)
      const season = await SeasonModel.find({ sKey: { $in: keys }, eCategory: eCategory }, { sKey: 1, _id: 0 }).read('primary').readConcern('majority').lean()
      const existKeys = season.map(({ sKey }) => sKey)

      const data = []
      seasonData.filter((season) => {
        const { sKey } = season
        if (!existKeys.includes(sKey.toString()) && !data.some(d => d.sKey.toString() === sKey.toString())) {
          data.push(season)
        }
      })
      await SeasonModel.insertMany(data, { ordered: false })
    }
  } catch (error) {
    handleCatchError(error)
  }
}

async function storeSeries(seasonData) {
  try {
    if (seasonData.length) {
      const eCategory = seasonData[0].eCategory
      const keys = seasonData.map(({ sKey }) => sKey)

      const season = await SeriesLeaderBoardModel.find({ sKey: { $in: keys }, eCategory: eCategory }, { sKey: 1, _id: 0 }).read('primary').readConcern('majority').lean()
      const existKeys = season.map(({ sKey }) => sKey)

      const data = []
      seasonData.filter((season) => {
        const { sKey } = season
        if (!existKeys.includes(sKey.toString()) && !data.some(d => d.sKey.toString() === sKey.toString())) {
          data.push(season)
        }
      })
      await SeriesLeaderBoardModel.insertMany(data, { ordered: false })
    }
  } catch (error) {
    handleCatchError(error)
  }
}
// eslint-disable-next-line no-unused-vars
async function removeDuplicateTeam() {
  try {
    const data = await TeamModel.aggregate([
      {
        $match: { sKey: { $ne: '' } }
      },
      {
        $group: {
          _id: '$sKey',
          aDuplicate: { $addToSet: '$_id' },
          nCount: { $sum: 1 }
        }
      },
      {
        $match: { nCount: { $gt: 1 } }
      }
    ]).allowDiskUse(bAllowDiskUse)

    if (data.length) {
      for (const teams of data) {
        const { aDuplicate } = teams
        for (const dup of aDuplicate) {
          const exist = await MatchModel.findOne({ $or: [{ 'oAwayTeam.iTeamId': ObjectId(dup) }, { 'oHomeTeam.iTeamId': ObjectId(dup) }] }).lean()
          if (!exist) {
            await TeamModel.deleteOne({ _id: ObjectId(dup) })
          }
        }
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

// eslint-disable-next-line no-unused-vars
async function removeDuplicateMatch() {
  try {
    const data = await MatchModel.aggregate([
      {
        $match: { sKey: { $nin: ['', null] } }
      },
      {
        $group: {
          _id: '$sKey',
          aDuplicate: { $addToSet: '$_id' },
          nCount: { $sum: 1 }
        }
      },
      {
        $match: { nCount: { $gt: 1 } }
      }
    ]).allowDiskUse(bAllowDiskUse)

    if (data.length) {
      for (const match of data) {
        const { aDuplicate } = match
        if (aDuplicate.length < 3) {
          await removeDuplicateAndForTwoRecord(MatchModel, aDuplicate, { eStatus: 'P' }, 'sKey')
        } else {
          await removeDuplicateAndForManyRecord(MatchModel, aDuplicate, {}, 'sKey')
        }
      }
    }
    const custom = await MatchModel.find({ $or: [{ sKey: '' }, { sKey: null }] }).lean()
    for (const match of custom) {
      const sKey = `${match.sName.toLocaleLowerCase().split(' ').join('-')}:${+new Date(match.dStartDate)}`
      await MatchModel.updateOne({ _id: ObjectId(match._id) }, { sKey })
    }
  } catch (error) {
    handleCatchError(error)
  }
}

async function removeDuplicateAndForTwoRecord(Model, aDuplicate, condition, fieldName) {
  try {
    const exist = await Model.findOne({ _id: { $in: aDuplicate }, ...condition }, { [fieldName]: 1 }).lean()
    if (!exist) {
      await Model.updateOne({ _id: ObjectId(aDuplicate[0]) }, { [fieldName]: `dup:${!exist[fieldName] ? '' : exist[fieldName]}` })
    } else if (exist && exist[fieldName]) {
      await Model.deleteOne({ _id: ObjectId(aDuplicate[0]) })
    } else {
      await Model.updateOne({ _id: ObjectId(aDuplicate[0]) }, { [fieldName]: `dup:${!exist[fieldName] ? '' : exist[fieldName]}` })
    }
  } catch (error) {
    handleCatchError(error)
  }
}

async function removeDuplicateAndForManyRecord(Model, aDuplicate, condition, fieldName) {
  try {
    for (const dup of aDuplicate) {
      if (aDuplicate.length < 3) {
        await removeDuplicateAndForTwoRecord(MatchModel, aDuplicate, { eStatus: 'P' }, fieldName)
      } else {
        const exist = await Model.findOne({ _id: ObjectId(dup), ...condition }, { [fieldName]: 1 }).lean()
        if (!exist) {
          await Model.deleteOne({ _id: ObjectId(dup) })
        } else if (exist && exist[fieldName]) {
          await Model.deleteOne({ _id: ObjectId(dup) })
        } else {
          await Model.updateOne({ _id: ObjectId(dup) }, { [fieldName]: `dup:${!exist[fieldName] ? '' : exist[fieldName]}` })
          aDuplicate.pop()
          await removeDuplicateAndForManyRecord(Model, aDuplicate, condition, fieldName)
        }
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

async function storeLog(oApiStoreData) {
  try {
    const { oStoreData, aApiMatches } = oApiStoreData
    const aKeys = aApiMatches.map(match => match.id || match.match_id || match.mid || match.sr_id)
    const aMatches = await MatchModel.find({ sKey: { $in: aKeys } }, { sKey: 1, _id: 1 }).read('primary').readConcern('majority').lean()

    const aInsertArray = aApiMatches.map(match => {
      const matchingMatch = aMatches.find(({ sKey }) => {
        if (match.id) return sKey === match.id.toString()
        if (match.match_id) return sKey === match.match_id.toString()
        if (match.mid) return sKey === match.mid.toString()
        if (match.sr_id) return sKey === match.sr_id.toString()
      })

      if (matchingMatch) {
        return { ...oStoreData, iMatchId: matchingMatch._id, oData: match }
      } else {
        return { ...oStoreData, oData: match }
      }
    })
    if (config.API_LOGS) {
      await ApiLogModel.insertMany(aInsertArray)
    }
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = new Match()
