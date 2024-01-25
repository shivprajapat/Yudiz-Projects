const UserLeagueModel = require('./model')
const UserTeamModel = require('../userTeam/model')
const MatchLeagueModel = require('../matchLeague/model')
const MyMatchesModel = require('../myMatches/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, getPaginationValues2, handleCatchError, convertToDecimal } = require('../../helper/utilities.services')
const getUpdatedPrizeBreakupData = require('../matchLeague/common')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { checkCached } = require('../leaderBoard/common')
const { queuePush, redisClient, redisClient2, checkTeamJoined } = require('../../helper/redis')
const promocodeServices = require('../promocode/services')
const axios = require('axios')
const config = require('../../config/config')
const bucket = require('../../helper/cloudStorage.services')
const { createXlsxFile } = require('../cron/common')
const moment = require('moment')
const { bAllowDiskUse, CACHE_2 } = config
const UsersModel = require('../user/model')
const MatchTeamsModel = require('../matchTeams/model')
const cachegoose = require('recachegoose')
const { getPrice, autoCreateAndRewardQueue } = require('./common')
const BotLogModel = require('../botLogs/model')
const { findAdmin, updateAdmin } = require('./grpc/clientServices')
const BackUpMatchTeamsModel = require('../matchTeams/backupMatchTeams.model')
const BackUpUserTeamsModel = require('../userTeam/backupUserTeam.model')
const { findUpcomingMatch } = require('../match/common')
const { joinCopyBotAfterMinJoinCount } = require('./copybotService')
const { promocodeValidation, userValidations, matchLeagueValidations, validateUserTeamForLeague } = require('./joining.validations')
const { joinLeagueTeamWise, joinLeague } = require('./joinleague')
const UserBalanceModel = require('../userBalance/model')
const userBalanceServices = require('../userBalance/services')
class UserLeague {
  // Join contest with multiple team
  async addV3(req, res) {
    try {
      let { aUserTeamId, iMatchLeagueId, sPromo, sType } = req.body
      const iUserId = req.user._id
      const lang = req.userLanguage

      //* Checking if duplicate team is joining contest
      for (const iUserTeamId of aUserTeamId) {
        const bAlreadyJoined = await checkTeamJoined(iUserId, iUserTeamId, iMatchLeagueId)
        if (bAlreadyJoined === 'EXIST') aUserTeamId = Array.isArray(aUserTeamId) && aUserTeamId.length ? aUserTeamId.filter(id => id !== iUserTeamId) : []
      }

      if (Array.isArray(aUserTeamId) && !aUserTeamId.length) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].user_already_joined })
      }
      //*

      const nTotalTeam = aUserTeamId.length
      const query = { _id: ObjectId(iMatchLeagueId), bCancelled: false }

      let validationResult = {
        data: {}
      }

      if (sPromo && sPromo.length) {
        try {
          const data = { sPromo, iMatchLeagueId, nTeamCount: nTotalTeam, iUserId, lang }
          validationResult = await promocodeServices.validateMatchPromocode(data)
        } catch (error) {
          const { status: s = '', message = '' } = error
          if (!s) { return catchError('UserLeague.addV3', error, req, res) }
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: message, data: { sKey: 'OTHER', Value: { nJoinSuccess: 0, nTotalTeam } } })
        }
      }
      const { iPromocodeId, nBonus: nPromoDiscount = 0 } = validationResult.data || {}

      const aErrors = []

      const matchLeague = await MatchLeagueModel.findOne(query, { dCreatedAt: 0, dUpdatedAt: 0, sShareCode: 0, bIsProcessed: 0, sFairPlay: 0, bWinningDone: 0, bPrizeDone: 0, sShareLink: 0, bCopyLeague: 0, iUserId: 0 }, { readPreference: 'primaryPreferred' }).lean().cache(CACHE_2, `matchLeague:${iMatchLeagueId}:active`)

      if (!matchLeague) {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague), data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })
      }

      const user = await UsersModel.findById(iUserId, { bIsInternalAccount: 1, eType: 1, sUsername: 1, sProPic: 1, sReferrerRewardsOn: 1, iReferredBy: 1 }).lean()
      if (user.bIsInternalAccount === true) {
        if (matchLeague.bPrivateLeague === false) {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].public_league_join_err, data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })
        } else if (matchLeague.bPrivateLeague === true && matchLeague.bInternalLeague === false) {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].league_join_err, data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })
        }
      } else {
        if (matchLeague.bInternalLeague === true) {
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].league_join_err, data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })
        }
      }

      const [upcomingMatch, multiTeam] = await Promise.all([
        findUpcomingMatch(matchLeague.iMatchId),
        UserLeagueModel.countDocuments({ iMatchLeagueId: matchLeague._id, iUserId }, { readPreference: 'primary' })
      ])
      if (!upcomingMatch) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].match_started, data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })

      if (!matchLeague.bMultipleEntry && (aUserTeamId.length > matchLeague.nTeamJoinLimit || multiTeam > 0)
      ) {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].multiple_join_err, data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })
      }
      if ((matchLeague.nTeamJoinLimit <= multiTeam || nTotalTeam > matchLeague.nTeamJoinLimit || (nTotalTeam + multiTeam) > matchLeague.nTeamJoinLimit) && !matchLeague.bPrivateLeague) {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].team_join_limit_err, data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })
      }

      let teams = []
      let remainTeams
      if (Array.isArray(aUserTeamId)) {
        teams = aUserTeamId.filter(team => !teams.includes(team))
        teams = teams.map(team => ObjectId(team))

        if (nTotalTeam > teams) {
          aErrors.push(messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cteam))
        }
        const [teamAlreadyJoin, team] = await Promise.all([
          UserLeagueModel.find({ iMatchLeagueId: matchLeague._id, iUserId, iUserTeamId: { $in: teams } }, {}, { readPreference: 'primaryPreferred' }).lean(), // check for multi join
          UserTeamModel.find({ iMatchId: matchLeague.iMatchId, _id: { $in: teams }, iUserId }, {}, { readPreference: 'primaryPreferred' }).lean()
        ])
        remainTeams = teams.filter(team => {
          return !(teamAlreadyJoin.some(joinedTeam => joinedTeam.iUserTeamId.toString() === team.toString()))
        })
        if (nTotalTeam > remainTeams.length) {
          aErrors.push(messages[req.userLanguage].user_already_joined)
        }

        if (remainTeams.length > team) {
          aErrors.push(messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cteam))
        }
        remainTeams = team.map(({ _id, sName }) => ({ iUserTeamId: _id, sName }))
      }
      const userBalance = await UserBalanceModel.findOne({ where: { iUserId: iUserId.toString() }, plain: true, raw: true })
      const nJoinPrice = (nPromoDiscount) ? matchLeague.nPrice - nPromoDiscount : matchLeague.nPrice
      let { nCurrentTotalBalance, nCurrentBonus } = userBalance
      const { nBonusUtil } = matchLeague

      let nTotalAmount = 0
      let bValid = true
      remainTeams.forEach(t => {
        let nActualBonus = 0
        if (nBonusUtil && nBonusUtil > 0 && nJoinPrice > 0) {
          const nBonus = (nJoinPrice * nBonusUtil) / 100
          if (nCurrentBonus - nBonus >= 0) {
            nActualBonus = nBonus
            if (nCurrentTotalBalance < nJoinPrice - nBonus) {
              nTotalAmount = nTotalAmount + nJoinPrice - nBonus - nCurrentTotalBalance
              bValid = false
              return
            }
          } else {
            nActualBonus = userBalance.nCurrentBonus
            if (nCurrentTotalBalance < nJoinPrice - nCurrentBonus) {
              nTotalAmount = nTotalAmount + nJoinPrice - nCurrentBonus - nCurrentTotalBalance
              bValid = false
              return
            }
          }
        } else if (nCurrentTotalBalance < nJoinPrice) {
          nTotalAmount = nTotalAmount + nJoinPrice - nCurrentTotalBalance
          bValid = false
          return
        }

        const nPrice = nActualBonus ? nJoinPrice - nActualBonus : nJoinPrice
        nCurrentTotalBalance = nCurrentTotalBalance - nPrice
        nCurrentBonus = nCurrentBonus - nActualBonus
      })

      if (!bValid) {
        return res.status(status.OK).jsonp({
          status: jsonStatus.OK,
          message: messages[req.userLanguage].join_contest_succ.replace('##', messages[req.userLanguage].cuserJoined),
          data: {
            sKey: 'INSUFFICIENT_BALANCE',
            oValue: {
              nJoinSuccess: 0,
              nTotalTeam,
              nAmount: nTotalAmount > 0 ? nTotalAmount : undefined
            }
          }
        })
      }

      matchLeague.nJoined = await redisClient.incrby(`${matchLeague._id}`, remainTeams.length)

      if (!matchLeague.bUnlimitedJoin) {
        if (matchLeague.nJoined > matchLeague.nMax) {
          await redisClient.decrby(`${matchLeague._id}`, remainTeams.length)
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].league_full, data: { sKey: 'REFRESH_LEAGUE', oValue: { nJoinSuccess: 0, nTotalTeam, bRefreshLeague: true } } })
        }
      }

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      let nJoinSuccess = 0
      let nAmount = 0
      let bDoCopyBot = false
      let token = null
      let teamCount = ''
      // const userBalance = 0
      let userType
      if (user.eType === 'B') {
        if (sType === 'CP') {
          userType = 'CB'
        } else if (sType === 'CMB') {
          userType = 'CMB'
        } else {
          userType = 'B'
        }
      } else {
        userType = 'U'
      }

      let actualUserJoined, iAdminId
      if (user.eType === 'U' && matchLeague.bBotCreate) {
        actualUserJoined = await UserLeagueModel.countDocuments({ iMatchLeagueId: ObjectId(matchLeague._id), eType: 'U' }, { readPreference: 'primary' })
      }

      const { bBotCreate, nMinTeamCount, bCopyBotInit = '', nCopyBotsPerTeam = '' } = matchLeague

      for (const remainTeam of remainTeams) {
        const nJoinPrice = (nPromoDiscount) ? matchLeague.nPrice - nPromoDiscount : matchLeague.nPrice
        const sPromocode = nPromoDiscount ? sPromo : ''

        const bAfterMinJoin = (actualUserJoined + nJoinSuccess) >= nMinTeamCount
        const data = await joinLeagueTeamWise({
          matchLeague, iUserTeamId: remainTeam.iUserTeamId, iUserId, iMatchLeagueId, team: remainTeam.sName, upcomingMatch, ePlatform, user: user, iPromocodeId, nPromoDiscount, sType: userType, sPromocode, nJoinPrice, bAfterMinJoin
        })

        if (!data.isSuccess) {
          nAmount = data.nAmount ? nAmount + data.nAmount : nAmount
          await redisClient.decr(`${matchLeague._id}`)
          continue
        }
        nJoinSuccess++
        if (user.eType === 'U') {
          try {
            // const { bBotCreate, nMinTeamCount, bCopyBotInit = '', nCopyBotsPerTeam = '' } = matchLeague
            if (nCopyBotsPerTeam) teamCount = nCopyBotsPerTeam // 7
            // nMinTeamCount -> 2
            if (bBotCreate && bBotCreate === true && bAfterMinJoin && nMinTeamCount) {
              const adminData = await findAdmin({ eStatus: 'Y', eType: 'SUPER', aJwtTokens: { $exists: true, $ne: [] } }, { _id: 1, sDepositToken: 1 }, { dLoginAt: -1 })
              if (adminData) {
                token = adminData.sDepositToken
                if (!token) {
                  token = jwt.sign({ _id: (adminData._id).toHexString() }, config.JWT_SECRET)
                  await updateAdmin(adminData._id, token)
                }
              }

              iAdminId = adminData._id

              if (token) {
                const botlog = await BotLogModel.create({
                  iMatchId: matchLeague.iMatchId,
                  iMatchLeagueId,
                  nTeams: nCopyBotsPerTeam,
                  iAdminId,
                  bInstantAdd: false,
                  eType: 'CB'
                })
                try {
                  await axios.post(`${config.FANTASY_NODE_URL}/api/admin/copy-user-team/${matchLeague.iMatchId}/v1`, {
                    iMatchLeagueId: iMatchLeagueId,
                    iUserId: iUserId,
                    iBotLogId: botlog._id,
                    aUserTeamId: [remainTeam.iUserTeamId],
                    teamCount: nCopyBotsPerTeam
                  }, { headers: { 'Content-Type': 'application/json', Authorization: token } })
                  bDoCopyBot = (bCopyBotInit === false)
                } catch (e) {
                  // await BotLogModel.updateOne({ _id: ObjectId(botlog._id) }, { $inc: { nErrors: 1 }, $push: { aError: e } })
                  await queuePush('BOTLOGS_UPDATE_COUNT', { id: botlog._id.toString(), nErrorsCount: 1, error: e })
                  handleCatchError(e)
                }
              }
            }
          } catch (e) {
            handleCatchError(e)
          }
        }
        if (!matchLeague.bUnlimitedJoin) {
          if (matchLeague.nJoined > matchLeague.nMax) {
            const matchLeagueData = await MatchLeagueModel.findByIdAndUpdate(matchLeague._id, { $inc: { nJoined: nJoinSuccess } }, { upsert: false, runValidators: true, new: true, readPreference: 'primaryPreferred' }).lean()

            const sKey = nJoinSuccess === 0 && nAmount ? 'INSUFFICIENT_BALANCE' : 'SUCCESS'
            const responseData = {
              sKey: sKey,
              oValue: {
                nJoinSuccess,
                nTotalTeam,
                nAmount: nAmount > 0 ? nAmount : undefined,
                nJoined: sKey === 'SUCCESS' ? matchLeagueData.nJoined : undefined,
                aErrors: sKey === 'SUCCESS' ? aErrors : undefined
              }
            }
            let message
            if (sKey === 'INSUFFICIENT_BALANCE') message = messages[lang].insuff_balance.replace('##', messages[lang].sleague)
            else message = messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cuserJoined)
            return res.status(status.OK).jsonp({
              status: jsonStatus.OK,
              message,
              data: responseData
            })
          }
        }
      }
      const matchLeagueData = await MatchLeagueModel.findByIdAndUpdate(matchLeague._id, { $inc: { nJoined: nJoinSuccess } }, { upsert: false, runValidators: true, new: true, readPreference: 'primaryPreferred' }).lean()

      if (Number(matchLeague.nMax) === Number(matchLeague.nJoined) && matchLeagueData.bAutoCreate && matchLeagueData.bUnlimitedJoin === false) {
        await queuePush('autoCreateLeague', matchLeague)
      }
      // Assign referral on first league join
      const { sReferrerRewardsOn = '', iReferredBy = '' } = user
      if (iReferredBy && sReferrerRewardsOn && (sReferrerRewardsOn === 'FIRST_LEAGUE_JOIN' || (sReferrerRewardsOn === 'FIRST_PAID_LEAGUE_JOIN' && matchLeague.nPrice > 0))) {
        await queuePush('processReferReward', { sReferral: 'LB', iUserId, sReferrerRewardsOn, iReferredBy, nJoinSuccess })
        // let totalLeagueJoinCount
        // if (sReferrerRewardsOn === 'FIRST_PAID_LEAGUE_JOIN') {
        //   totalLeagueJoinCount = await UserLeagueModel.countDocuments({ iUserId, nOriginalPrice: { $gt: 0 } })
        // } else {
        //   totalLeagueJoinCount = await UserLeagueModel.countDocuments({ iUserId })
        // }

        // if (nJoinSuccess !== 0) {
        //   totalLeagueJoinCount = totalLeagueJoinCount - nJoinSuccess

        //   if (totalLeagueJoinCount === 0) {
        //     const referredBy = await UsersModel.findOne({ _id: iReferredBy }, { sReferCode: 1, sUsername: 1, eType: 1, _id: 1 }).lean()
        //     if (referredBy) {
        //       const registerReferBonus = await commonRuleServices.findRule('RR')
        //       if (registerReferBonus) {
        //         const refer = await userBalanceServices.referBonus({ iUserId: referredBy._id, rule: registerReferBonus, sReferCode: referredBy.sReferCode, sUserName: referredBy.sUsername, eType: referredBy.eType, nReferrals: 1, iReferById: iUserId })
        //         if (refer.isSuccess === true) {
        //           // Add Push Notification
        //           await queuePush('pushNotification:registerReferBonus', { _id: referredBy._id })
        //         }
        //       }
        //     }
        //   }
        // }
      }
      if (bDoCopyBot && token && user.eType === 'U') {
        try {
          const botlog = await BotLogModel.create({
            iMatchId: matchLeague.iMatchId,
            iMatchLeagueId,
            nTeams: teamCount * nMinTeamCount,
            iAdminId,
            bInstantAdd: false,
            eType: 'CB'
          })
          axios.post(`${config.FANTASY_NODE_URL}/api/admin/copy-joined-user-team/${matchLeague.iMatchId}/v1`, {
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

      const sKey = nJoinSuccess === 0 && nAmount ? 'INSUFFICIENT_BALANCE' : 'SUCCESS'
      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].join_contest_succ.replace('##', messages[req.userLanguage].cuserJoined),
        data: {
          sKey: sKey,
          oValue: {
            nJoinSuccess,
            nTotalTeam,
            nAmount: nAmount > 0 ? nAmount : undefined,
            nJoined: sKey === 'SUCCESS' ? matchLeagueData.nJoined : undefined,
            aErrors: sKey === 'SUCCESS' ? aErrors : undefined
          }
        }
      })
    } catch (error) {
      const { status = '', message = '' } = error
      if (!status) { return catchError('UserLeague.addV3', error, req, res) }
      return res.status(status).jsonp({ status, message })
    }
  }

  async addV4(req, res) {
    try {
      let { aUserTeamId, iMatchLeagueId, sPromo } = req.body
      const iUserId = req.user._id
      const lang = req.userLanguage

      //* Checking if duplicate team is joining contest
      for (const iUserTeamId of aUserTeamId) {
        const bAlreadyJoined = await checkTeamJoined(iUserId, iUserTeamId, iMatchLeagueId)
        if (bAlreadyJoined === 'EXIST') aUserTeamId = Array.isArray(aUserTeamId) && aUserTeamId.length ? aUserTeamId.filter(id => id !== iUserTeamId) : []
      }

      if (Array.isArray(aUserTeamId) && !aUserTeamId.length) {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].user_already_joined })
      }
      //*

      const nTotalTeam = aUserTeamId.length
      const query = { _id: ObjectId(iMatchLeagueId), bCancelled: false }
      let validationResult
      if (sPromo && sPromo.length) validationResult = await promocodeValidation(sPromo, iMatchLeagueId, nTotalTeam, iUserId, lang)
      if (['false', false].includes(validationResult?.isSuccess)) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: validationResult.message, data: { sKey: 'OTHER', Value: { nJoinSuccess: 0, nTotalTeam } } })

      const { iPromocodeId, nBonus: nPromoDiscount = 0 } = validationResult?.data || {}

      const aErrors = []

      const matchLeague = await MatchLeagueModel.findOne(query, { dCreatedAt: 0, dUpdatedAt: 0, sShareCode: 0, bIsProcessed: 0, sFairPlay: 0, bWinningDone: 0, bPrizeDone: 0, sShareLink: 0, bCopyLeague: 0, iUserId: 0 }, { readPreference: 'primaryPreferred' }).lean().cache(CACHE_2, `matchLeague:${iMatchLeagueId}:active`)

      if (!matchLeague) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague), data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })

      const user = await UsersModel.findById(iUserId, { bIsInternalAccount: 1, eType: 1, sUsername: 1, sProPic: 1, sReferrerRewardsOn: 1, iReferredBy: 1 }).lean()
      const validateUser = await userValidations(user.bIsInternalAccount, matchLeague.bPrivateLeague, matchLeague.bInternalLeague, req.userLanguage, matchLeague.iLeagueCatId)
      if (validateUser?.isSuccess && validateUser.isSuccess === false) {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: validateUser.message, data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })
      }

      const [upcomingMatch, multiTeam] = await Promise.all([
        findUpcomingMatch(matchLeague.iMatchId),
        UserLeagueModel.countDocuments({ iMatchLeagueId: matchLeague._id, iUserId }, { readPreference: 'primary' })
      ])
      const validateMatchLeague = matchLeagueValidations(upcomingMatch, matchLeague, multiTeam, nTotalTeam, lang)
      if (validateMatchLeague?.isSuccess === false) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: validateMatchLeague.message, data: { sKey: 'OTHER', oValue: { nJoinSuccess: 0, nTotalTeam } } })

      const teamPayload = { aUserTeamId, nTotalTeam, matchLeague, iUserId, aErrors, userLanguage: lang }
      const remainTeams = await validateUserTeamForLeague(teamPayload)
      const data = { iUserId, nPromoDiscount, matchLeague, remainTeams }

      const userBalance = await userBalanceServices.checkUserBalance(data)

      if (userBalance?.bValid === false) {
        return res.status(status.OK).jsonp({
          status: jsonStatus.OK,
          message: messages[req.userLanguage].join_contest_succ.replace('##', messages[req.userLanguage].cuserJoined),
          data: {
            sKey: 'INSUFFICIENT_BALANCE',
            oValue: {
              nJoinSuccess: 0,
              nTotalTeam,
              nAmount: userBalance?.nTotalAmount > 0 ? userBalance?.nTotalAmount : undefined
            }
          }
        })
      }

      matchLeague.nJoined = await redisClient.incrby(`${matchLeague._id}`, remainTeams.length)

      if (!matchLeague.bUnlimitedJoin) {
        if (matchLeague.nJoined > matchLeague.nMax) {
          await redisClient.decrby(`${matchLeague._id}`, remainTeams.length)
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].league_full, data: { sKey: 'REFRESH_LEAGUE', oValue: { nJoinSuccess: 0, nTotalTeam, bRefreshLeague: true } } })
        }
      }

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'
      const userType = user.eType

      let actualUserJoined
      if (user.eType === 'U' && matchLeague.bBotCreate) {
        actualUserJoined = await UserLeagueModel.countDocuments({ iMatchLeagueId: ObjectId(matchLeague._id), eType: 'U' }, { readPreference: 'primary' })
      }

      const { nMinTeamCount } = matchLeague

      const joinPayload = { remainTeams, nPromoDiscount, matchLeague, actualUserJoined, sPromo, iUserId, iMatchLeagueId, upcomingMatch, ePlatform, iPromocodeId, user, userType, nTotalTeam, aErrors, lang }
      const leagueJoin = await joinLeague(joinPayload)
      if (leagueJoin?.isSuccess === false) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: leagueJoin.message, data: leagueJoin.data })
      const { teamCount, iAdminId, token, nJoinSuccess, bDoCopyBot, nAmount } = leagueJoin

      await MatchLeagueModel.updateOne({ _id: ObjectId(matchLeague._id) }, { $inc: { nJoined: nJoinSuccess } }, { upsert: false, runValidators: true })

      await autoCreateAndRewardQueue(matchLeague, user)

      if (bDoCopyBot && token && user.eType === 'U') {
        const minJoinPayload = {
          iMatchLeagueId,
          bDoCopyBot,
          token,
          eType: user.eType,
          iMatchId: matchLeague.iMatchId,
          teamCount,
          nMinTeamCount,
          iAdminId
        }
        await joinCopyBotAfterMinJoinCount(minJoinPayload)
      }

      const sKey = nJoinSuccess === 0 && nAmount ? 'INSUFFICIENT_BALANCE' : 'SUCCESS'
      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].join_contest_succ.replace('##', messages[req.userLanguage].cuserJoined),
        data: {
          sKey: sKey,
          oValue: {
            nJoinSuccess,
            nTotalTeam,
            nAmount: nAmount > 0 ? nAmount : undefined,
            nJoined: sKey === 'SUCCESS' ? matchLeague.nJoined : undefined,
            aErrors: sKey === 'SUCCESS' ? aErrors : undefined
          }
        }
      })
    } catch (error) {
      return catchError('UserLeague.addV4', error, req, res)
    }
  }

  async list(req, res) {
    try {
      const { start, limit, sorting, search } = getPaginationValues2(req.query)
      const { bBotTeams, eType } = req.query

      let query = search ? { sUserName: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : {}
      query = eType ? { ...query, eType } : { ...query }
      query = { ...query, iMatchLeagueId: ObjectId(req.params.id) }

      const matchLeague = await MatchLeagueModel.findOne({ _id: ObjectId(req.params.id) }, { nJoined: 1, nMax: 1, bUnlimitedJoin: 1, iLeagueId: 1, iMatchId: 1, bBotCreate: 1, sName: 1, nTotalPayout: 1, sPayoutBreakupDesign: 1, bPrivateLeague: 1, eMatchStatus: 1, bCancelled: 1, eReportStatus: 1, aReportUrl: 1 }).lean()

      let results = []

      const projection = {
        iUserTeamId: 1,
        iUserId: 1,
        iMatchLeagueId: 1,
        iMatchId: 1,
        nPoolPrice: 1,
        nTotalPoints: 1,
        nRank: 1,
        nPrice: 1,
        sUserName: 1,
        sTeamName: 1,
        sMatchName: 1,
        dCreatedAt: 1,
        bCancelled: 1,
        eType: 1,
        aExtraWin: 1,
        nBonusWin: 1
      }

      const isCached = await checkCached(matchLeague.iMatchId, req.params.id)

      if ([true, 'true'].includes(bBotTeams)) {
        results = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(req.params.id), eType: { $in: ['B', 'CB', 'CMB', 'U'] } }, projection).populate({ path: 'iUserTeamId', select: ['sHash', 'iCaptainId', 'iViceCaptainId'] }).sort(sorting).lean()
        let teamHashes = results.map(item => item?.iUserTeamId?.sHash)

        if (!results.length || matchLeague.eMatchStatus === 'CMP') {
          results = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(req.params.id), eType: { $in: ['B', 'CB', 'CMB', 'U'] } }, projection).populate({ path: 'oBackUpUserTeam', select: ['sHash', 'iCaptainId', 'iViceCaptainId'] }).sort(sorting).lean()
          teamHashes = results.map(({ oBackUpUserTeam }) => oBackUpUserTeam?.sHash)
        }

        const uniqueHashes = [...new Set(teamHashes)]

        let teams = await MatchTeamsModel.find({ sHash: { $in: uniqueHashes } }, { aPlayers: 1, sHash: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.iTeamId', select: ['sName'] }]).lean()
        if (!(teams.length) && matchLeague.eMatchStatus === 'CMP') {
          teams = await BackUpMatchTeamsModel.find({ sHash: { $in: uniqueHashes } }, { aPlayers: 1, sHash: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.iTeamId', select: ['sName'] }]).lean()
          if (!teams.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].cMatchTeams) })
        }

        results = results.map((userLeague) => {
          const iUserTeamId = userLeague?.iUserTeamId?.sHash ? userLeague?.iUserTeamId : userLeague.oBackUpUserTeam
          const team = teams[teams.findIndex((t) => t.sHash === iUserTeamId.sHash)]
          delete iUserTeamId.sHash
          return { ...userLeague, aPlayers: team.aPlayers, iUserTeamId: iUserTeamId._id, iCaptainId: iUserTeamId.iCaptainId, iViceCaptainId: iUserTeamId.iViceCaptainId }
        })
      } else if (matchLeague.eMatchStatus === 'L' && matchLeague.bCancelled === false && Number(isCached[0])) {
        if (search || eType) {
          const aUserLeague = await UserLeagueModel.find(query, projection).skip(Number(start)).limit(Number(limit)).lean()

          const teamIds = []
          aUserLeague.forEach(s => {
            teamIds.push(s.iUserTeamId.toString())
          })

          const redisData = await redisClient2.evalsha('5111ebb3688a5c52bd02c6df453b42710ede8f94', 1, `ml:{${matchLeague.iMatchId}}:${req.params.id}`, ...teamIds)
          aUserLeague.forEach(s => {
            redisData.forEach(singleTeam => {
              if (s.iUserTeamId.toString() === singleTeam[0]) {
                const obj = { ...s }
                obj.nTotalPoints = parseFloat(singleTeam[1])
                obj.nRank = singleTeam[2]
                results.push(obj)
              }
            })
          })
          results.sort((a, b) => (a.nRank > b.nRank ? 1 : -1))
        } else {
          const end = parseInt(start) + parseInt(limit) - 1
          const data = await redisClient2.evalsha('5b9a4657e92b7ce3a7abe5cbb7441730454eda5e', 1, `ml:{${matchLeague.iMatchId}}:${req.params.id}`, parseInt(start), end)

          const userTeams = {}

          if (data.length > 0) {
            data.forEach(s => { userTeams[s[0]] = { nTotalPoints: parseFloat(s[1]), nRank: s[2] } })
            let ids = Object.keys(userTeams)
            ids = ids.map(s => ObjectId(s))
            const aUserLeague = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(req.params.id), iUserTeamId: { $in: ids }, bCancelled: false }, projection).lean()

            aUserLeague.forEach(s => {
              const obj = { ...s }
              obj.nTotalPoints = userTeams[s.iUserTeamId].nTotalPoints
              obj.nRank = userTeams[s.iUserTeamId].nRank
              results.push(obj)
            })
            results.sort((a, b) => (a.nRank > b.nRank ? 1 : -1))
          }
        }
      } else {
        results = await UserLeagueModel.find(query, projection).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()
      }
      const total = [true, 'true'].includes(bBotTeams) ? results.length : await UserLeagueModel.countDocuments({ ...query })

      results = results.map((league) => {
        league.nTotalPoints = league.nTotalPoints ? convertToDecimal(league.nTotalPoints) : 0
        return league
      })
      const data = [{ total, results }]

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserLeague), data: { data, matchLeague } })
    } catch (error) {
      return catchError('UserLeague.list', error, req, res)
    }
  }

  // match wise user league list
  async matchWiseUserLeagueList(req, res) {
    try {
      const { iMatchId, iUserId } = req.body

      const data = await UserLeagueModel.find({ iMatchId: ObjectId(iMatchId), iUserId: ObjectId(iUserId) },
        { sTeamName: 1, aExtraWin: 1, nRank: 1, sLeagueName: 1, nPoolPrice: 1, bCancelled: 1, bWinDistributed: 1, iUserTeamId: 1, nTotalPayout: 1, nBonusWin: 1, nPrice: 1, sUserName: 1, sMatchName: 1 },
        { readPreference: 'primaryPreferred' }).lean()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserLeague), data: data })
    } catch (error) {
      return catchError('UserLeague.matchWiseUserLeagueList', error, req, res)
    }
  }

  // To get list of user joined leagueId for particular match (For validation)
  async userJoinLeagueIdList(req, res) {
    try {
      const iUserId = req.user._id
      const data = await UserLeagueModel.aggregate([
        {
          $match: {
            iUserId,
            iMatchId: ObjectId(req.params.id)
          }
        }, {
          $group: {
            _id: '$iMatchLeagueId',
            nJoinedCount: { $sum: 1 },
            aUserTeams: {
              $push: '$iUserTeamId'
            }
          }
        }, {
          $project: {
            iMatchLeagueId: '$_id',
            nJoinedCount: 1,
            aUserTeams: 1, // Array of userteams added
            _id: 0
          }
        }
      ]).allowDiskUse(bAllowDiskUse).read('primary').exec()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cUserJoinedLeagueList), data })
    } catch (error) {
      catchError('UserLeague.userJoinLeagueList', error, req, res)
    }
  }

  // Joined validation for league
  async joinDetailsInSingleLeague(req, res) {
    try {
      const iUserId = req.user._id
      const data = await UserLeagueModel.aggregate([
        {
          $match: {
            iUserId,
            iMatchLeagueId: ObjectId(req.params.id)
          }
        }, {
          $group: {
            _id: '$iMatchLeagueId',
            nJoinedCount: { $sum: 1 },
            aUserTeams: {
              $push: '$iUserTeamId'
            }
          }
        }, {
          $project: {
            iMatchLeagueId: '$_id',
            nJoinedCount: 1,
            aUserTeams: 1, // Array of userteams added
            _id: 0
          }
        }
      ]).allowDiskUse(bAllowDiskUse).read('primary').exec()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cUserJoinedLeagueList), data: data[0] || {} })
    } catch (error) {
      catchError('UserLeague.joinDetailsInSingleLeague', error, req, res)
    }
  }

  // To get my-contest list
  async userJoinLeagueListV3(req, res) {
    try {
      const iUserId = req.user._id
      const matchLeagues = await MyMatchesModel.findOne({ iUserId, iMatchId: ObjectId(req.params.id) }, { aMatchLeagueId: 1 }, { readPreference: 'primary' }).lean()

      let matchLeagueIds = []
      if (matchLeagues && matchLeagues.aMatchLeagueId && matchLeagues.aMatchLeagueId.length) {
        matchLeagueIds = matchLeagues.aMatchLeagueId.map(id => ObjectId(id))
      }

      let data = await MatchLeagueModel.find({
        $or: [
          { $and: [{ _id: { $in: matchLeagueIds } }, { bCancelled: false }] },
          { $and: [{ bPrivateLeague: true }, { bCancelled: false }, { iUserId }, { iMatchId: ObjectId(req.params.id) }] }
        ]
      }, { nCopyBotsPerTeam: 0, nSameCopyBotTeam: 0, bBotCreate: 0, bCopyBotInit: 0, bInternalLeague: 0, bWinningDone: 0, nAutoFillSpots: 0 }).lean()

      const aMatchLeagueIds = data.map(({ _id }) => _id)
      const allUserLeagues = await UserLeagueModel.find({ iMatchLeagueId: { $in: aMatchLeagueIds }, iUserId: req.user._id, bCancelled: false }, { bAfterMinJoin: 0 }).lean()

      for (const matchLeaguesData of data) {
        const { _id: iMatchLeagueId, iMatchId, nWinnersCount, eMatchStatus, aLeaguePrize } = matchLeaguesData
        // const userLeagues = await UserLeagueModel.find({ iMatchLeagueId: iMatchLeagueId, iUserId: req.user._id, bCancelled: false }).lean()

        // To get all userLeagues of this matchLeague
        const userLeagues = Array.isArray(allUserLeagues) && allUserLeagues.length
          ? allUserLeagues.filter(userLeague => userLeague.iMatchLeagueId.toString() === iMatchLeagueId.toString()) : []

        let isCached = []

        if (eMatchStatus === 'U') {
          matchLeaguesData.userJoined = userLeagues.map(({ sTeamName, iUserTeamId, iUserId, _id }) => ({ sTeamName, nTotalPoints: 0, iUserTeamId, iUserId, _id }))
        } else if (eMatchStatus === 'L' || eMatchStatus === 'I') {
          isCached = await checkCached(iMatchId, iMatchLeagueId)

          if (Number(isCached[0])) {
            const teamIds = userLeagues.map(s => s.iUserTeamId)
            const redisData = await redisClient2.evalsha('5111ebb3688a5c52bd02c6df453b42710ede8f94', 1, `ml:{${iMatchId}}:${iMatchLeagueId}`, ...teamIds)

            const bPrizeCalculated = matchLeaguesData.bPrizeDone
            matchLeaguesData.userJoined = userLeagues.map((userLeague) => {
              const { sTeamName, iUserTeamId, iUserId, _id, bRankCalculated, bPointCalculated } = userLeague
              const cachedTeam = redisData.find(singleTeam => iUserTeamId.toString() === singleTeam[0])

              const nTotalPoints = bPointCalculated ? userLeague.nTotalPoints : Number(cachedTeam[1])
              const nRank = bRankCalculated ? userLeague.nRank : Number(cachedTeam[2])

              if (bPointCalculated && bRankCalculated && bPrizeCalculated) redisClient2.hset(`hml:{${iMatchId}}:${iMatchLeagueId}`, 'exists', 0).then(() => { Promise.resolve() })

              if (nWinnersCount >= nRank) {
                const prize = getPrice(aLeaguePrize, nRank, 1)
                const { nTotalRealMoney, nTotalBonus, aTotalExtraWin } = prize

                return ({ sTeamName, nRank, nTotalPoints, bTeamWinningZone: true, aExtraWin: aTotalExtraWin, nBonusWin: nTotalBonus, nPrice: nTotalRealMoney, iUserTeamId, iUserId, _id })
              }
              return { sTeamName, nRank, nTotalPoints, bTeamWinningZone: false, iUserTeamId, iUserId, _id }
            })
          } else {
            matchLeaguesData.userJoined = userLeagues.map(({ sTeamName, nTotalPoints = 0, iUserTeamId, iUserId, _id, nRank, aExtraWin = [], nBonusWin = 0, nPrice = 0 }) => (
              { sTeamName, nTotalPoints, iUserTeamId, iUserId, _id, nRank, aExtraWin, nBonusWin, nPrice, bTeamWinningZone: !!(aExtraWin.length || nPrice || nBonusWin) }
            ))
          }
        } else if (eMatchStatus === 'CMP') {
          matchLeaguesData.userJoined = userLeagues.map(({ sTeamName, nTotalPoints, iUserTeamId, iUserId, _id, nRank, aExtraWin, nBonusWin, nPrice }) => (
            { sTeamName, nTotalPoints, iUserTeamId, iUserId, _id, nRank, aExtraWin, nBonusWin, nPrice }
          ))
        }
      }

      // to get calculated prizeBreakup
      data = await getUpdatedPrizeBreakupData(data)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cUserJoinedLeagueList), data })
    } catch (error) {
      catchError('UserLeague.userJoinLeagueListV3', error, req, res)
    }
  }

  // To switch user team
  async switchUserTeam(req, res) {
    try {
      const iUserId = req.user._id
      let { iUserTeamId } = req.body

      iUserTeamId = ObjectId(iUserTeamId)
      const iUserLeagueId = req.params.id

      const userLeague = await UserLeagueModel.findOne({ _id: iUserLeagueId, iUserId }, { iMatchId: 1 }, { readPreference: 'primary' }).lean()
      if (!userLeague) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cuserSpLeague) })

      // check match is started or not
      const match = await findUpcomingMatch(userLeague.iMatchId)
      if (!match) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].match_started })

      // check userteam is exist in Userteam model
      const switchTeam = await UserTeamModel.findOne({ iUserId, iMatchId: userLeague.iMatchId, _id: iUserTeamId }, {}, { readPreference: 'primary' }).lean()
      if (!switchTeam) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cuserTeam) })

      // check switch team is already exist in userLeague
      const switchTeamExist = await UserLeagueModel.findOne({ iUserId, _id: userLeague._id, iUserTeamId }, { bAfterMinJoin: 0 }, { readPreference: 'primary' }).lean()
      if (switchTeamExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].cuserTeam) })

      const oldUserLeague = await UserLeagueModel.findByIdAndUpdate({ _id: userLeague._id }, { iUserTeamId, sTeamName: switchTeam.sName }, { new: false, runValidators: true, readPreference: 'primary' }).lean()

      res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].cuserTeamSwitched) })
      if (switchTeam) { // For update copy system user team
        const league = await MatchLeagueModel.findOne({ _id: userLeague.iMatchLeagueId, iMatchId: userLeague.iMatchId, bBotCreate: true, bCancelled: false }).lean()

        if (league) await queuePush('CopyTeamUpdate', { matchLeagueIds: [league._id], iMatchId: userLeague.iMatchId, iUserId, iUserTeamId: oldUserLeague.iUserTeamId, iNewUserTeamId: switchTeam._id, eUpdateTeamType: 'SWITCH' })
      }
    } catch (error) {
      catchError('UserLeague.switchUserTeam', error, req, res)
    }
  }

  // get Match Contest Extra win list
  async extraWinList(req, res) {
    try {
      const { start, limit, sorting } = getPaginationValues2(req.query)

      const query = { iMatchId: ObjectId(req.params.id), bCancelled: false, $and: [{ aExtraWin: { $exists: true } }, { aExtraWin: { $ne: [] } }] }

      const [aExtraWindata, count] = await Promise.all([UserLeagueModel.find(query, { iMatchId: 1, iMatchLeagueId: 1, iUserId: 1, aExtraWin: 1 }, { readPreference: 'primary' })
        .populate('iUserId', 'sName sUsername eType')
        .populate('iMatchLeagueId', 'sName')
        .sort(sorting).skip(Number(start)).limit(Number(limit))
        .lean(),
      UserLeagueModel.countDocuments(query)])

      const data = { aUserLeague: aExtraWindata, nTotal: count }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].extrawin_list), data })
    } catch (error) {
      catchError('UserLeague.extraWinList', error, req, res)
    }
  }

  async generateMatchLeagueReport(req, res) {
    try {
      const matchLeague = await MatchLeagueModel.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { eReportStatus: 'P' }, { new: true, runValidators: true }).lean()
      if (!matchLeague) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cmatchLeague) })

      const projection = { iUserTeamId: 1, nPoolPrice: 1, nTotalPoints: 1, nRank: 1, nPrice: 1, sUserName: 1, sTeamName: 1, sMatchName: 1, dCreatedAt: 1, bCancelled: 1, eType: 1, aExtraWin: 1, nBonusWin: 1 }

      const GetCaptain = (object, i) => {
        const iPlayerId = object.aPlayers[i].iMatchPlayerId._id
        const sName = object.aPlayers[i].iMatchPlayerId.sName
        const iCaptainId = object.iCaptainId
        const iViceCaptainId = object.iViceCaptainId

        if (iPlayerId.toString() === iCaptainId.toString()) {
          return `${sName}(C)`
        } else if (iPlayerId.toString() === iViceCaptainId.toString()) {
          return `${sName}(VC)`
        } else return sName
      }

      const getUserType = (eType) => {
        const oType = { U: 'User', B: 'Bot', CB: 'Copy Bot', CMP: 'Combination Bot' }
        return oType[eType] || 'User'
      }
      const schema = [
        {
          column: 'Sr.No.',
          type: Number,
          value: object => object.nSr_no,
          width: '15pt',
          align: 'center'
        },
        {
          column: 'Username',
          type: String,
          value: object => object.sUserName,
          width: '16.5pt',
          align: 'center'
        },
        {
          column: 'User Type',
          type: String,
          value: object => getUserType(object.eType),
          width: '15pt',
          align: 'center'
        },
        {
          column: 'Match Name',
          type: String,
          width: '16.5pt',
          value: object => object.sMatchName,
          align: 'center'
        },
        {
          column: 'Team Name',
          type: String,
          value: object => object.sTeamName,
          width: '16.5pt',
          align: 'center'
        },
        {
          column: 'Total Points',
          type: Number,
          value: object => object.nTotalPoints,
          align: 'center',
          width: '16.5pt'
        },
        {
          column: 'Rank',
          type: Number,
          value: object => object.nRank,
          align: 'center',
          width: '16.5pt'
        },
        {
          column: 'Prize',
          type: Number,
          value: object => object.nPrice,
          align: 'center',
          width: '16.5pt'
        },
        {
          column: 'Pool Prize',
          type: String,
          value: object => object.nPoolPrice ? 'Yes' : 'No',
          align: 'center',
          width: '16.5pt'
        },
        {
          column: 'Contest Join Time',
          type: String,
          value: object => moment(object.dCreatedAt).format('lll'),
          align: 'center',
          width: '25pt'
        },
        {
          column: 'Player1',
          type: String,
          value: object => GetCaptain(object, 0),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player2',
          type: String,
          value: object => GetCaptain(object, 1),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player3',
          type: String,
          value: object => GetCaptain(object, 2),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player4',
          type: String,
          value: object => GetCaptain(object, 3),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player5',
          type: String,
          value: object => GetCaptain(object, 4),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player6',
          type: String,
          value: object => GetCaptain(object, 5),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player7',
          type: String,
          value: object => GetCaptain(object, 6),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player8',
          type: String,
          value: object => GetCaptain(object, 7),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player9',
          type: String,
          value: object => GetCaptain(object, 8),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player10',
          type: String,
          value: object => GetCaptain(object, 9),
          align: 'center',
          width: '22pt'
        },
        {
          column: 'Player11',
          type: String,
          value: object => GetCaptain(object, 10),
          align: 'center',
          width: '22pt'
        }
      ]

      let nCount = 1
      let nFile = 1
      let aUserLeague = []
      const aUrl = []
      let teamHashes = []
      const aTeamId = []
      UserLeagueModel.find({ iMatchLeagueId: ObjectId(req.params.id), eType: { $in: ['B', 'CB', 'CMB', 'U'] } }, projection).populate({ path: 'oUserTeam', select: ['sHash', 'iCaptainId', 'iViceCaptainId'] }).sort({ nRank: 1 }).lean().cursor()
        .on('data', async (league) => {
          if (aUserLeague.length > 100000) {
            let aData = aUserLeague.splice(0, 100000)
            if (league?.iUserTeamId?.sHash) teamHashes.push(league?.iUserTeamId?.sHash)

            if (!teamHashes.length && aTeamId.length) {
              const aUserTeams = await BackUpUserTeamsModel.find({ _id: { $in: aTeamId } }, { sHash: 1, iCaptainId: 1, iViceCaptainId: 1 }).lean()
              teamHashes = aUserTeams.map(team => team?.sHash)
              aUserLeague = aUserLeague.map(userleague => {
                const iUserTeamId = aUserTeams[aUserTeams.findIndex(userteam => userteam._id.toString() === userleague.iUserTeamId.toString())]
                return { ...userleague, iUserTeamId }
              })
            }
            const uniqueHashes = [...new Set(teamHashes)]
            let teams

            teams = await MatchTeamsModel.find({ sHash: { $in: uniqueHashes } }, { aPlayers: 1, sHash: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }]).lean()
            if (!teams.length) teams = await BackUpMatchTeamsModel.find({ sHash: { $in: uniqueHashes } }, { aPlayers: 1, sHash: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }]).lean()
            aData = aData.map((userLeague) => {
              const iUserTeamId = userLeague.iUserTeamId

              const team = teams[teams.findIndex((t) => t.sHash === iUserTeamId.sHash)]

              delete iUserTeamId.sHash
              return { ...userLeague, nSr_no: nCount++, aPlayers: team.aPlayers, iUserTeamId: iUserTeamId._id, iCaptainId: iUserTeamId.iCaptainId, iViceCaptainId: iUserTeamId.iViceCaptainId }
            })

            const sFileName = `${req.params.id}_${nFile++}`
            const sPath = config.s3MatchLeagueReport
            const sContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            const sDeposition = `filename=${matchLeague.sName}_${nFile}.xlsx`

            const file = await createXlsxFile(schema, aData, sFileName)

            const sUrl = await bucket.putObject({ sFileName: file.filename, sContentType, path: sPath, fileStream: file.content, sDeposition })
            aUrl.push(sUrl.Key)
          }

          aUserLeague.push(league)
          if (!teamHashes.length) {
            aTeamId.push(league?.iUserTeamId)
          }
        })
        .on('end', async (league) => {
          if (aTeamId.length) {
            const aUserTeams = await BackUpUserTeamsModel.find({ _id: { $in: aTeamId } }, { sHash: 1, iCaptainId: 1, iViceCaptainId: 1 }).lean()
            teamHashes = aUserTeams.map(team => team?.sHash)
            aUserLeague = aUserLeague.map(userleague => {
              const iUserTeamId = aUserTeams[aUserTeams.findIndex(userteam => userteam._id.toString() === userleague.iUserTeamId.toString())]
              return { ...userleague, iUserTeamId }
            })
          }

          const uniqueHashes = [...new Set(teamHashes)]
          let teams
          teams = await MatchTeamsModel.find({ sHash: { $in: uniqueHashes } }, { aPlayers: 1, sHash: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.iTeamId', select: ['sName'] }]).lean()
          if (!teams.length) teams = await BackUpMatchTeamsModel.find({ sHash: { $in: uniqueHashes } }, { aPlayers: 1, sHash: 1, _id: 0 }).populate([{ path: 'aPlayers.iMatchPlayerId', select: ['sName', 'nFantasyCredit', 'eRole'] }, { path: 'aPlayers.iTeamId', select: ['sName'] }]).lean()
          const aData = aUserLeague.map((userLeague) => {
            const iUserTeamId = userLeague.iUserTeamId
            const team = teams[teams.findIndex((t) => t.sHash === iUserTeamId.sHash)]
            delete iUserTeamId.sHash
            return { ...userLeague, nSr_no: nCount++, aPlayers: team.aPlayers, iUserTeamId: iUserTeamId._id, iCaptainId: iUserTeamId.iCaptainId, iViceCaptainId: iUserTeamId.iViceCaptainId }
          })

          const sFileName = `${req.params.id}_${nFile}`
          const sPath = config.s3MatchLeagueReport
          const sContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          const sDeposition = `filename=${matchLeague.sName}_${nFile}.xlsx`

          const file = await createXlsxFile(schema, aData, sFileName)

          const sUrl = await bucket.putObject({ sFileName: file.filename, sContentType, path: sPath, fileStream: file.content, sDeposition })
          aUrl.push(sUrl.Key)
          await MatchLeagueModel.updateOne({ _id: ObjectId(req.params.id) }, { eReportStatus: 'S', aReportUrl: aUrl })
        })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cuserLeague), data: matchLeague })
    } catch (error) {
      catchError('UserLeague.generateMatchLeagueReport', error, req, res)
    }
  }
}

module.exports = new UserLeague()
