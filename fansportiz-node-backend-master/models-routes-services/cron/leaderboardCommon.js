const PlayerRoleModel = require('../playerRoles/model')
const { handleCatchError, getStatisticsSportsKey } = require('../../helper/utilities.services')
const { queuePush, queuePop, redisClient2, checkTeamJoined, redisClient, queueLen, bulkQueuePop } = require('../../helper/redis')
const UserBalanceModel = require('../userBalance/model')
const { Op, fn, col } = require('sequelize')
const db = require('../../database/sequelize')
const { soccerScorePointByEntitySport, soccerScorePointBySportsRadar, cricketScorePointByEntitySport, cricketScorePointBySportsRadar, kabaddiScorePointByEntitySport, basketballScorePointByEntitySport } = require('../scorePoint/common')
const StatisticsModel = require('../user/statistics/model')
const config = require('../../config/config')
const { bAllowDiskUse, CACHE_2, CACHE_1, CACHE_8 } = config
const { APP_LANG } = require('../../config/common')
const ObjectId = require('mongoose').Types.ObjectId
const SeriesLeaderBoardModel = require('../seriesLeaderBoard/model')
const FullScorecardsModel = require('../scorecard/model')
const MatchLeagueModel = require('../matchLeague/model')
const UserModel = require('../user/model')
const MatchModel = require('../match/model')
const UserLeagueModel = require('../userLeague/model')
const UserTeamModel = require('../userTeam/model')
const MyMatchesModel = require('../myMatches/model')
const MatchTeamsModel = require('../matchTeams/model')
const MatchPlayerModel = require('../matchPlayer/model')
const PassbookModel = require('../passbook/model')
const pendingMatchModel = require('../match/pendingMatch.model')
const { convertToDecimal } = require('../../helper/utilities.services')
const PromocodeStatisticsModel = require('../promocode/statistics/model')
const { GamesDBConnect } = require('../../database/mongoose')
const settingServices = require('../setting/services')
const userBalanceSerices = require('../userBalance/services')
const { messages, status, jsonStatus } = require('../../helper/api.responses')

async function ProcessScorePoint (oMatchPoint) {
  try {
    if (oMatchPoint.isSuccess) {
      const points = await PlayerRoleModel.findOne({ eCategory: oMatchPoint.eCategory }, { nCaptainPoint: 1, nViceCaptainPoint: 1 }).lean().cache(CACHE_2, `playerRole:${oMatchPoint.eCategory}`)
      if (!points) return

      const isPointCalculated = await calculateTotalScorePoint(oMatchPoint._id, oMatchPoint.eCategory, oMatchPoint.eStatus)
      if (!isPointCalculated.isSuccess) {
        console.log('USER TEAM POINT NOT CALCULATED FOR THIS MATCH:', oMatchPoint.sName, oMatchPoint.eCategory)
      }
    } else {
      console.log('POINT NOT CALCULATED FOR THIS MATCH:', oMatchPoint.sName, oMatchPoint.eCategory)
    }
  } catch (error) {
    return handleCatchError(error)
  }
}

async function invokeAutoFillQueue(aQueue) {
  try {
    const aPromises = aQueue.map(async (sQueue) => {
      const nQueueLen = await queueLen(sQueue)
      let nTotal = Number(nQueueLen)

      while (nTotal > 0) {
        let data = await bulkQueuePop(sQueue, 100)
        data = data.map(d => JSON.parse(d))

        await Promise.all(data.map((team) => join(team)))
        nTotal -= 100
      }
    })
    await Promise.all(aPromises)
  } catch (error) {
    handleCatchError(error)
  }
}

async function join(payload) {
  let session
  try {
    const { iUserId, iUserTeamId, iMatchLeagueId, bPrivateLeague = false, sType = 'B', iBotLogId } = payload

    const bAlreadyJoined = await checkTeamJoined(iUserId, iUserTeamId, iMatchLeagueId)
    if (bAlreadyJoined === 'EXIST') return { bSuccess: false, status: jsonStatus.BadRequest, message: messages.English.user_already_joined, data: { type: 'redis_user_already_joined' } }

    const query = { _id: ObjectId(iMatchLeagueId), bCancelled: false, bPrivateLeague: false }

    const matchLeague = await MatchLeagueModel.findOne(query, { nAutoFillSpots: 0, bCopyBotInit: 0, dCreatedAt: 0, dUpdatedAt: 0, sShareCode: 0, bIsProcessed: 0, bPlayReturnProcess: 0, sFairPlay: 0, bWinningDone: 0, bPrizeDone: 0, sShareLink: 0, bCopyLeague: 0, iUserId: 0 }, { readPreference: 'primary' }).lean().cache(CACHE_2, `matchLeague:${iMatchLeagueId}:privateLeguae:${bPrivateLeague}`)
    if (!matchLeague) return { bSuccess: false, status: jsonStatus.NotFound, message: messages.English.not_exist.replace('##', messages.English.cmatchLeague) }

    const user = await UserModel.findById(iUserId, { eType: 1, sUsername: 1, sProPic: 1 }).lean()
    if (matchLeague.bInternalLeague === true) {
      return {
        bSuccess: false,
        status: jsonStatus.BadRequest,
        message: messages.English.league_join_err
      }
    }

    const upcomingMatch = await MatchModel.findOne({ _id: matchLeague.iMatchId, eStatus: 'U', dStartDate: { $gt: new Date() } }).lean().cache(CACHE_1, `match:${matchLeague.iMatchId}`)
    if (!upcomingMatch) return { bSuccess: false, status: jsonStatus.BadRequest, message: messages.English.match_started }

    if (matchLeague.bMultipleEntry) {
      const multiTeam = await UserLeagueModel.countDocuments({ iMatchLeagueId: matchLeague._id, iUserId }, { readPreference: 'primary' })
      if (!matchLeague.bMultipleEntry && multiTeam > 0) return { bSuccess: false, status: jsonStatus.BadRequest, message: messages.English.multiple_join_err }

      if (matchLeague.nTeamJoinLimit <= multiTeam) return { bSuccess: false, status: jsonStatus.BadRequest, message: messages.English.team_join_limit_err, type: 'team_join_limit_err' }
    }

    const sameTeam = await UserLeagueModel.findOne({ iMatchLeagueId: matchLeague._id, iUserId, iUserTeamId }, { _id: 1 }, { readPreference: 'primary' }).lean()
    if (sameTeam) return { bSuccess: false, status: jsonStatus.BadRequest, message: messages.English.user_already_joined, data: { type: 'user_already_joined' } }

    const team = await UserTeamModel.findOne({ iMatchId: matchLeague.iMatchId, _id: ObjectId(iUserTeamId), iUserId }, null, { readPreference: 'primary' }).lean()
    if (!team) return { bSuccess: false, status: jsonStatus.NotFound, message: messages.English.not_exist.replace('##', messages.English.cteam) }

    matchLeague.nJoined = await redisClient.incr(`${matchLeague._id}`)

    if (!matchLeague.bUnlimitedJoin && (matchLeague.nJoined > matchLeague.nMax)) {
      await Promise.all([
        redisClient.incr(`mlFull:${matchLeague._id}`),
        redisClient.expire(`mlFull:${matchLeague._id}`, 24 * 60 * 60),
        redisClient.decr(`${matchLeague._id}`)
      ])
      return { bSuccess: false, status: jsonStatus.BadRequest, message: messages.English.league_full }
    }

    const ePlatform = 'O'
    let result

    const nJoinPrice = matchLeague.nPrice
    try {
      const { iMatchId, nTotalPayout, bPoolPrize, sPayoutBreakupDesign, sName, nBonusUtil } = matchLeague
      const { nPrice } = matchLeague
      const nOriginalPrice = nPrice

      let userType
      if (user.eType === 'B') {
        if (['CP', 'CB'].includes(sType)) {
          userType = 'CB'
        } else if (sType === 'CMB') {
          userType = 'CMB'
        } else {
          userType = 'B'
        }
      } else {
        userType = 'U'
      }
      const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
      }
      session = await GamesDBConnect.startSession()
      session.startTransaction(transactionOptions)
      const [data] = await UserLeagueModel.create([{ iUserTeamId, iUserId, iMatchLeagueId, iMatchId, nTotalPayout, nPoolPrice: bPoolPrize, sPayoutBreakupDesign, sTeamName: team.sName, sMatchName: upcomingMatch.sName, sLeagueName: sName, sUserName: user.sUsername, eType: userType, ePlatform, sProPic: user.sProPic, nOriginalPrice, nPricePaid: nPrice, eCategory: upcomingMatch.eCategory, sType }]).session(session)

      result = data
      if (nPrice > 0) {
        const response = await userBalanceSerices.userPlayDeduction({ iUserId, iUserLeagueId: data._id, iMatchLeagueId, iMatchId, nPrice, nBonusUtil, sMatchName: upcomingMatch.sName, sUserName: user.sUsername, eType: user.eType, eCategory: upcomingMatch.eCategory, bPrivateLeague, nJoinPrice, iUserTeamId })
        if (!response || typeof response !== 'object') {
          await session.abortTransaction()
          await Promise.all([redisClient.decr(`${matchLeague._id}`), UserLeagueModel.deleteOne({ _id: data._id })])
          return { bSuccess: false, status: jsonStatus.BadRequest, message: messages.English.insuff_balance.replace('##', messages.English.cjoinLeague2), data: { nAmount: nPrice } }
        }
        if (!response.isSuccess) {
          await session.abortTransaction()
          await Promise.all([redisClient.decr(`${matchLeague._id}`), UserLeagueModel.deleteOne({ _id: data._id })])
          return { bSuccess: false, status: jsonStatus.BadRequest, message: messages.English.insuff_balance.replace('##', messages.English.cjoinLeague2), data: { nAmount: response.nPrice } }
        }
      }
      await session.commitTransaction()
      const myMatch = await MyMatchesModel.findOne({ iUserId, iMatchId }).select({ aMatchLeagueId: 1 }).lean()

      if (myMatch) {
        const isLeagueExist = myMatch.aMatchLeagueId.some((matchLeagueId) => matchLeagueId.toString() === iMatchLeagueId.toString())
        if (!isLeagueExist) {
          await MyMatchesModel.updateOne({ _id: ObjectId(myMatch._id) }, { $inc: { nJoinedLeague: 1 }, $addToSet: { aMatchLeagueId: iMatchLeagueId }, $set: { dStartDate: upcomingMatch.dStartDate } }, { upsert: true })
        }
      } else {
        await MyMatchesModel.create([{ iUserId, iMatchId, nJoinedLeague: 1, dStartDate: upcomingMatch.dStartDate, aMatchLeagueId: iMatchLeagueId, nWinnings: 0, eMatchStatus: upcomingMatch.eStatus, eCategory: upcomingMatch.eCategory }])
      }
    } catch (error) {
      handleCatchError(error, 'Cron.join')
      await session.abortTransaction()
      await Promise.all([redisClient.decr(`${matchLeague._id}`), UserLeagueModel.deleteOne({ _id: result._id })])
      return { bSuccess: false, status: status.InternalServerError, message: messages.English.error }
    }

    const aPromises = [MatchLeagueModel.updateOne({ _id: ObjectId(matchLeague._id) }, { $inc: { nJoined: 1 } })]
    // if (iBotLogId) aPromises.push(BotLogModel.updateOne({ _id: ObjectId(iBotLogId) }, { $inc: { nSuccess: 1 } }))
    if (iBotLogId) aPromises.push(queuePush('BOTLOGS_UPDATE_COUNT', { id: iBotLogId.toString(), nSuccessCount: 1 }))
    await Promise.all(aPromises)

    if ((Number(matchLeague.nMax) === Number(matchLeague.nJoined)) && matchLeague.bAutoCreate === true && matchLeague.bUnlimitedJoin === false) {
      await queuePush('autoCreateLeague', matchLeague)
    }

    result.eType = undefined
    result.sType = undefined
    return { bSuccess: true, status: jsonStatus.OK, message: messages.English.successfully.replace('##', messages.English.cuserJoined), data: result }
  } catch (error) {
    await session.abortTransaction()
    handleCatchError(error, 'Cron.join')
    return { bSuccess: false, status: status.InternalServerError, message: messages.English.error }
  } finally {
    await session.endSession()
  }
}

/**
   * This will caluculate the score points of cricket according to match provider.
   * @param {*} match match related data
   * @returns this will return success if successfully score point calculated otherwise return false.
   */
async function calculateScorePointCricket(match) {
  const { eProvider, _id, sName, eCategory, eStatus } = match
  let result
  if (eProvider === 'ENTITYSPORT') {
    result = await cricketScorePointByEntitySport(match, 'English')
  } else if (eProvider === 'SPORTSRADAR') {
    result = await cricketScorePointBySportsRadar(match, 'English')
  } else {
    result = { isSuccess: false }
  }
  if (!result.isSuccess) {
    return { isSuccess: false, _id, sName, eCategory, eStatus }
  } else {
    return { isSuccess: true, _id, sName, eCategory, eStatus }
  }
}

/**
   * This will caluculate the score points of soccer according to match provider.
   * @param {*} match match related data
   * @returns this will return success if successfully score point calculated otherwise return false.
   */
async function calculateScorePointFootball(match) {
  const { eProvider, _id, sName, eCategory, eStatus } = match
  let result
  if (eProvider === 'ENTITYSPORT') {
    result = await soccerScorePointByEntitySport(match, 'English')
  } else if (eProvider === 'SPORTSRADAR') {
    result = await soccerScorePointBySportsRadar(match, 'English')
  } else {
    result = { isSuccess: false }
  }
  if (!result.isSuccess) {
    return { isSuccess: false, _id, sName, eCategory, eStatus }
  } else {
    return { isSuccess: true, _id, sName, eCategory, eStatus }
  }
}

/**
   * This will caluculate the score points of kabaddi according to match provider.
   * @param {*} match match related data
   * @returns this will return success if successfully score point calculated otherwise return false.
   */
async function calculateScorePointKabaddi(match) {
  const { eProvider, _id, sName, eCategory, eStatus } = match
  let result
  if (eProvider === 'ENTITYSPORT') {
    result = await kabaddiScorePointByEntitySport(match)
  }
  if (!result.isSuccess) {
    return { isSuccess: false, _id, sName, eCategory, eStatus }
  } else {
    return { isSuccess: true, _id, sName, eCategory, eStatus }
  }
}

/**
   * This will caluculate the score points of basketball according to match provider.
   * @param {*} match match related data
   * @returns this will return success if successfully score point calculated otherwise return false.
   */
async function calculateScorePointBasketball(match) {
  const { eProvider, _id, sName, eCategory, eStatus } = match
  let result
  if (eProvider === 'ENTITYSPORT') {
    result = await basketballScorePointByEntitySport(match)
  } else if (eProvider === 'SPORTSRADAR') {
    result = { isSuccess: false }
  } else {
    result = { isSuccess: false }
  }

  if (!result.isSuccess) {
    return { isSuccess: false, _id, sName, eCategory, eStatus }
  } else {
    return { isSuccess: true, _id, sName, eCategory, eStatus }
  }
}

// Calculate total score point for each team
async function calculateTotalScorePoint(iMatchId, eCategory, sMatchStatus) {
  try {
    const [points, matchPlayers] = await Promise.all([
      PlayerRoleModel.findOne({ eCategory: eCategory }, { nCaptainPoint: 1, nViceCaptainPoint: 1 }).lean().cache(CACHE_8, `playerRole:${eCategory}`),
      MatchPlayerModel.find({ iMatchId: iMatchId }, { nScoredPoints: 1 }).lean()
    ])

    const oMatchPlayers = {}
    matchPlayers.forEach((player) => {
      oMatchPlayers[player._id.toString()] = player.nScoredPoints
    })
    const aMatchTeams = await MatchTeamsModel.aggregate([
      { $match: { iMatchId: ObjectId(iMatchId) } },
      { $group: { _id: '$sHash', aPlayers: { $first: '$aPlayers' } } },
      { $sort: { _id: 1 } }
    ]).allowDiskUse(bAllowDiskUse).cursor({ batchSize: 1000 })

    const aMatchTeamHash = []
    const aPromiseUpdatePoint = []
    for await (const matchTeam of aMatchTeams) {
      aMatchTeamHash.push(matchTeam)
      if (aMatchTeamHash.length > 2500) {
        const oData = { aMatchTeamHash: aMatchTeamHash.splice(0, 2500), iMatchId, oMatchPlayers, points, sMatchStatus }
        aPromiseUpdatePoint.push(updatePointInRedis(oData))
      }
    }

    if (aMatchTeamHash.length) {
      const oData = { aMatchTeamHash, iMatchId, oMatchPlayers, points, sMatchStatus }
      aPromiseUpdatePoint.push(updatePointInRedis(oData))
    }

    await Promise.all(aPromiseUpdatePoint)
    console.log('Calculated', iMatchId)

    if (sMatchStatus === 'L') {
      redisClient2.expire(`matchTeams:{${iMatchId}}`, 86400)
      await redisClient2.evalsha('f88598c5398832fdb4bfc609562d1cb3f6eae0e0', 1, iMatchId).then().catch()
    }
    return { isSuccess: true }
  } catch (error) {
    handleCatchError(error)
    return { isSuccess: false }
  }
}

async function processBonusExpire() {
  let data
  const dDate = new Date()
  try {
    data = await queuePop('BonusExpire')
    if (!data) {
      setTimeout(() => { processBonusExpire() }, 2000)
      return
    }

    // Win

    data = JSON.parse(data)
    const { iUserId } = data
    const aTotalBonus = await PassbookModel.findAll({
      where: {
        iUserId: iUserId,
        [Op.or]: [
          { eTransactionType: 'Refer-Bonus' },
          { eTransactionType: 'Bonus' },
          {
            [Op.and]: [
              { eTransactionType: 'Deposit' },
              { nBonus: { [Op.gt]: 0 } }]
          },
          {
            [Op.and]: [
              { eTransactionType: 'Contest-Cashback' }, { nBonus: { [Op.gt]: 0 } }]
          }],
        eType: 'Cr',
        bIsBonusExpired: false,
        dBonusExpiryDate: {
          [Op.lte]: dDate
        }
      },
      order: [['dBonusExpiryDate', 'DESC']]
    })
    const aExpiredId = []
    const nTotalBonus = aTotalBonus.reduce((acc, { nBonus, id }) => {
      aExpiredId.push(id)
      return (acc + nBonus)
    }, 0)
    const aExpiry = aTotalBonus.sort((a, b) => a.dBonusExpiryDate - b.dBonusExpiryDate)
    const dExpiryDate = aExpiry[0].dCreatedAt

    // const sInfo = `Bonus amount of Rs.${nTotalUnusedBonus} has debited due to bonus expiration.`
    const symbol = await settingServices.getCurrencySymbol()
    const sRemarks = messages[APP_LANG].bonus_debited
    const procedureArgument = { replacements: { iId: iUserId, sRemarks1: sRemarks, symbol, dExpiryDate1: dExpiryDate, nTotalBonus1: nTotalBonus } }
    let resp = await db.sequelize.query('CALL bulkBonusExpire(:iId, :sRemarks1, :symbol, :dExpiryDate1, :nTotalBonus1, @nTotalUnusedBonus, @_error, @bSuccess)', procedureArgument)
    if (resp) {
      resp = JSON.parse(JSON.stringify(resp))
      if (resp.length && resp[0].bSuccess) {
        const nTotalUnusedBonus = resp[0].nTotalUnusedBonus
        await Promise.all([
          PassbookModel.update({ bIsBonusExpired: true }, {
            where: {
              id: { [Op.in]: aExpiredId }
            }
          }),
          StatisticsModel.updateOne({ iUserId: ObjectId(iUserId) }, { $inc: { nActualBonus: -convertToDecimal(nTotalUnusedBonus), nTotalBonusExpired: convertToDecimal(nTotalUnusedBonus) } }, { upsert: true })
        ])
      } else {
        throw new Error(resp[0]._error)
      }
    }

    processBonusExpire()
  } catch (error) {
    await queuePush('dead:BonusExpire', data)
    handleCatchError(error)
    setTimeout(() => { processBonusExpire() }, 2000)
  }
}

/**
   * It will give right statistics of user by it's id
   * @param  { string } id
   * @return { object } { nActualDepositBalance, nActualWinningBalance, nActualBonus }
   */
async function fixUserStatistics(id) {
  try {
    // for cash difference
    const totalCashGiven = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Bonus', 'Refer-Bonus', 'Cashback-Contest'] } } })
    const totalCashTaken = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Cashback-Return'] } } })
    const totalCashes = await depositSumPassbook({ iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Deposit' })
    const totalWinWithdraw = await reverseDepositSumPassbook({ iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Withdraw' })
    const totalCashback = await depositSumPassbook({ iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Creator-Bonus' })
    const totalCashbackReturn = await reverseDepositSumPassbook({ iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Creator-Bonus-Return' })
    const totalPlayes = await reverseDepositSumPassbook({ iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Play' })
    const totalPlayesReturn = await depositSumPassbook({ iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Play-Return' })
    // console.log(totalCashGiven, totalCashes, totalCashback, totalPlayesReturn, totalCashTaken, totalCashbackReturn, totalWinWithdraw, totalPlayes)
    const nActualDepositBalance = (totalCashGiven + totalCashes + totalCashback + totalPlayesReturn) - totalCashTaken - totalCashbackReturn - totalWinWithdraw - totalPlayes

    // for winning difference
    const totalWinGiven = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Withdraw-Return', 'Win'] } } })
    const totalcreatorBonus = await winningSumPassbook({ iUserId: id, eTransactionType: 'Creator-Bonus' })
    const totalcreatorBonusReturn = await reverseWinningSumPassbook({ iUserId: id, eTransactionType: 'Creator-Bonus-Return' })
    const totalWin = await winningSumPassbook({ iUserId: id, eTransactionType: 'Deposit' })
    const totalWithdraw = await reverseWinningSumPassbook({ iUserId: id, eTransactionType: 'Withdraw' })
    const totalPlayed = await reverseWinningSumPassbook({ iUserId: id, eTransactionType: 'Play' })
    const totalPlayReturn = await winningSumPassbook({ iUserId: id, eTransactionType: 'Play-Return' })
    const nActualWinningBalance = (totalWin + totalWinGiven + totalcreatorBonus + totalPlayReturn) - totalWithdraw - totalcreatorBonusReturn - totalPlayed

    // for bonus difference
    const totalBonusGiven = await PassbookModel.sum('nBonus', { where: { iUserId: id, nBonus: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Play-Return', 'Bonus', 'Refer-Bonus', 'Cashback-Contest', 'Creator-Bonus', 'Win'] } } })
    const totalBonusTaken = await PassbookModel.sum('nBonus', { where: { iUserId: id, nBonus: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Play', 'Cashback-Return', 'Creator-Bonus-Return', 'Bonus-Expire'] } } })
    const totalBonuses = await bonusSumPassbook({ iUserId: id, nBonus: { [Op.gt]: 0 }, eTransactionType: 'Deposit' })
    const nActualBonus = (totalBonusGiven + totalBonuses) - totalBonusTaken

    // for played cash, bonus total
    const nTotalPlayedCash = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Play' } })
    const nTotalPlayedBonus = await PassbookModel.sum('nBonus', { where: { iUserId: id, nBonus: { [Op.gt]: 0 }, eTransactionType: 'Play' } })

    // for play-return cash, bonus total
    const nTotalPlayReturnCash = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Play-Return' } })
    const nTotalPlayReturnBonus = await PassbookModel.sum('nBonus', { where: { iUserId: id, nBonus: { [Op.gt]: 0 }, eTransactionType: 'Play-Return' } })

    // for total deposit amount
    const totalDeposit = await depositSumPassbook({ iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Deposit', 'Creator-Bonus'] } })
    const nTotalDepositGiven = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Bonus', 'Refer-Bonus', 'Cashback-Contest'] } } })
    const nTotalDepositTaken = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Cashback-Return' } })
    const nDeposits = (totalDeposit + nTotalDepositGiven) - (nTotalDepositTaken)

    // for total bonus amount
    const nTotalBonusGiven = await PassbookModel.sum('nBonus', { where: { iUserId: id, nBonus: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Deposit', 'Bonus', 'Refer-Bonus', 'Cashback-Contest', 'Creator-Bonus', 'Win'] } } })
    const nTotalBonusTaken = await PassbookModel.sum('nBonus', { where: { iUserId: id, nBonus: { [Op.gt]: 0 }, eTransactionType: 'Cashback-Return' } })
    const nBonus = nTotalBonusGiven - nTotalBonusTaken

    // for total withdrawal amount
    const nWithdrawal = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Withdraw' } })
    const nWithdrawalReturn = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: 'Withdraw-Return' } })
    const nWithdraw = nWithdrawal - nWithdrawalReturn

    // for total winning amount
    const nTotalWinningGiven = await winningSumPassbook({ iUserId: id, eTransactionType: 'Deposit' })
    const nTotalWinning = await PassbookModel.sum('nCash', { where: { iUserId: id, nCash: { [Op.gt]: 0 }, eTransactionType: { [Op.in]: ['Win', 'Creator-Bonus'] } } })
    const nTotalWinnings = nTotalWinning + nTotalWinningGiven

    return {
      nActualDepositBalance: nActualDepositBalance || 0,
      nActualWinningBalance: nActualWinningBalance || 0,
      nActualBonus: nActualBonus || 0,
      nDeposits: nDeposits || 0,
      nWithdraw: nWithdraw || 0,
      nTotalWinnings: nTotalWinnings || 0,
      nBonus: nBonus || 0,
      nTotalPlayedCash: nTotalPlayedCash || 0,
      nTotalPlayedBonus: nTotalPlayedBonus || 0,
      nTotalPlayReturnCash: nTotalPlayReturnCash || 0,
      nTotalPlayReturnBonus: nTotalPlayReturnBonus || 0
    }
    // total deposit and withdraw
  } catch (error) {
    handleCatchError(error)
  }
}
const fixRealUserDebugger = async (query) => {
  try {
    const users = await UserModel.find(query, { _id: 1, sUsername: 1 }).sort({ dCreatedAt: 1 }).lean()
    let total = 0
    let iUserId
    let bFlag = false
    let eMatchCategory
    for (const usr of users) {
      const balance = await UserBalanceModel.findOne({ where: { iUserId: usr._id.toString() }, attributes: ['iUserId', 'nCurrentDepositBalance', 'nCurrentWinningBalance', 'nCurrentBonus', 'nTotalBonusEarned', 'nTotalDepositAmount', 'nTotalWithdrawAmount', 'nTotalWinningAmount'], raw: true })
      const stats = await StatisticsModel.findOne({ iUserId: ObjectId(usr._id) }, {}, { readPreference: 'primaryPreferred' }).lean()
      const { nCurrentDepositBalance, nCurrentWinningBalance, nCurrentBonus, nTotalBonusEarned, nTotalDepositAmount, nTotalWithdrawAmount, nTotalWinningAmount } = balance
      bFlag = false
      if (convertToDecimal(nCurrentDepositBalance) !== convertToDecimal(stats.nActualDepositBalance)) {
        console.log('Mismatch in Current Deposit Balance', nCurrentDepositBalance, convertToDecimal(stats.nActualDepositBalance))
        iUserId = usr._id
        bFlag = true
      }
      if (convertToDecimal(nCurrentWinningBalance) !== convertToDecimal(stats.nActualWinningBalance)) {
        console.log('Mismatch in Current Winning Balance', nCurrentWinningBalance, convertToDecimal(stats.nActualWinningBalance))
        iUserId = usr._id
        bFlag = true
      }
      if (convertToDecimal(nCurrentBonus) !== convertToDecimal(stats.nActualBonus)) {
        console.log('Mismatch in Current Bonus', nCurrentBonus, convertToDecimal(stats.nActualBonus))
        iUserId = usr._id
        bFlag = true
      }

      if (convertToDecimal(nTotalBonusEarned) !== convertToDecimal(stats.nBonus)) {
        console.log('Mismatch in Total Bonus Earned', nTotalBonusEarned, convertToDecimal(stats.nBonus))
        iUserId = usr._id
        bFlag = true
      }
      if (convertToDecimal(nTotalDepositAmount) !== convertToDecimal(stats.nDeposits)) {
        console.log('Mismatch in Total Deposit', nTotalDepositAmount, convertToDecimal(stats.nDeposits))
        iUserId = usr._id
        bFlag = true
      }
      if (convertToDecimal(nTotalWithdrawAmount) !== convertToDecimal(stats.nWithdraw)) {
        console.log('Mismatch in Total Withdrawal', nTotalWithdrawAmount, convertToDecimal(stats.nWithdraw))
        iUserId = usr._id
        bFlag = true
      }
      if (convertToDecimal(nTotalWinningAmount) !== convertToDecimal(stats.nTotalWinnings)) {
        console.log('Mismatch in Total Winnings', nTotalWinningAmount, convertToDecimal(stats.nTotalWinnings))
        iUserId = usr._id
        bFlag = true
      }

      const [aTotalMatchesPlayed, aTotalMatchesPlayReturned] = await Promise.all([
        PassbookModel.findAll({ attributes: [['iMatchId', 'matchId']], where: { eTransactionType: 'Play', iUserId: usr._id.toString() }, group: ['iMatchId'], raw: true }),
        PassbookModel.findAll({ attributes: [['iMatchId', 'matchId']], where: { eTransactionType: 'Play-Return', iUserId: usr._id.toString() }, group: ['iMatchId'], raw: true })
      ])
      const aMatchIdsPlayed = aTotalMatchesPlayed.map(match => ObjectId(match?.matchId))
      const aMatchIdsPlayRetured = aTotalMatchesPlayReturned.map(match => ObjectId(match?.matchId))
      let nTotalPlayedCash = 0
      let nTotalPlayedBonus = 0
      let nTotalPlayReturnCash = 0
      let nTotalPlayReturnBonus = 0

      const [aMatchesPlayed, aMatchesPlayReturned] = await Promise.all([
        MatchModel.aggregate([{
          $match: {
            _id: { $in: aMatchIdsPlayed }
          }
        },
        {
          $group: {
            _id: '$eCategory',
            aMatchId: {
              $push: '$_id'
            }
          }
        }
        ]),
        MatchModel.aggregate([{
          $match: {
            _id: { $in: aMatchIdsPlayRetured }
          }
        },
        {
          $group: {
            _id: '$eCategory',
            aMatchId: {
              $push: '$_id'
            }
          }
        }])
      ])

      const updateStatsObject = {}

      for (const matchCategory of aMatchesPlayed) {
        eMatchCategory = getStatisticsSportsKey(matchCategory._id)
        const aStringMatchIdsPlayed = matchCategory?.aMatchId.map(id => id.toString())
        const aTotalPlayed = await PassbookModel.findAll({ attributes: [[fn('sum', col('nCash')), 'totalPlayCash'], [fn('sum', col('nBonus')), 'totalPlayBonus']], where: { eTransactionType: 'Play', iUserId: usr._id.toString(), iMatchId: { [Op.in]: aStringMatchIdsPlayed } }, raw: true })

        nTotalPlayedCash += aTotalPlayed.length ? aTotalPlayed[0]?.totalPlayCash : 0
        nTotalPlayedBonus += aTotalPlayed.length ? aTotalPlayed[0]?.totalPlayBonus : 0
      }

      for (const matchCategory of aMatchesPlayReturned) {
        eMatchCategory = getStatisticsSportsKey(matchCategory._id)
        const aStringMatchIdsPlayReturned = matchCategory?.aMatchId.map(id => id.toString())

        const aTotalPlayReturned = await PassbookModel.findAll({ attributes: [[fn('sum', col('nCash')), 'totalPlayReturnCash'], [fn('sum', col('nBonus')), 'totalPlayReturnBonus']], where: { eTransactionType: 'Play-Return', iUserId: usr._id.toString(), iMatchId: { [Op.in]: aStringMatchIdsPlayReturned } }, raw: true })

        updateStatsObject[`${eMatchCategory}.nPlayReturn`] = aTotalPlayReturned.length ? aTotalPlayReturned[0]?.totalPlayReturnCash : 0
        updateStatsObject[`${eMatchCategory}.nPlayReturn`] += aTotalPlayReturned.length ? aTotalPlayReturned[0]?.totalPlayReturnBonus : 0

        nTotalPlayReturnCash += aTotalPlayReturned.length ? aTotalPlayReturned[0]?.totalPlayReturnCash : 0
        nTotalPlayReturnBonus += aTotalPlayReturned.length ? aTotalPlayReturned[0]?.totalPlayReturnBonus : 0
      }

      if (convertToDecimal(nTotalPlayedCash) !== convertToDecimal(stats.nTotalPlayedCash)) {
        console.log('Mismatch in Total Played Cash', nTotalPlayedCash, convertToDecimal(stats.nTotalPlayedCash))
        iUserId = usr._id
        bFlag = true
      }
      if (convertToDecimal(nTotalPlayedBonus) !== convertToDecimal(stats.nTotalPlayedBonus)) {
        console.log('Mismatch in Total Played Bonus', nTotalPlayedBonus, convertToDecimal(stats.nTotalPlayedBonus))
        iUserId = usr._id
        bFlag = true
      }
      if (convertToDecimal(nTotalPlayReturnCash) !== convertToDecimal(stats.nTotalPlayReturnCash)) {
        console.log('Mismatch in Total Play Return Cash', nTotalPlayReturnCash, convertToDecimal(stats.nTotalPlayReturnCash))
        iUserId = usr._id
        bFlag = true
      }
      if (convertToDecimal(nTotalPlayReturnBonus) !== convertToDecimal(stats.nTotalPlayReturnBonus)) {
        console.log('Mismatch in Total Play Return Bonus', nTotalPlayReturnBonus, convertToDecimal(stats.nTotalPlayReturnBonus))
        iUserId = usr._id
        bFlag = true
      }

      if (convertToDecimal(stats.nTotalPlayReturnCash + stats.nTotalPlayReturnBonus) !== convertToDecimal(nTotalPlayReturnBonus + nTotalPlayReturnCash)) {
        console.log('Mismatch in Total Play Return Statistics', convertToDecimal(nTotalPlayReturnBonus + nTotalPlayReturnCash), convertToDecimal(stats.nTotalPlayReturnCash + stats.nTotalPlayReturnBonus))
        iUserId = usr._id
        bFlag = true
      }

      // console.log('Total Play Return Diff :: ', (convertToDecimal(stats.nTotalPlayReturnCash + stats.nTotalPlayReturnBonus) - convertToDecimal(nPlayReturn)))
      if (iUserId && bFlag) {
        console.log('User is :: ', usr.sUsername)
        console.log('iUserId', iUserId.toString())

        const stats = await fixUserStatistics(iUserId.toString())
        const updateObj = {}

        updateObj.$set = { ...stats, ...updateStatsObject }
        console.log({ updateObj })
        // const updateObj = { $set: { ...stats }, $inc: { updateStatsObject.eMatchCategory.nPlayReturn: (convertToDecimal(stats.nTotalPlayReturnCash + stats.nTotalPlayReturnBonus) - convertToDecimal(nPlayReturn)) } }

        // await StatisticsModel.updateOne({ iUserId: ObjectId(iUserId) }, updateObj, { readPreference: 'primaryPreferred' })
      }

      total++
    }

    console.log('Total Real Users Till Now Scanned ......', total)
  } catch (error) {
    handleCatchError(error)
  }
}

/**
   * It will do sum (nNewDepositBalance - nOldDepositBalance) of all deposits as per condition
   * @param  { object } condition
   * @return { number }
   */
async function depositSumPassbook(condition) {
  try {
    const passbooks = await PassbookModel.findAll({ where: condition, attributes: ['nOldDepositBalance', 'nNewDepositBalance'] })
    let total = 0
    for (const pass of passbooks) {
      const { nNewDepositBalance, nOldDepositBalance } = pass
      const diff = (nNewDepositBalance - nOldDepositBalance)
      total += diff > 0 ? diff : 0
    }
    return total
  } catch (error) {
    handleCatchError(error)
  }
}

/**
   * It will do reverse sum (nOldDepositBalance - nNewDepositBalance) of all deposits as per condition
   * @param  { object } condition
   * @return { number }
   */
async function reverseDepositSumPassbook(condition) {
  try {
    const passbooks = await PassbookModel.findAll({ where: condition, attributes: ['nOldDepositBalance', 'nNewDepositBalance'] })
    let total = 0
    for (const pass of passbooks) {
      const { nNewDepositBalance, nOldDepositBalance } = pass
      const diff = (nOldDepositBalance - nNewDepositBalance)
      total += diff > 0 ? diff : 0
    }
    return total
  } catch (error) {
    handleCatchError(error)
  }
}

/**
   * It will do sum (nNewWinningBalance - nOldWinningBalance) of all winnings as per condition
   * @param  { object } condition
   * @return { number }
   */
async function winningSumPassbook(condition) {
  try {
    const passbooks = await PassbookModel.findAll({ where: condition, attributes: ['nOldWinningBalance', 'nNewWinningBalance'] })
    let total = 0
    for (const pass of passbooks) {
      const { nNewWinningBalance, nOldWinningBalance } = pass
      const diff = (nNewWinningBalance - nOldWinningBalance)
      total += diff > 0 ? diff : 0
    }
    return total
  } catch (error) {
    handleCatchError(error)
  }
}

/**
   * It will do reverse sum (nOldWinningBalance - nNewWinningBalance) of all winnings as per condition
   * @param  { object } condition
   * @return { number }
   */
async function reverseWinningSumPassbook(condition) {
  try {
    const passbooks = await PassbookModel.findAll({ where: condition, attributes: ['nOldWinningBalance', 'nNewWinningBalance'] })
    let total = 0
    for (const pass of passbooks) {
      const { nNewWinningBalance, nOldWinningBalance } = pass
      const diff = (nOldWinningBalance - nNewWinningBalance)
      total += diff > 0 ? diff : 0
    }
    return total
  } catch (error) {
    handleCatchError(error)
  }
}

/**
   * It will do sum (nNewBonus - nOldBonus) of all bonus as per condition
   * @param  { object } condition
   * @return { number }
   */
async function bonusSumPassbook(condition) {
  try {
    const passbooks = await PassbookModel.findAll({ where: condition, attributes: ['nOldBonus', 'nNewBonus'] })
    let total = 0
    for (const pass of passbooks) {
      const { nNewBonus, nOldBonus } = pass
      const diff = (nNewBonus - nOldBonus)
      total += diff > 0 ? diff : 0
    }
    return total
  } catch (error) {
    handleCatchError(error)
  }
}

// eslint-disable-next-line no-unused-vars
async function winMisMatchDetect() {
  try {
    const matchData = await MatchModel.find({ eStatus: { $in: ['CMP', 'I'] } })
    let userLeagueId
    for (const match of matchData) {
      userLeagueId = await UserLeagueModel.find({ iMatchId: match._id, bWinDistributed: true, $or: [{ nPrice: { $gt: 0 } }, { nBonusWin: { $gt: 0 } }] }, { _id: 1 })
      const ids = []
      for (const id of userLeagueId) {
        ids.push(id.toString())
      }
      // const passbookData = await PassbookModel.findAll({ where: { iUserLeagueId: { [Op.notIn]: ids }, iMatchId: match._id.toString() }, attributes: ['iUserLeagueId', 'iMatchId'], raw: true })
    }
  } catch (error) {
    handleCatchError(error)
  }
}

/**
   * This function is used for fixing all users
   * total referrals count { nReferrals } in statistics
   *
   */ // eslint-disable-next-line no-unused-vars
async function fixReferredUsersCount() {
  try {
    await StatisticsModel.updateMany({ eUserType: 'U' }, { nReferrals: 0 })

    const allReferredUsers = await UserModel.find({ iReferredBy: { $ne: null } }, { iReferredBy: 1 }).lean()

    if (allReferredUsers.length) {
      const groupByReferredBy = allReferredUsers.reduce((group, user) => {
        const { iReferredBy } = user
        group[iReferredBy] = group[iReferredBy] || []
        group[iReferredBy].push(user)
        return group
      }, {})

      for (const iUserId of Object.keys(groupByReferredBy)) {
        await StatisticsModel.updateOne({ iUserId }, { $inc: { nReferrals: groupByReferredBy[iUserId].length } })
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

// eslint-disable-next-line no-unused-vars
async function fixDuplicateSeries() {
  try {
    const data = await SeriesLeaderBoardModel.find().lean()
    const duplicateSeries = []

    for (const series of data) {
      const filerData = data.filter((s) => (series.sKey === s.sKey))
      if (filerData.length > 1) {
        duplicateSeries.push(filerData)
      }
    }
    const uniqueSeriesData = duplicateSeries.length ? [...new Map(duplicateSeries.map((item) => [item.sKey, item])).values()] : []

    for (const series of uniqueSeriesData) {
      let iSeriesId
      let iUpdatedSeriesId

      const checkPending = series.find(({ eStatus }) => eStatus === 'P')
      const checkLive = series.find(({ eStatus }) => eStatus !== 'P')
      if (checkPending && checkLive) {
        iSeriesId = checkPending._id
        iUpdatedSeriesId = checkLive._id
      } else {
        iSeriesId = series[0]._id
        iUpdatedSeriesId = series[1]._id
      }

      await pendingMatchModel.updateMany({ iSeriesId }, { iSeriesId: iUpdatedSeriesId })
      await MatchModel.updateMany({ iSeriesId }, { iSeriesId: iUpdatedSeriesId })
      await FullScorecardsModel.updateMany({ iSeriesId }, { iSeriesId: iUpdatedSeriesId })
      await PassbookModel.update({ iSeriesId: iUpdatedSeriesId.toString() }, { where: { iSeriesId: iSeriesId.toString() } })
      await SeriesLeaderBoardModel.deleteOne({ _id: iSeriesId })
    }
  } catch (error) {
    handleCatchError(error)
  }
}

// eslint-disable-next-line no-unused-vars
async function depositDiscountFix() {
  try {
    const data = await PromocodeStatisticsModel.aggregate([{
      $match: {
        sTransactionType: 'DEPOSIT'
      }
    }, {
      $group: {
        _id: '$iUserId',
        nDeposit: {
          $sum: '$nAmount'
        }
      }
    }]).allowDiskUse(bAllowDiskUse)

    for (const user of data) {
      await StatisticsModel.updateOne({ iUserId: user._id }, { nDepositDiscount: user.nDeposit })
    }
  } catch (error) {
    handleCatchError(error)
  }
}

setTimeout(() => {
  processBonusExpire()
}, 2000)

async function updatePointInRedis(data) {
  try {
    const { aMatchTeamHash, iMatchId, oMatchPlayers, points, sMatchStatus } = data
    const aHash = []
    const aBulkMatchTeamPlayer = []
    const aBulkUserTeam = []
    const aBulkUserLeague = []
    const oMatchTeamPoint = {}

    for (const oMatchTeam of aMatchTeamHash) {
      const sHash = oMatchTeam._id
      aHash.push(sHash)

      let totalPoint = 0
      const point = oMatchTeam.aPlayers.map((player) => {
        totalPoint = totalPoint + oMatchPlayers[player.iMatchPlayerId.toString()]
        return { ...player, nScoredPoints: oMatchPlayers[player.iMatchPlayerId.toString()] }
      })

      oMatchTeamPoint[sHash] = totalPoint

      aBulkMatchTeamPlayer.push({
        updateMany: {
          filter: { sHash: sHash },
          update: { $set: { nTotalPoint: totalPoint, aPlayers: point } }
        }
      })
    }

    const teams = await UserTeamModel.find({ iMatchId, sHash: { $in: aHash } }).lean().cache(CACHE_8, `userTeam:calculateTotalScorePoint:${aHash}`)

    const aRedisMatchTeams = []

    for (const team of teams) {
      let nTotalPoints = oMatchTeamPoint[team.sHash] - (oMatchPlayers[team.iViceCaptainId.toString()] + oMatchPlayers[team.iCaptainId.toString()])
      nTotalPoints = nTotalPoints + (oMatchPlayers[team.iViceCaptainId.toString()] * points.nViceCaptainPoint) + (oMatchPlayers[team.iCaptainId.toString()] * points.nCaptainPoint)

      if (sMatchStatus === 'L') {
        if (aRedisMatchTeams.length > 5000) {
          const arrChunk = aRedisMatchTeams.splice(0, 5000)
          await redisClient2.hset(`matchTeams:{${iMatchId}}`, ...arrChunk).then().catch()
        }
        aRedisMatchTeams.push(team._id, nTotalPoints)
      } else {
        aBulkUserTeam.push({
          updateOne: {
            filter: { _id: ObjectId(team._id) },
            update: { $set: { nTotalPoints } }
          }
        })
        aBulkUserLeague.push({
          updateMany: {
            filter: { iUserTeamId: ObjectId(team._id) },
            update: { $set: { nTotalPoints } }
          }
        })
      }
    }

    if (aRedisMatchTeams.length) await redisClient2.hset(`matchTeams:{${iMatchId}}`, ...aRedisMatchTeams).then().catch()

    await Promise.all([
      UserTeamModel.bulkWrite(aBulkUserTeam, { writeConcern: { w: 'majority' }, ordered: false }),
      UserLeagueModel.bulkWrite(aBulkUserLeague, { writeConcern: { w: 'majority' }, ordered: false }),
      MatchTeamsModel.bulkWrite(aBulkMatchTeamPlayer, { writeConcern: { w: 'majority' }, ordered: false })
    ])
  } catch (error) {
    handleCatchError(error)
  }
}
module.exports = {
  ProcessScorePoint,
  invokeAutoFillQueue,
  calculateScorePointCricket,
  calculateScorePointFootball,
  calculateScorePointKabaddi,
  calculateScorePointBasketball,
  fixRealUserDebugger,
  updatePointInRedis
}
