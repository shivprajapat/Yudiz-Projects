const UserLeagueModel = require('./model')
const MyMatchesModel = require('../myMatches/model')
const { handleCatchError } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const userBalanceServices = require('../userBalance/services')
const PromocodeStatisticModel = require('../promocode/statistics/model')
const { GamesDBConnect } = require('../../database/mongoose')
const MatchLeagueModel = require('../matchLeague/model')
const { redisClient } = require('../../helper/redis')
const { normalCopyBotJoin } = require('./copybotService')
const { getAdmintokenAndId } = require('./findAdminDepositToken')
const { messages } = require('../../helper/api.responses')

/**
 * It'll do join league team wise
 * @param { Object } data
 * @returns { Object } of status isSuccess true or false according team joined league or not
 */
async function joinLeagueTeamWise(data) {
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' }
  }

  const session = await GamesDBConnect.startSession()
  session.startTransaction(transactionOptions)

  try {
    const { matchLeague, iUserTeamId, iUserId, iMatchLeagueId, iPromocodeId, nPromoDiscount, team, upcomingMatch, ePlatform, user, sType, sPromocode, nJoinPrice, bAfterMinJoin } = data
    const { iMatchId, nTotalPayout, bPoolPrize, sPayoutBreakupDesign, sName, nBonusUtil, bPrivateLeague } = matchLeague
    let { nPrice } = matchLeague
    const nOriginalPrice = nPrice

    nPrice = (nPromoDiscount) ? nPrice - nPromoDiscount : nPrice
    const [d] = await UserLeagueModel.create([{ iUserTeamId, iUserId, eType: user.eType, eCategory: upcomingMatch.eCategory, iMatchLeagueId, iMatchId, nTotalPayout, nPoolPrice: bPoolPrize, sPayoutBreakupDesign, sTeamName: team, sMatchName: upcomingMatch.sName, sLeagueName: sName, sUserName: user.sUsername, ePlatform, sProPic: user.sProPic, nOriginalPrice, iPromocodeId, nPromoDiscount, nPricePaid: nPrice, sType, bAfterMinJoin }], { session: session })

    const response = await userBalanceServices.userPlayDeduction({ iUserId, iUserLeagueId: d._id, iMatchLeagueId, iMatchId, nPrice, nBonusUtil, sMatchName: upcomingMatch.sName, sUserName: user.sUsername, eType: user.eType, eCategory: upcomingMatch.eCategory, sPromocode, bPrivateLeague, nJoinPrice, nPromoDiscount, iUserTeamId })
    if (response && !response.isSuccess) {
      await session.abortTransaction()
      session.endSession()
      return { nAmount: response.nPrice, isSuccess: false }
    }

    if (nPromoDiscount) {
      await PromocodeStatisticModel.create([{ iUserId, iPromocodeId, nAmount: nPromoDiscount, sTransactionType: 'MATCH', iMatchId, iMatchLeagueId, iUserLeagueId: d._id }], { session: session })
    }

    const myMatch = await MyMatchesModel.findOne({ iUserId, iMatchId }, null, { session, readPreference: 'primary' }).lean()
    if (myMatch) {
      const isLeagueExist = myMatch.aMatchLeagueId.some((matchLeagueId) => matchLeagueId.toString() === iMatchLeagueId.toString())
      if (!isLeagueExist) {
        await MyMatchesModel.updateOne({ _id: ObjectId(myMatch._id) }, { $inc: { nJoinedLeague: 1 }, $addToSet: { aMatchLeagueId: iMatchLeagueId }, $set: { dStartDate: upcomingMatch.dStartDate } }, { upsert: true })
      }
    } else {
      await MyMatchesModel.create([{ iUserId, iMatchId, iSeasonId: upcomingMatch.iSeasonId, dStartDate: upcomingMatch.dStartDate, nJoinedLeague: 1, aMatchLeagueId: iMatchLeagueId, nWinnings: 0, eMatchStatus: upcomingMatch.eStatus, eCategory: upcomingMatch.eCategory }])
    }
    await session.commitTransaction()
    session.endSession()
    return { isSuccess: true }
  } catch (error) {
    handleCatchError(error)
    await session.abortTransaction()
    session.endSession()
    return { isSuccess: false }
  }
}

async function joinLeague(payload) {
  try {
    let nJoinSuccess = 0
    let nAmount = 0
    let bDoCopyBot = false
    let token = null
    let teamCount = ''
    let iAdminId = ''
    const { remainTeams, nPromoDiscount, matchLeague, actualUserJoined, sPromo, iUserId, iMatchLeagueId, upcomingMatch, ePlatform, iPromocodeId, user, userType, nTotalTeam, aErrors, lang } = payload
    const { bBotCreate, nMinTeamCount, bCopyBotInit = '', nCopyBotsPerTeam = '' } = matchLeague

    for (const remainTeam of remainTeams) {
      const nJoinPrice = (nPromoDiscount) ? matchLeague.nPrice - nPromoDiscount : matchLeague.nPrice
      const sPromocode = nPromoDiscount ? sPromo : ''

      const bAfterMinJoin = (actualUserJoined + nJoinSuccess) > nMinTeamCount
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
          if (nCopyBotsPerTeam) teamCount = nCopyBotsPerTeam // 7
          // nMinTeamCount -> 2
          if (bBotCreate === true && bAfterMinJoin && nMinTeamCount) {
            const adminData = await getAdmintokenAndId()
            if (adminData) {
              token = adminData.token
              iAdminId = adminData.iAdminId
            }
            const payload = {
              nCopyBotsPerTeam,
              token,
              iAdminId,
              iMatchId: matchLeague.iMatchId,
              iMatchLeagueId,
              iUserId,
              iUserTeamId: remainTeam.iUserTeamId,
              bDoCopyBot,
              bCopyBotInit
            }
            bDoCopyBot = await normalCopyBotJoin(payload)
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
          else message = messages[lang].add_success.replace('##', messages[lang].cuserJoined)
          return { isSuccess: false, message, data: responseData }
        }
      }
    }
    return { teamCount, iAdminId, token, nJoinSuccess, bDoCopyBot, bCopyBotInit, nAmount }
  } catch (e) {
    handleCatchError(e)
  }
}

module.exports = {
  joinLeagueTeamWise,
  joinLeague
}
