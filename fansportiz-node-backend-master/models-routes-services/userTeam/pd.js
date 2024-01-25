const UserModel = require('../user/model')
const MatchModel = require('../match/model')
const PlayerRoleModel = require('../playerRoles/model')
const UserLeagueModel = require('../userLeague/model')
const MyMatchesModel = require('../myMatches/model')
const MatchTeamsModel = require('../matchTeams/model')
const MatchLeagueModel = require('../matchLeague/model')
const StatisticsModel = require('../user/statistics/model')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { handleCatchError, getStatisticsSportsKey, convertToDecimal, getMatchLeagueStatus, catchError } = require('../../helper/utilities.services')
const { bAllowDiskUse } = require('../../config/config')
const { queuePush, queuePop } = require('../../helper/redis')
const userBalanceServices = require('../userBalance/services')
const { GamesDBConnect } = require('../../database/mongoose')
const matchLeagueServices = require('../matchLeague/services')

// Prize distribution for match
async function prizeDistribution(req, res) {
  try {
    const LeagueData = await MatchLeagueModel.find({
      iMatchId: ObjectId(req.params.id),
      bCancelled: false
    }, { _id: 1 }).lean()

    await checkCancellableContest(ObjectId(req.params.id))

    const leagueId = LeagueData.map(({ _id }) => _id)

    const [nJoinedUsers, nRankCalculated] = await Promise.all([
      UserLeagueModel.countDocuments({
        iMatchId: ObjectId(req.params.id),
        iMatchLeagueId: { $in: leagueId },
        bCancelled: false
      }, { readPreference: 'primary' }),
      UserLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), iMatchLeagueId: { $in: leagueId }, bCancelled: false, bRankCalculated: true })
    ])

    if (nJoinedUsers !== nRankCalculated) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].rank_calculate_error })

    const matchLeague = await MatchLeagueModel.find({ iMatchId: req.params.id, bCancelled: false, bPrizeDone: false, bWinningDone: false }, { aLeaguePrize: 1, iMatchId: 1, _id: 1, nJoined: 1, nMax: 1, bPoolPrize: 1, nPrice: 1, nDeductPercent: 1, bPrivateLeague: 1, nTotalPayout: 1, nWinnersCount: 1, nAdminCommission: 1, nCreatorCommission: 1 }).lean()
    matchLeague.map((league) => queuePush('MatchLeagueRank', league))

    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cBackgroundProcess.replace('##', messages[req.userLanguage].cprizeDistribution) })
  } catch (error) {
    catchError('UserTeam.prizeDistribution', error, req, res)
  }
}

// Generate team rank in matchleague
async function generateUserTeamRank(req, res) {
  try {
    const LeagueData = await MatchLeagueModel.find({
      iMatchId: ObjectId(req.params.id),
      bCancelled: false
    }, { _id: 1 }).lean()

    const leagueId = LeagueData.map(({ _id }) => _id)

    const [nJoinedUsers, nPointCalculated] = await Promise.all([
      UserLeagueModel.countDocuments({
        iMatchId: ObjectId(req.params.id),
        iMatchLeagueId: { $in: leagueId },
        bCancelled: false
      }, { readPreference: 'primary' }),
      UserLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), iMatchLeagueId: { $in: leagueId }, bCancelled: false, bPointCalculated: true })
    ])
    if (nJoinedUsers !== nPointCalculated) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].point_calculate_error })

    const matchLeague = await MatchLeagueModel.find({ iMatchId: req.params.id, bCancelled: false, bPrizeDone: false }, { iMatchId: 1 }).lean()
    matchLeague.map(league => queuePush('MatchLeague', { ...league, bRankCalculateFlag: true }))

    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cBackgroundProcess.replace('##', messages[req.userLanguage].cteamRankCalculate) })
  } catch (error) {
    catchError('UserTeam.generateUserTeamRank', error, req, res)
  }
}

// Generate team score for match
async function generateUserTeamScore(req, res) {
  try {
    const match = await MatchModel.findOne({ _id: req.params.id, dStartDate: { $lte: new Date() }, eStatus: { $in: ['CMP', 'I'] } }, { eCategory: 1 }).lean()
    if (!match) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].match_not_complete })

    const points = await PlayerRoleModel.findOne({ eCategory: match.eCategory }, { nCaptainPoint: 1, nViceCaptainPoint: 1 }).lean()
    if (!points) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].error_with.replace('##', messages[req.userLanguage].cpoints) })

    await checkCancellableContest(match._id)

    const data = await MatchTeamsModel.find({ iMatchId: req.params.id }, { iMatchId: 1, sHash: 1, eCategory: 1 }).lean()
    data.forEach((d) => queuePush('MatchTeams', d))

    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cBackgroundProcess.replace('##', messages[req.userLanguage].cteamScoreCalculate) })
  } catch (error) {
    catchError('UserTeam.generateUserTeamScore', error, req, res)
  }
}

// Distribute win amount for contest
async function winDistributionByLeague(req, res) {
  try {
    const [nTotalLeague, nPrizeCalculated] = await Promise.all([
      MatchLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), bCancelled: false }),
      MatchLeagueModel.countDocuments({ iMatchId: ObjectId(req.params.id), bPrizeDone: true })
    ])

    if (nTotalLeague !== nPrizeCalculated) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].prize_calculate_error })

    const matchLeague = await MatchLeagueModel.find({ iMatchId: req.params.id, bCancelled: false, bPrizeDone: true, bWinningDone: false }, { aLeaguePrize: 1, iMatchId: 1, eCategory: 1, _id: 1, bPrivateLeague: 1, nCreatorCommission: 1, iUserId: 1, sName: 1, nLoyaltyPoint: 1 }).lean()
    if (!matchLeague.length) {
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].win_dist_exist })
    }

    matchLeague.forEach(league => queuePush('MatchLeagueWin', league))

    await MatchModel.updateOne({ _id: ObjectId(req.params.id) }, { dWinDistAt: new Date() })

    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cBackgroundProcess.replace('##', messages[req.userLanguage].winPrizeDistribution) })
  } catch (error) {
    catchError('UserTeam.winDistributionByLeague', error, req, res)
  }
}
async function winReturn(req, res) {
  try {
    const matchLeague = await MatchLeagueModel.find({ iMatchId: req.params.id, bCancelled: false, bWinningDone: true }, { _id: 1, sName: 1, bPrivateLeague: 1, iUserId: 1, aLeaguePrize: 1, iMatchId: 1, eCategory: 1, nCreatorCommission: 1 }).lean()
    matchLeague.map(async (league) => queuePush('winReturn', league))

    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].cBackgroundProcess.replace('##', messages[req.userLanguage].cwinReturn) })
  } catch (error) {
    catchError('UserTeam.winReturn', error, req, res)
  }
}

async function checkCancellableContest(iMatchId) {
  try {
    const matchLeagues = await MatchLeagueModel.find({ iMatchId, bCancelled: false, bPrizeDone: false }).lean()
    for (const league of matchLeagues) {
      const nJoined = await UserLeagueModel.countDocuments({ iMatchLeagueId: league._id }, { readPreference: 'primary' })
      league.nJoined = nJoined

      const uniqueUserJoin = await UserLeagueModel.aggregate([
        {
          $match: { iMatchLeagueId: ObjectId(league._id) }
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
      ]).allowDiskUse(bAllowDiskUse).exec()
      const uniqueUserJoinCount = (uniqueUserJoin.length) ? uniqueUserJoin[0].nJoinedCount : 0

      const leagueStatus = await getMatchLeagueStatus(league, uniqueUserJoinCount)
      if (leagueStatus === 'PLAY_RETURN') {
        await matchLeagueServices.processPlayReturn(league, 'MATCHLEAGUE', null, '', 'MATCH PD CHECK', league.nJoined, uniqueUserJoinCount)
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

async function winReturnByLeagueV2() {
  let data
  try {
    data = await queuePop('winReturn')
    if (!data) {
      setTimeout(() => { winReturnByLeagueV2() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { _id, sName, bPrivateLeague, iUserId, eCategory, iMatchId, nLoyaltyPoint, nCreatorCommission } = data

    const matchCategory = getStatisticsSportsKey(eCategory)

    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' }
    }

    let bShouldProcessFull = true
    const projection = { _id: 1, nPrice: 1, nBonusWin: 1, iUserId: 1, sMatchName: 1, sUserName: 1, iMatchLeagueId: 1, iMatchId: 1, eType: 1, eCategory: 1 }

    UserLeagueModel.find({ $or: [{ nPrice: { $gt: 0 } }, { nBonusWin: { $gt: 0 } }, { 'aExtraWin.0': { $exists: true } }], iMatchLeagueId: ObjectId(_id) }).select(projection).lean().cursor()
      .on('data', async (userLeague) => {
        if (bShouldProcessFull) {
          const leagueSession = await GamesDBConnect.startSession()
          leagueSession.startTransaction(transactionOptions)

          try {
            if (userLeague.nPrice > 0 || userLeague.nBonusWin > 0) {
              await userBalanceServices.winReturn(userLeague)
            }
            await UserLeagueModel.updateOne({ _id: ObjectId(userLeague._id) }, { nPrice: 0, aExtraWin: [], nBonusWin: 0, bPrizeCalculated: false, bWinDistributed: false }).session(leagueSession)
            await StatisticsModel.updateOne({ iUserId: ObjectId(userLeague.iUserId) }, {
              $inc: {
                [`${matchCategory}.nWinCount`]: -1,
                [`${matchCategory}.nWinAmount`]: -convertToDecimal(userLeague.nPrice),
                nWinnings: -convertToDecimal(userLeague.nPrice),
                nTotalWinReturn: convertToDecimal(userLeague.nPrice)
              }
            }, { upsert: true }).session(leagueSession)

            await MyMatchesModel.updateOne({ iMatchId: ObjectId(iMatchId), iUserId: userLeague.iUserId }, { $inc: { nWinnings: -convertToDecimal(userLeague.nPrice) } }).session(leagueSession)

            await leagueSession.commitTransaction()
          } catch (error) {
            handleCatchError(error)
            await leagueSession.abortTransaction()
            bShouldProcessFull = false
          } finally {
            await leagueSession.endSession()
          }
        }
      }).on('end', async () => {
        const session = await GamesDBConnect.startSession()
        session.startTransaction(transactionOptions)

        try {
          if (bShouldProcessFull) {
            if (nLoyaltyPoint > 0) {
              //* Temporarily removed transaction from these queries
              const userLeagues = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(_id), bCancelled: false }, { iUserId: 1 }).lean()
              const userIds = userLeagues.map((ul) => ObjectId(ul.iUserId))
              await UserModel.updateMany({ _id: { $in: userIds } }, { $inc: { nLoyaltyPoints: -(nLoyaltyPoint) } })
            }
            if (bPrivateLeague) {
              await userBalanceServices.creatorBonusReturn({ iUserId, _id, sLeagueName: sName, iMatchId, eCategory })

              await StatisticsModel.updateOne({ iUserId: ObjectId(iUserId) }, {
                $inc: {
                  [`${matchCategory}.nCreatePLeagueSpend`]: -nCreatorCommission,
                  nCash: -nCreatorCommission,
                  nWinnings: -nCreatorCommission,
                  nTotalWinnings: -nCreatorCommission,
                  nActualDepositBalance: -nCreatorCommission,
                  nActualWinningBalance: -convertToDecimal(nCreatorCommission),
                  nActualBonus: -convertToDecimal(nCreatorCommission)
                }
              }, { upsert: true }).session(session)
            }
            await MatchLeagueModel.updateOne({ _id: ObjectId(_id) }, { bPrizeDone: false, bWinningDone: false }).session(session)
          }

          await session.commitTransaction()
        } catch (error) {
          handleCatchError(error)
          await session.abortTransaction()
        } finally {
          await session.endSession()
        }
      })

    winReturnByLeagueV2()
  } catch (error) {
    await queuePush('dead:winReturn', data)
    handleCatchError(error)
    winReturnByLeagueV2()
  }
}

module.exports = {
  prizeDistribution,
  generateUserTeamRank,
  generateUserTeamScore,
  winReturn,
  winReturnByLeagueV2,
  winDistributionByLeague
}
