const async = require('async')
const MatchPlayerModel = require('../matchPlayer/model')
const UserTeamModel = require('../userTeam/model')
const MatchModel = require('../match/model')
const MatchLeagueModel = require('../matchLeague/model')
const UserLeagueModel = require('../userLeague/model')
const MatchTeamsModel = require('../matchTeams/model')
const MyMatchesModel = require('../myMatches/model')
const SettingModel = require('../setting/model')
const CommonRuleModel = require('../commonRules/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, handleCatchError, getIp } = require('../../helper/utilities.services')
const { queuePush, redisClient2, bulkQueuePush, redisClient } = require('../../helper/redis')
const { createAdminLog } = require('../commonRules/grpc/clientServices')
const ObjectId = require('mongoose').Types.ObjectId
const config = require('../../config/config')
const PassbookModel = require('../passbook/model')
const { Op } = require('sequelize')
const { bAllowDiskUse } = config
const pendingMatchModel = require('../match/pendingMatch.model')
const moment = require('moment')
const { MatchDBConnect } = require('../../database/mongoose')
const UserModel = require('../user/model')
const { getMatchLeagueStatus } = require('../../helper/utilities.services')
const matchLeagueServices = require('../matchLeague/services')
const ApiLogModel = require('../apiLog/ApiLog.model')
const { findNotificationMessage } = require('../match/grpc/clientServices')

const { fetchPlaying11FromEntitySport, fetchPlaying11FromSoccerEntitySport, fetchPlaying11FromSportradar, fetchPlaying11FromSoccerSportradar, fetchMatchTossFromEntitySport } = require('../matchPlayer/common')
const { pushTopicNotification, unsubscribeUsers } = require('../../helper/firebase.services')
const {
  getCricketRefreshMatchData,
  getFootballRefreshMatchData,
  getBaseballRefreshMatchData,
  getBasketBallRefreshMatchData,
  getKabaddiRefreshMatchData
} = require('../match/common')
const {
  ProcessScorePoint,
  invokeAutoFillQueue,
  calculateScorePointCricket,
  calculateScorePointFootball,
  calculateScorePointKabaddi,
  calculateScorePointBasketball,
  fixRealUserDebugger

} = require('./leaderboardCommon')
const BotLogModel = require('../botLogs/model')
const BotCombinationLogModel = require('../botCombinationLog/model')
const CopyTeamLogModel = require('../userLeague/CopyTeamLogModel')
const BackupBotLogModel = require('../botLogs/backup.botlog.model')
const BackupBotCombinationLogModel = require('../botCombinationLog/backup.botcombinationlog.model')
const BackupCopyTeamLogModel = require('../userLeague/backupCopyTeamLogModel')
const UserBalanceServices = require('../userBalance/services')
const UsersModel = require('../user/model')

class Cron {
  async calculateMatchPlayerSetBy(req, res) {
    try {
      const data = await MatchModel.find({
        eStatus: 'U',
        bDisabled: false
      }).lean()
      if (data.length) {
        // await matchWiseSetBy(req, res, data)
        await matchWiseSetByV2(data)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].matchPlayer) })
    } catch (error) {
      catchError('Cron.calculateMatchPlayerSetBy', error, req, res)
    }
  }

  /**
   * This service will want system to check expired bonus 24 hours.
   * @param {*} req request object
   * @param {*} res response object
   * @returns this will process all user's bonus that is if it's in expired state from current date then will process expiration bonus of that users.
   */
  async bonusExpire(req, res) {
    try {
      const dDate = new Date()
      const aExpiredBonus = await PassbookModel.findAll({
        where: {
          eTransactionType: { [Op.in]: ['Refer-Bonus', 'Bonus', 'Deposit', 'Contest-Cashback'] },
          nBonus: { [Op.gt]: 0 },
          // [Op.or]: [{ eTransactionType: 'Refer-Bonus' }, { eTransactionType: 'Bonus' }, { [Op.and]: [{ eTransactionType: 'Deposit' }, { nBonus: { [Op.gt]: 0 } }] }, { [Op.and]: [{ eTransactionType: 'Contest-Cashback' }, { nBonus: { [Op.gt]: 0 } }] }],
          eType: 'Cr',
          bIsBonusExpired: false,
          dBonusExpiryDate: {
            [Op.lte]: dDate
          }
        },
        group: 'iUserId',
        order: [['dBonusExpiryDate', 'DESC']] // 'ASC' : 'DESC'
      })
      if (!aExpiredBonus.length) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cBackgroundProcess.replace('##', messages[req.userLanguage].cExpireBonus) })

      aExpiredBonus.forEach((d) => queuePush('BonusExpire', d))

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cBackgroundProcess.replace('##', messages[req.userLanguage].cExpireBonus) })
    } catch (error) {
      catchError('Cron.bonusExpire', error, req, res)
    }
  }

  async provideBirthdayBonus(req, res) {
    try {
      const isEnabled = await CommonRuleModel.findOne({ eRule: 'BB', eStatus: 'Y' }).lean()
      if (!isEnabled) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].csetting) })
      const date = new Date()
      const year = date.getFullYear()
      const users = await UserModel.find({
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: '$dDob' }, { $dayOfMonth: new Date() }] },
            { $eq: [{ $month: '$dDob' }, { $month: new Date() }] }
          ]
        },
        sDobBonusIn: { $ne: year }
      }
      , { _id: 1, sUsername: 1, eType: 1 }).lean()
      if (users.length) {
        users.forEach(async (user) => {
          try {
            await UserBalanceServices.birthdayBonus({ iUserId: user._id, sUsername: user.sUsername, eType: user.eType, birthdayBonus: isEnabled.nAmount, year })
          } catch (error) {
            return catchError('Cron.birthdayBonus', error, req, res)
          }
        })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].birthday_bonus_process })
    } catch (error) {
      catchError('Cron.birthdayBonus', error, req, res)
    }
  }

  /**
   * This service is cron therefore this will run for every 2 minutes or according to the time that we set while cron service added on server.
   * @param {*} req request object
   * @param {*} res response object
   * @returns this service will be update all upcoming matches to live state and and processes on all it's match contest either cancelled or running state.
   */
  async matchLive(req, res) {
    try {
      const matches = await MatchModel.find({ eStatus: 'U', dStartDate: { $lte: new Date() } }, { _id: 1 }).lean() // find upcoming matches

      await MatchModel.updateMany({ eStatus: 'U', dStartDate: { $lte: new Date() } }, { $set: { eStatus: 'L' } }) // update to live

      matches.forEach((m) => {
        const imatchId = m._id.toString()
        this.loadMatchToRedis(imatchId)
      })

      const matchIds = matches.map((match) => ObjectId(match._id))

      await Promise.all([
        MyMatchesModel.updateMany({ iMatchId: { $in: matchIds } }, { $set: { eMatchStatus: 'L' } }),
        MatchLeagueModel.updateMany({ iMatchId: { $in: matchIds } }, { $set: { eMatchStatus: 'L' } })
      ])

      const matchLeagues = await MatchLeagueModel.find({ iMatchId: { $in: matchIds }, bCancelled: false }, { _id: 1, iMatchId: 1, bPoolPrize: 1, bPrivateLeague: 1, nPrice: 1, nJoined: 1, nMax: 1, bConfirmLeague: 1, nMin: 1, eCategory: 1, iUserId: 1, bCancelled: 1, bCashbackEnabled: 1, nMinCashbackTeam: 1, nCashbackAmount: 1, eCashbackType: 1, bIsProcessed: 1, sName: 1, nTotalPayout: 1, sFairPlay: 1, bUnlimitedJoin: 1 }, { readPreference: 'primary' }).lean()

      matchLeagues.map((matchLeague) => queuePush('MatchLive', matchLeague))

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].matchStatus) })
    } catch (error) {
      catchError('Cron.matchLive', error, req, res)
    }
  }

  /**
   * This service is cron therefore this will run for every 2 minutes or according to the time that we set while cron service added on server.
   * This service will calculate score points of live match for users total scored points to show in live leader board section.
   * @param {*} req request object
   * @param {*} res response object
   * @returns This will fetch live score point from third party API according Match API Provider and update the leader board accordingly.
   */
  async liveLeaderboard(req, res) {
    try {
      const match = await MatchModel.find({ eStatus: 'L', bDisabled: false }).lean()

      match.map((element) => {
        if (element.eCategory === 'CRICKET') {
          calculateScorePointCricket(element).then(res => ProcessScorePoint(res)).catch(err => handleCatchError(err))
        } else if (element.eCategory === 'FOOTBALL') {
          calculateScorePointFootball(element).then(res => ProcessScorePoint(res)).catch(err => handleCatchError(err))
        } else if (element.eCategory === 'BASKETBALL') {
          calculateScorePointBasketball(element).then(res => ProcessScorePoint(res)).catch(err => handleCatchError(err))
        } else if (element.eCategory === 'KABADDI') {
          calculateScorePointKabaddi(element).then(res => ProcessScorePoint(res)).catch(err => handleCatchError(err))
        }
      })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leaderboard) })
    } catch (error) {
      return catchError('Cron.liveLeaderboard', error, req, res)
    }
  }

  /**
   * This service will be called manually while match going live and in case our server will restart in between till completed of the match.
   * @param {*} req request object
   * @param {*} res response object
   * @returns this will add live match data to redis for live leader board user point calculation process.
   */
  async loadLeaderboard(req, res) {
    try {
      const { matchId } = req.query
      const { _id: iAdminId } = req.admin
      await this.loadMatchToRedisV2(matchId)
      const match = await MatchModel.findById({ _id: matchId }).lean()
      const logData = { oOldFields: { iMatchId: matchId, sMatchName: match.sName }, iAdminId, eKey: 'LB', sIP: getIp(req) }
      await createAdminLog(logData)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leaderboard), data: {} })
    } catch (error) {
      return catchError('Cron.loadLeaderboard', error, req, res)
    }
  }

  /**
   * This service will be called manually while match going live and in case our server will restart in between till completed of the match.
   * @param {*} req request object
   * @param {*} res response object
   * @returns this will update match and matchplayers details when linups out .
   */
  async fetchEntitySportLineUpsPlayer(req, res) {
    try {
      const isEnabled = await SettingModel.findOne({ sKey: 'FETCH_LINUP', eStatus: 'Y' }).lean()
      if (!isEnabled) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].csetting) })

      let playerKey = []
      const aUpdateMatchPlayer = []
      const aUpdateMatches = []
      const aBulkPushNotify = []

      const matches = await MatchModel.find({
        eProvider: 'ENTITYSPORT',
        eStatus: 'U',
        $or: [
          {
            bLineupsOut: false
          },
          {
            iTossWinnerId: null
          }
        ],
        $and: [
          {
            dStartDate: { $lte: new Date(new Date().getTime() + 1000 * 60 * 60) }
          },
          {
            dStartDate: { $gte: new Date(new Date().getTime()) }
          }
        ]
      }).lean()
      if (!matches.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      const aPromiseMatches = []
      // Push Third-Party Function to an array
      const notification = await findNotificationMessage('LINEUPS')
      matches.map(match => {
        switch (match.eCategory) {
          case 'CRICKET':
            if (!match.bLineupsOut) aPromiseMatches.push(fetchPlaying11FromEntitySport(match, req.userLanguage))
            if (!match.iTossWinnerId) aPromiseMatches.push(fetchMatchTossFromEntitySport(match, req.userLanguage))
            break
          case 'FOOTBALL':
            aPromiseMatches.push(fetchPlaying11FromSoccerEntitySport(match, req.userLanguage))
            break
          default:
            break
        }
      })
      // Get data from third party function
      const data = await Promise.all(aPromiseMatches)
      for await (const result of data) {
        if (result.isSuccess === false) continue
        let bFlag = false

        if (result.eTossWinnerAction && result.tossWinnerTeam) {
          aUpdateMatches.push({
            updateOne: {
              filter: { _id: ObjectId(result.matchId) },
              update: { $set: { iTossWinnerId: result.tossWinnerTeam.iTeamId, eTossWinnerAction: result.eTossWinnerAction } }
            }
          })
          continue
        }

        playerKey = result.data

        switch (result.eCategory) {
          case 'CRICKET':
            bFlag = playerKey.length >= 20
            break

          case 'FOOTBALL':
            bFlag = playerKey.length >= 20
            break

          default:
            break
        }

        // For Update MatchPlayer Show Status
        aUpdateMatchPlayer.push({
          updateMany: {
            filter: { sKey: { $in: playerKey }, iMatchId: result.match._id },
            update: { $set: { bShow: true } }
          }
        })
        if (bFlag) {
          aUpdateMatches.push({
            updateOne: {
              filter: { _id: ObjectId(result.match._id) },
              update: { $set: { bLineupsOut: true } }
            }
          })
          if (notification && notification.bEnableNotifications) {
            const { sHeading, sDescription, ePlatform } = notification

            const msg = sDescription.replace('##', result.sName)
            aBulkPushNotify.push(pushTopicNotification(ePlatform, sHeading, msg))
          }
        }
      }

      await Promise.all([
        MatchPlayerModel.bulkWrite(aUpdateMatchPlayer),
        MatchModel.bulkWrite(aUpdateMatches, { ordered: false })
      ])

      if (aBulkPushNotify.length) await Promise.all(aBulkPushNotify)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cplaying11) })
    } catch (error) {
      catchError('MatchPlayer.fetchPlaying11Cricket', error, req, res)
    }
  }

  async fetchSportradarLineUpsPlayer(req, res) {
    try {
      const isEnabled = await SettingModel.findOne({ sKey: 'FETCH_LINUP', eStatus: 'Y' }).lean()
      if (!isEnabled) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].csetting) })
      let playerKey = []
      const aUpdateMatchPlayer = []
      const aUpdateMatches = []
      const aBulkPushNotify = []
      const matches = await MatchModel.find({
        eProvider: 'SPORTSRADAR',
        eStatus: 'U',
        bLineupsOut: false,
        $and: [
          {
            dStartDate: { $lte: new Date(new Date().getTime() + 1000 * 60 * 60) }
          },
          {
            dStartDate: { $gte: new Date(new Date().getTime()) }
          }
        ]
      }).lean()
      if (!matches.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })
      const aPromiseMatches = []
      // Push Third-Party Function to an array
      const notification = await findNotificationMessage('LINEUPS')
      matches.map(match => {
        switch (match.eCategory) {
          case 'CRICKET':
            aPromiseMatches.push(fetchPlaying11FromSportradar(match, req.userLanguage))
            break
          case 'FOOTBALL':
            aPromiseMatches.push(fetchPlaying11FromSoccerSportradar(match, req.userLanguage))
            break
          default:
            break
        }
      })
      // Get data from third party function
      const data = await Promise.all(aPromiseMatches)
      console.log('the data is', data)
      for await (const result of data) {
        if (result.isSuccess === false) continue
        playerKey = result.data
        let bFlag = false
        switch (result.match.eCategory) {
          case 'CRICKET':
            bFlag = playerKey.length >= 20
            break

          case 'FOOTBALL':
            bFlag = playerKey.length >= 20
            break

          default:
            break
        }

        // For Update MatchPlayer Show Status
        aUpdateMatchPlayer.push({
          updateMany: {
            filter: { sKey: { $in: playerKey }, iMatchId: result.match._id },
            update: { $set: { bShow: true } }
          }
        })
        if (bFlag) {
          aUpdateMatches.push({
            updateOne: {
              filter: { _id: ObjectId(result.match._id) },
              update: { $set: { bLineupsOut: true } }
            }
          })
          if (notification && notification.bEnableNotifications) {
            const { sHeading, sDescription, ePlatform } = notification

            const msg = sDescription.replace('##', result.sName)
            aBulkPushNotify.push(pushTopicNotification(ePlatform, sHeading, msg))
          }
        }
      }
      await Promise.all([
        MatchPlayerModel.bulkWrite(aUpdateMatchPlayer),
        MatchModel.bulkWrite(aUpdateMatches, { ordered: false })
      ])

      if (aBulkPushNotify.length) await Promise.all(aBulkPushNotify)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cplaying11) })
    } catch (error) {
      catchError('MatchPlayer.fetchPlaying11Cricket', error, req, res)
    }
  }

  /**
   * It'll add the match details into redis for 24 hours and also update the redis leader board according to user rank and point wise.
   * @param {iMatchId}  matchId Match Id
   * @returns It'll add the match details into redis and also update the redis leader board according to user rank and point wise.
   */
  async loadMatchToRedisV2(matchId) {
    try {
      const matchLeagues = await MatchLeagueModel.find({ iMatchId: matchId, bCancelled: false }, {}, { readPreference: 'primary' }).lean()

      async.eachSeries(matchLeagues, async (s, cb) => {
        try {
          const matchLeagueId = s._id
          const aUserLeagues = []
          await UserLeagueModel.find({ iMatchLeagueId: matchLeagueId }, { iUserTeamId: 1, iUserId: 1, nTotalPoints: 1 }, { readPreference: 'primary' }).lean().cursor({ batchSize: 100 })
            .on('data', async (userLeague) => {
              aUserLeagues.push(userLeague)

              if (aUserLeagues.length > 25000) {
                const addToSortedSet = []
                const aData = aUserLeagues.splice(0, 25000)
                aData.forEach(singleLeague => {
                  addToSortedSet.push(singleLeague.nTotalPoints || 0)
                  addToSortedSet.push(singleLeague.iUserTeamId)
                })
                await redisClient2.zadd([`ml:${matchId}:${matchLeagueId}`, ...addToSortedSet])
              }
            })
            .on('end', async() => {
              const addToSortedSet = []
              aUserLeagues.forEach(singleLeague => {
                addToSortedSet.push(singleLeague.nTotalPoints || 0)
                addToSortedSet.push(singleLeague.iUserTeamId)
              })

              redisClient2
                .multi()
                .hset(`hml:${matchId}:${matchLeagueId}`, 'exists', 1, 'putTime', Date.now(), 'expireTime', Date.now() + 84600, 'matchId', matchId)
                .zadd([`ml:${matchId}:${matchLeagueId}`, ...addToSortedSet])
                .expire(`hml:${matchId}:${matchLeagueId}`, 86400)
                .expire(`ml:${matchId}:${matchLeagueId}`, 86400)
                .exec(() => { Promise.resolve() })
            })
        } catch (error) {
          handleCatchError(error)
          return { isSuccess: false }
        }
      }, (err, data) => {
        if (err) {
          handleCatchError(err)
          return { isSuccess: false }
        }
      })
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  async loadMatchToRedis(matchId) {
    try {
      const matchLeagues = await MatchLeagueModel.find({ iMatchId: matchId, bCancelled: false }, {}, { readPreference: 'primary' }).lean()

      async.eachSeries(matchLeagues, async (s, cb) => {
        try {
          const matchLeagueId = s._id
          const leagues = await UserLeagueModel.find({ iMatchLeagueId: matchLeagueId }, { iUserTeamId: 1, iUserId: 1, nTotalPoints: 1 }, { readPreference: 'primary' }).lean()
          const addToSortedSet = []
          leagues.forEach(singleLeague => {
            addToSortedSet.push(singleLeague.nTotalPoints || 0)
            addToSortedSet.push(singleLeague.iUserTeamId)
          })

          redisClient2
            .multi()
            .hset(`hml:{${matchId}}:${matchLeagueId}`, 'exists', 1, 'putTime', Date.now(), 'expireTime', Date.now() + 84600, 'matchId', matchId)
            .zadd([`ml:{${matchId}}:${matchLeagueId}`, ...addToSortedSet])
            .expire(`hml:{${matchId}}:${matchLeagueId}`, 86400)
            .expire(`ml:{${matchId}}:${matchLeagueId}`, 86400)
            .exec(() => { Promise.resolve() })
        } catch (error) {
          handleCatchError(error)
          return { isSuccess: false }
        }
      }, (err, data) => {
        if (err) {
          handleCatchError(err)
        }
      })
    } catch (error) {
      handleCatchError(error)
      return { isSuccess: false }
    }
  }

  async calculateSeasonPoint(req, res) {
    try {
      const matches = await MatchModel.find({ eStatus: 'U', bDisabled: false, dStartDate: { $gte: new Date() } }).select({ oHomeTeam: 1, oAwayTeam: 1, sSeasonKey: 1, eCategory: 1, eFormat: 1 }).lean()

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
          // MatchPlayerModel.findByIdAndUpdate(matchPlayer._id, { nSeasonPoints: matchPlayer.nSeasonPoints }, { runValidators: true }).lean()
        }
        MatchPlayerModel.bulkWrite(aBulkMatchPlayer, { writeConcern: { w: 'majority' }, ordered: false })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].matchStatus) })
    } catch (error) {
      catchError('Cron.calculateSeasonPoint', error, req, res)
    }
  }

  // to remove all pending matches and insert into pending match collection
  async removePendingMatches(req, res) {
    const monthOlderDate = moment().utc().subtract(30, 'days').startOf('day')
    try {
      // fetch all pending matches
      const pendingMatchs = await MatchModel.distinct('_id', {
        eStatus: 'P',
        dCreatedAt: {
          $lte: monthOlderDate
        }
      })
      // if any pending match found
      if (pendingMatchs.length) {
        // find all teams
        const teams = await MatchTeamsModel.distinct('iMatchId', {
          iMatchId: {
            $in: pendingMatchs
          }
        })
        const teamsWithToString = teams.map(function (x) {
          return x.toString()
        })
        const matchWithOutTeam = pendingMatchs.filter(function (x) {
          return !teamsWithToString.includes(x.toString())
        })
        if (!matchWithOutTeam.length) {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].pending_match_remove })
        }
        // fetch all matches for which team is not formed and insert in the new collection
        const matchsToRemove = await MatchModel.find({
          _id: {
            $in: matchWithOutTeam
          }
        })
        const transactionOptions = {
          readPreference: 'primary',
          readConcern: { level: 'majority' },
          writeConcern: { w: 'majority' }
        }
        const session = await MatchDBConnect.startSession()
        session.startTransaction(transactionOptions)
        try {
          await pendingMatchModel.insertMany(matchsToRemove, { session })
          await MatchModel.deleteMany({ _id: { $in: matchWithOutTeam } }).session(session)
          await session.commitTransaction()
        } catch (error) {
          await session.abortTransaction()
          return catchError('Cron.removePendingMatches', error, req, res)
        } finally {
          session.endSession()
        }
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].pending_match_remove })
      } else {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].no_pending_match_remove })
      }
    } catch (error) {
      catchError('Cron.removePendingMatches', error, req, res)
    }
  }

  /**
   * It'll process the match league which are overflow for every 10 minutes and also update the match league accordingly and process play return for last joined user.
   * @param {*} req request object
   * @param {*} res response object
   * @returns It'll update overflow match contest accordingly and process play return for last joined user.
   */
  async processPlayReturn(req, res) {
    try {
      const matches = await MatchModel.find({ eStatus: 'U', dStartDate: { $gte: new Date() } }, { _id: 1 }).lean() // find upcoming matches
      const matchIds = matches.map((match) => ObjectId(match._id))

      const matchLeagues = await MatchLeagueModel.aggregate([
        {
          $match: {
            iMatchId: { $in: matchIds }, bCancelled: false
          }
        }, {
          $project: {
            _id: 1,
            bIsOverflow: { $gt: ['$nJoined', '$nMax'] },
            iMatchId: 1,
            bPoolPrize: 1,
            bPrivateLeague: 1,
            nPrice: 1,
            nJoined: 1,
            nMax: 1,
            bConfirmLeague: 1,
            nMin: 1,
            eCategory: 1,
            iUserId: 1,
            bCancelled: 1,
            bCashbackEnabled: 1,
            nMinCashbackTeam: 1,
            nCashbackAmount: 1,
            eCashbackType: 1,
            bIsProcessed: 1,
            sName: 1,
            nTotalPayout: 1,
            sFairPlay: 1,
            eMatchStatus: 1,
            bUnlimitedJoin: 1
          }
        }
      ]).allowDiskUse(bAllowDiskUse)

      for (const league of matchLeagues) {
        if (league.bIsOverflow && !league.bUnlimitedJoin) {
          queuePush('ProcessMatchLeague', league)
        }
        queuePush('checkRedisJoinedCount', league)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].queued_success.replace('##', messages[req.userLanguage].cmatchLeague) })
    } catch (error) {
      catchError('Cron.processPlayReturn', error, req, res)
    }
  }

  /**
   * It'll process the match league which are overflow for every 10 minutes and also update the match league accordingly and process play return for last joined user.
   * @param {*} req request object
   * @param {*} res response object
   * @returns It'll update overflow match contest accordingly and process play return for last joined user.
   */
  async fixStatistics(req, res) {
    try {
      const query = req.query && req.query.iUserId ? { _id: ObjectId(req.query.iUserId), eType: 'U' } : { eType: 'U' }

      // const query = req.query && req.query.iUserId ? { where: { iUserId: req.query.iUserId } } : {}
      // const users = await UserBalanceModel.findAll({
      //   attributes: ['iUserId'],
      //   ...query
      // })

      // for (const user of users) {
      //   const data = await fixUserStatistics(user.iUserId.toString())
      //   // const { nActualDepositBalance, nActualWinningBalance, nActualBonus } = data
      //   await StatisticsModel.updateOne({ iUserId: ObjectId(user.iUserId) }, data)
      // }
      await fixRealUserDebugger(query)

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].queued_success.replace('##', messages[req.userLanguage].cmatchLeague) })
    } catch (error) {
      catchError('Cron.fixStatistics', error, req, res)
    }
  }

  async checkLiveLeagues(req, res) {
    try {
      const aMatchLeague = await MatchLeagueModel.find({ eMatchStatus: 'L', bCancelled: false }, null, { readPreference: 'primary' }).lean()

      for (const matchLeague of aMatchLeague) {
        const uniqueUserJoin = await UserLeagueModel.aggregate([
          {
            $match: { iMatchLeagueId: ObjectId(matchLeague._id) }
          },
          {
            $group: {
              _id: '$iUserId'
            }
          },
          {
            $group: {
              _id: null,
              nJoinedCount: { $sum: 1 }
            }
          }
        ]).allowDiskUse(bAllowDiskUse).read('primary').exec()
        const uniqueUserJoinCount = (uniqueUserJoin.length) ? uniqueUserJoin[0].nJoinedCount : 0

        const leagueStatus = await getMatchLeagueStatus(matchLeague, uniqueUserJoinCount)

        if (leagueStatus === 'PLAY_RETURN') {
          await matchLeagueServices.processPlayReturn(matchLeague, 'MATCHLEAGUE', null, '', 'MATCHLEAGUE LIVE CRON', matchLeague.nJoined, uniqueUserJoinCount)
        }
        queuePush('checkRedisJoinedCount', matchLeague)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].check_live_leagues })
    } catch (error) {
      handleCatchError(error)
    }
  }

  async updateMatchData(req, res) {
    try {
      const matches = await MatchModel.find({ eStatus: 'U', dStartDate: { $gte: new Date() } }).lean()
      if (!matches.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].match) })

      const aBulkMatch = []
      for (const match of matches) {
        const { eCategory, sKey, eProvider, _id, bIsNameUpdated, oHomeTeam, oAwayTeam } = match

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

        if (refreshData && refreshData.isSuccess) {
          if (bIsNameUpdated) delete refreshData.data.sName
          if (oHomeTeam && oHomeTeam?.bIsNameUpdated) {
            refreshData.data.oHomeTeam.sShortName = oHomeTeam.sShortName
            refreshData.data.oHomeTeam.bIsNameUpdated = oHomeTeam.bIsNameUpdated
          }
          if (oAwayTeam && oAwayTeam?.bIsNameUpdated) {
            refreshData.data.oAwayTeam.sShortName = oAwayTeam.sShortName
            refreshData.data.oAwayTeam.bIsNameUpdated = oAwayTeam.bIsNameUpdated
          }
          aBulkMatch.push({
            updateOne: {
              filter: { _id },
              update: { $set: refreshData.data }
            }
          })
        }
      }
      await MatchModel.bulkWrite(aBulkMatch, { ordered: false })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].refresh_success.replace('##', messages[req.userLanguage].match) })
    } catch (error) {
      return catchError('Cron.updateMatchData', error, req, res)
    }
  }

  /**
   * It'll remove api logs for old win distributed matches
   * @param  {*} req
   * @param  {*} res
   */
  async removeOldApiLogs(req, res) {
    try {
      const dRemoveDate = new Date()
      dRemoveDate.setDate(dRemoveDate.getDate() - 30)

      const aOldMatches = await MatchModel.find({ dWinDistAt: { $lt: dRemoveDate } }, { _id: 1 }).lean()
      const aMatchIds = aOldMatches.map(({ _id }) => _id)
      ApiLogModel.deleteMany({ iMatchId: { $in: aMatchIds } })
        .then((data) => console.log('removeOldApiLogs cron ran successfully:', { data }))

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].old_api_logs_remove })
    } catch (error) {
      return catchError('Cron.removeOldApiLogs', error, req, res)
    }
  }

  async prepareAutoFillMatchLeagues(req, res) {
    try {
      const dAfter30min = new Date()
      dAfter30min.setMinutes(dAfter30min.getMinutes() + 30)

      let aUpcomingMatches = await MatchModel.find({ dStartDate: { $gte: new Date(), $lt: new Date(dAfter30min) }, eStatus: 'U' }, { _id: 1 }).lean()
      if (aUpcomingMatches.length) aUpcomingMatches = aUpcomingMatches.map(({ _id }) => _id)

      const matchLeagues = await MatchLeagueModel.find({ iMatchId: { $in: aUpcomingMatches }, eMatchStatus: 'U', bCancelled: false, nAutoFillSpots: { $gt: 0 } }, { _id: 1, nMax: 1, nJoined: 1, iMatchId: 1, bConfirmLeague: 1, nMin: 1, bPoolPrize: 1, nAutoFillSpots: 1 }).lean()
      if (matchLeagues.length) {
        for (const league of matchLeagues) {
          const { _id, nMax, nJoined, iMatchId, bConfirmLeague, nMin, bPoolPrize, nAutoFillSpots = 0 } = league
          const spots = (bConfirmLeague || bPoolPrize) ? (Number(nMin) - Number(nJoined)) : (Number(nMax) - Number(nJoined))
          if (spots > 0 && nAutoFillSpots >= spots) {
            const margin = (spots * 5) / 100
            await queuePush('PREPARE_AUTOFILL_MATCHLEAGUE', { _id, nTeams: Math.ceil(spots + margin), iMatchId })
          }
        }
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK })
    } catch (error) {
      return catchError('Cron.prepareAutoFillMatchLeagues', error, req, res)
    }
  }

  async autoFillMatchleagues(req, res) {
    try {
      const dAfter2min = new Date()
      dAfter2min.setMinutes(dAfter2min.getMinutes() + 2)

      let aUpcomingMatches = await MatchModel.find({ dStartDate: { $gte: new Date(), $lt: new Date(dAfter2min) }, eStatus: 'U' }, { _id: 1 }).lean()
      if (aUpcomingMatches.length) aUpcomingMatches = aUpcomingMatches.map(({ _id }) => _id)

      const matchLeagues = await MatchLeagueModel.find({ iMatchId: { $in: aUpcomingMatches }, eMatchStatus: 'U', bCancelled: false, nAutoFillSpots: { $gt: 0 } }, { _id: 1 }).lean()
      if (matchLeagues.length) {
        const matchLeagueQueues = matchLeagues.map(({ _id }) => `AUTOFILL_${_id.toString()}`)
        await invokeAutoFillQueue(matchLeagueQueues)
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK })
    } catch (error) {
      return catchError('Cron.autoFillMatchleagues', error, req, res)
    }
  }

  // ==>> no use as we are not storing jwt tokens now
  async removePushNotificationOnJWTEx(req, res) {
    try {
      const sExpireTimeJWT = config.JWT_VALIDITY
      let dUnitOfExpTime = sExpireTimeJWT.slice(-1)
      const nNumberOfExpTime = +(sExpireTimeJWT.slice(0, -1))
      switch (dUnitOfExpTime) {
        case 's':
          dUnitOfExpTime = 'seconds'
          break
        case 'm':
          dUnitOfExpTime = 'minutes'
          break
        case 'h':
          dUnitOfExpTime = 'hours'
          break
        case 'd':
          dUnitOfExpTime = 'days'
          break
        default:
          dUnitOfExpTime = 'days'
      }
      const dLastValidTime = moment().utc().subtract(nNumberOfExpTime, dUnitOfExpTime)
      const dStartingTime = moment(dLastValidTime).subtract(1, 'hours')
      const aUniqueTokenValues = new Set()
      await UserModel.aggregate([
        {
          $match: {
            aJwtTokens: { $ne: [] }
          }
        },
        {
          $project: {
            aTokens: {
              $filter: {
                input: '$aJwtTokens',
                as: 'token',
                cond: {
                  $and: [
                    { $lt: ['$$token.dTimeStamp', new Date(dLastValidTime)] },
                    { $gt: ['$$token.dTimeStamp', new Date(dStartingTime)] }
                  ]
                }
              }
            }
          }
        },
        {
          $match: {
            aTokens: { $nin: [null, []] },
            'aTokens.sPushToken': { $exists: true }
          }
        },
        {
          $unwind: '$aTokens'
        }
      ]).allowDiskUse(bAllowDiskUse).cursor()
        .on('data', async (obj) => {
          try {
            if (obj && obj.aTokens && obj.aTokens.sPushToken) aUniqueTokenValues.add(obj.aTokens.sPushToken)
            if (aUniqueTokenValues.size >= 1000) {
              const aPushTokens = [...aUniqueTokenValues]
              aUniqueTokenValues.clear()
              await unsubscribeUsers(aPushTokens)
            }
          } catch (error) {
            handleCatchError(error)
          }
        })
        .on('end', async () => {
          try {
            if (aUniqueTokenValues.size > 0) await unsubscribeUsers([...aUniqueTokenValues])
          } catch (error) {
            handleCatchError(error)
          }
        })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK })
    } catch (error) {
      return catchError('Cron.removePushNotificationOnJWTEx', error, req, res)
    }
  }

  // finding old bot logs, bot combination logs and copy team logs removing from main db and inserting in backup db
  async backupOldBotLogs(req, res) {
    try {
      const dRemoveDate = new Date()
      dRemoveDate.setDate(dRemoveDate.getDate() - 60)
      // For botlogs backup
      const aBackupBotLogs = []
      BotLogModel.find({ dUpdatedAt: { $lt: dRemoveDate } }).lean().cursor()
        .on('data', async (oBotLog) => {
          try {
            aBackupBotLogs.push(oBotLog)
            if (aBackupBotLogs.length >= 5000) {
              await BackupBotLogModel.insertMany(aBackupBotLogs.splice(0, 5000))
            }
          } catch (error) {
            handleCatchError(error)
          }
        })
        .on('end', async () => {
          try {
            if (aBackupBotLogs.length) {
              await BackupBotLogModel.insertMany(aBackupBotLogs)
            }
            await BotLogModel.deleteMany({ dUpdatedAt: { $lt: dRemoveDate } })
          } catch (error) {
            handleCatchError(error)
          }
        })

      // for botcombinationlogs backup
      const aBackupBotCombinationLogs = []
      BotCombinationLogModel.find({ dUpdatedAt: { $lt: dRemoveDate } }).lean().cursor()
        .on('data', async (oBotCombinationLog) => {
          try {
            aBackupBotCombinationLogs.push(oBotCombinationLog)
            if (aBackupBotCombinationLogs.length >= 5000) {
              await BackupBotCombinationLogModel.insertMany(aBackupBotCombinationLogs.splice(0, 5000))
            }
          } catch (error) {
            handleCatchError(error)
          }
        })
        .on('end', async () => {
          try {
            if (aBackupBotCombinationLogs.length) {
              await BackupBotCombinationLogModel.insertMany(aBackupBotCombinationLogs)
            }
            await BotCombinationLogModel.deleteMany({ dUpdatedAt: { $lt: dRemoveDate } })
          } catch (error) {
            handleCatchError(error)
          }
        })

      // for botcombinationlogs backup
      const aBackupCopyBotLogs = []
      CopyTeamLogModel.find({ dUpdatedAt: { $lt: dRemoveDate } }).lean().cursor()
        .on('data', async (oCopyTeamLog) => {
          try {
            aBackupCopyBotLogs.push(oCopyTeamLog)
            if (aBackupCopyBotLogs.length >= 5000) {
              await BackupCopyTeamLogModel.insertMany(aBackupCopyBotLogs.splice(0, 5000))
            }
          } catch (error) {
            handleCatchError(error)
          }
        })
        .on('end', async () => {
          try {
            if (aBackupCopyBotLogs.length) {
              await BackupCopyTeamLogModel.insertMany(aBackupCopyBotLogs)
            }
            await CopyTeamLogModel.deleteMany({ dUpdatedAt: { $lt: dRemoveDate } })
          } catch (error) {
            handleCatchError(error)
          }
        })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].old_bot_logs_backup })
    } catch (error) {
      handleCatchError(error)
    }
  }

  // to backup 1 month old matchteams into another model
  async backupMatchTeams(req, res) {
    try {
      const dRemoveDate = new Date()
      dRemoveDate.setDate(dRemoveDate.getDate() - 30)
      const aMatches = await MatchModel.find({ eStatus: 'CMP', dUpdatedAt: { $lt: dRemoveDate } }, { _id: 1 }).lean()
      const aMatchId = aMatches.map(match => match._id)
      // For matchteams and userteams backup
      await bulkQueuePush('backup:Teams', aMatchId, 5000)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].matchTeam_userteam_backup })
    } catch (error) {
      handleCatchError(error)
    }
  }

  async fillSetOfSystemUsers(req, res) {
    try {
      const aSystemUsers = []

      // // check size of redis-set
      // const isData = await redisClient.scard('SystemUsers')
      // if (!isData) {

      UsersModel.find({ eType: 'U' }, { _id: 1, sName: 1, sUsername: 1, eType: 1 }, { readPreference: 'secondaryPreferred' }).lean().cursor()
        .on('data', async (user) => {
          aSystemUsers.push(JSON.stringify(user))
          if (aSystemUsers.length >= 10000) await redisClient.sadd('SystemUsers', ...aSystemUsers.splice(0, 10000))
        }).on('end', async () => {
          if (aSystemUsers.length) await redisClient.sadd('SystemUsers', ...aSystemUsers)
        })

      if (aSystemUsers.length) await redisClient.sadd('SystemUsers', ...aSystemUsers)
      // Set expiry for 6 Hours
      await redisClient.expire('SystemUsers', 21600)
      // }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK })
    } catch (error) {
      handleCatchError(error)
    }
  }
}

// to calculate the overall, captain and vice captain percentage of the player's selection
async function matchWiseSetByV2(data) {
  try {
    for (const item of data) {
      const { _id } = item
      const teams = await UserTeamModel.countDocuments({ iMatchId: _id })

      const aSetByQuery = []

      // for setBy
      aSetByQuery.push(UserTeamModel.aggregate([
        {
          $match: { iMatchId: _id }
        },
        {
          $lookup: {
            from: 'matchteams',
            localField: 'sHash',
            foreignField: 'sHash',
            as: 'players'
          }
        },
        {
          $project: {
            iMatchId: 1,
            aPlayers: {
              $arrayElemAt: ['$players.aPlayers', 0]
            }
          }
        },
        {
          $unwind: {
            path: '$aPlayers'
          }
        },
        {
          $group: {
            _id: '$aPlayers.iMatchPlayerId',
            noOfSetPlayer: { $sum: 1 }
          }
        },
        {
          $project: {
            setBy: {
              $multiply: [
                { $round: [{ $divide: ['$noOfSetPlayer', teams] }, 2] },
                100
              ]
            }
          }
        }
      ]).allowDiskUse(bAllowDiskUse).exec())

      // for setCapAndViceCap
      aSetByQuery.push(UserTeamModel.aggregate([
        {
          $match: { iMatchId: _id }
        },
        {
          $facet: {
            cap: [
              {
                $group: {
                  _id: '$iCaptainId',
                  NoOfCap: { $sum: 1 }
                }
              },
              {
                $project: {
                  setByCap: {
                    $multiply: [
                      { $round: [{ $divide: ['$NoOfCap', teams] }, 2] }, 100
                    ]
                  }
                }
              }
            ],
            viceCap: [
              {
                $group: {
                  _id: '$iViceCaptainId',
                  NoOfViceCap: { $sum: 1 }
                }
              },
              {
                $project: {
                  setByViceCap: {
                    $multiply: [
                      { $round: [{ $divide: ['$NoOfViceCap', teams] }, 2] },
                      100
                    ]
                  }
                }
              }
            ]
          }
        },
        {
          $project: {
            all: { $concatArrays: ['$cap', '$viceCap'] }
          }
        },
        {
          $unwind: {
            path: '$all',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $replaceRoot: { newRoot: '$all' }
        }
      ]).allowDiskUse(bAllowDiskUse).exec())

      const [set, setCapAndViceCap] = await Promise.all(aSetByQuery)

      const result = [...set, ...setCapAndViceCap]

      const aBulkMatchPlayer = []
      for (const player of result) {
        const setObj = {}
        const { setByCap, setByViceCap, setBy } = player
        if (setBy) {
          setObj.nSetBy = Number(setBy.toFixed(2))
        } else if (setByCap) {
          setObj.nCaptainBy = Number(setByCap.toFixed(2))
        } else if (setByViceCap) {
          setObj.nViceCaptainBy = Number(setByViceCap.toFixed(2))
        }

        aBulkMatchPlayer.push({
          updateOne: {
            filter: { _id: player._id },
            update: { $set: { ...setObj, dUpdatedAt: Date.now() } }
          }
        })
      }
      await MatchPlayerModel.bulkWrite(aBulkMatchPlayer, { ordered: false })
    }
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = new Cron()
