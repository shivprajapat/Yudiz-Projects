const { queuePop, queuePush, redisClient, queueLen, bulkQueuePop, removeMember, addMember, checkTeamExist } = require('../../helper/redis')
const { handleCatchError, pick, getMatchLeagueStatus, randomStr, getBucketName, generateNumber } = require('../../helper/utilities.services')
const { sendMultiCastNotification } = require('../../helper/firebase.services')
const { sendNotification } = require('./notificationQueue')
const config = require('../../config/config')
const pdf = require('html-pdf')
const { bAllowDiskUse, s3UserTeams, THRESHOLD_CODE_QUEUE_LENGTH } = config
const matchLeagueServices = require('../matchLeague/services')
const bucket = require('../../helper/cloudStorage.services')
const { getPrice } = require('../userLeague/common')
const {
  processLeagueJoinReferReward,
  processRegisterBonus,
  processRegisterReferCodeBonus,
  processFirstDepositReferBonus
} = require('../user/common')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const UserModel = require('../user/model')
const UserLeagueModel = require('../userLeague/model')
const UserTeamModel = require('../userTeam/model')
const MatchTeamsModel = require('../matchTeams/model')
const MatchLeagueModel = require('../matchLeague/model')
const SeriesLBUserRankModel = require('../seriesLeaderBoard/seriesLBUserRank.model')
const SeriesLeaderBoardModel = require('../seriesLeaderBoard/model')
const userBalanceServices = require('../userBalance/services')
const CopyTeamLogModel = require('../userLeague/CopyTeamLogModel')
const TransactionLogModel = require('../apiLog/TransactionLog.model')
const PlayerRoleModel = require('../playerRoles/model')
const MatchModel = require('../match/model')
const BackUpMatchTeamsModel = require('../matchTeams/backupMatchTeams.model')
const BackUpUserTeamsModel = require('../userTeam/backupUserTeam.model')
const { TRANSACTION_LOG_BULK_INSERT_SIZE } = require('../../config/common')

async function matchLive() {
  let matchLeague
  try {
    matchLeague = await queuePop('MatchLive')
    if (!matchLeague) {
      setTimeout(() => {
        matchLive()
      }, 2000)
      return
    }
    matchLeague = JSON.parse(matchLeague)
    let { _id, sName, nTotalPayout, nPrice, sFairPlay, nMax, nJoined, bCashbackEnabled, nMinCashbackTeam, nCashbackAmount, eCashbackType, eCategory, iMatchId, bIsProcessed, bCancelled, bUnlimitedJoin } = matchLeague
    nJoined = await UserLeagueModel.countDocuments({ iMatchLeagueId: _id }, { readPreference: 'primary' })
    matchLeague.nJoined = nJoined

    if (!bCancelled) {
      const uniqueUserJoin = await UserLeagueModel.aggregate([
        {
          $match: { iMatchLeagueId: ObjectId(_id) }
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
        await matchLeagueServices.processPlayReturn(matchLeague, 'MATCHLEAGUE', null, '', 'MATCH LIVE CRON', nJoined, uniqueUserJoinCount)
      } else if (leagueStatus === 'LIVE') {
        if (bCashbackEnabled && !bIsProcessed && nMinCashbackTeam) {
          await matchLeagueServices.processCashback({ _id, iMatchId, eCategory, nMinTeam: parseInt(nMinCashbackTeam), nCashbackAmount, eCashbackType })
        }
        if (nJoined > nMax && !bUnlimitedJoin) {
          await matchLeagueServices.processPlayReturn(matchLeague, 'OVERFLOW', null, '', 'MATCH LIVE CRON', nJoined, uniqueUserJoinCount)
        }
        await queuePush('FairPlay', { _id: matchLeague._id, sFairPlay, sName, nTotalPayout, nPrice, nJoined })
      }
    }

    matchLive()
  } catch (error) {
    await queuePush('dead:MatchLive', matchLeague)
    handleCatchError(error)
    matchLive()
  }
}

async function generateFairPlay() {
  let data
  try {
    if (config.DISABLE_FAIR_PLAY) {
      return
    }
    let matchLeague = await queuePop('FairPlay')
    if (!matchLeague) {
      setTimeout(() => {
        generateFairPlay()
      }, 2000)
      return
    }

    matchLeague = JSON.parse(matchLeague)

    const { _id, sName, nTotalPayout, nPrice, nJoined, sFairPlay } = matchLeague

    const userleagues = await UserLeagueModel.find({ iMatchLeagueId: ObjectId(_id) }, { iUserTeamId: 1, sTeamName: 1, sMatchName: 1, sUserName: 1, nTotalPayout: 1 }).lean()

    const data = []
    for (const leagues of userleagues) {
      const hashData = await UserTeamModel.findById(leagues.iUserTeamId, { _id: 0, iCaptainId: 1, iViceCaptainId: 1, sHash: 1 }).lean()
      const oTeamData = await MatchTeamsModel.findOne({ sHash: hashData.sHash }, { aPlayers: 1, _id: 0 }).populate({ path: 'aPlayers.iMatchPlayerId', select: 'sName' }).sort({ _id: 1 }).lean()
      data.push({ ...leagues, ...hashData, oTeamData })
    }

    if (data.length) {
      const { sMatchName } = data[0]

      const list = data.map((ul) => {
        const { sUserName, sTeamName, iCaptainId, iViceCaptainId, oTeamData } = ul
        const { aPlayers: players } = oTeamData

        const [captain, viceCaptain, playerList] = players.reduce((acc, player) => {
          const { iMatchPlayerId } = player
          if ((iMatchPlayerId._id.toString()) === (iCaptainId.toString())) {
            acc[0] = iMatchPlayerId
          } else if ((iMatchPlayerId._id.toString()) === (iViceCaptainId.toString())) {
            acc[1] = iMatchPlayerId
          } else {
            acc[2].push(iMatchPlayerId)
          }
          return acc
        }, [0, 0, []])
        const htmlPlayers = playerList.map((player) => `<td style='padding: 2px 4px'> ${player.sName}</td>`).join(' ')
        return `
              <tr>
                  <td style='padding: 2px 4px'>${sUserName} (${sTeamName})</td>
                  <td style='padding: 2px 4px'>${captain.sName}</td>
                  <td style='padding: 2px 4px'>${viceCaptain.sName}</td>
                  ${htmlPlayers}
              </tr>
                  `
      }).join(' ')
      const html = `
              <html>
                <head>
                    <title> ${sMatchName}</title>
                    <link rel="preconnect" href="https://fonts.gstatic.com">
                    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap" rel="stylesheet">
                    <style type="text/css">
                      /** Define the margins of your page **/
                      @page {
                        margin: 100px 25px;
                      }
                    </style>
                  </head>
  
                  <body>
                 
                    <div>
                      <table border='1' width='100%' style='border-collapse: collapse; font-family: "Open Sans", sans-serif;'>
                        <thead style='font-family: "Open Sans", sans-serif; font-size: 8px'>
                          <tr>
                            <th style='padding: 2px 4px'>User (Team)</th>
                            <th style='padding: 2px 4px'>Player 1 (C)</th>
                            <th style='padding: 2px 4px'>Player 2 (VC)</th>
                            <th style='padding: 2px 4px'>Player 3</th>
                            <th style='padding: 2px 4px'>Player 4</th>
                            <th style='padding: 2px 4px'>Player 5</th>
                            <th style='padding: 2px 4px'>Player 6</th>
                            <th style='padding: 2px 4px'>Player 7</th>
                            <th style='padding: 2px 4px'>Player 8</th>
                            <th style='padding: 2px 4px'>Player 9</th>
                            <th style='padding: 2px 4px'>Player 10</th>
                            <th style='padding: 2px 4px'>Player 11</th>
                          </tr>
                        </thead>
                        <tbody style='font-family: "Open Sans", sans-serif; font-size: 8px'>
                          ${list}
                        </tbody>
                      </table>
                    </div>
                  </body>
              </html>
              `
      const options = {
        format: 'A4',
        timeout: 9000000,
        orientation: 'landscape',
        header: {
          height: '50px',
          contents: `<div style="padding: 8px; background-color: #045de9; color: #fff; text-align: center; "><span style="display: block; font-family: "Open Sans", sans-serif; font-size: 14px; line-height: 18px; font-weight: 600;">Match: ${sMatchName}</span><span style="font-size: 12px; line-height: 14px; ">Entry Fee: ${nPrice} Members: ${nJoined} League Name: ${sName} Contest: Win Rs. ${nTotalPayout}</span></div>`
        },
        childProcessOptions: { detached: true }
      }

      pdf.create(html, options).toBuffer(async (err, buffer) => {
        try {
          if (err) throw new Error(err)

          const sFileName = `${sMatchName}-${_id}.pdf`
          const sContentType = 'application/pdf'

          if (sFairPlay) {
            const sBucketName = getBucketName()

            const bucketParams = {
              Bucket: sBucketName,
              Key: sFairPlay
            }
            await bucket.deleteObject(bucketParams)
          }
          const data = await bucket.putObject({ sFileName, sContentType, path: s3UserTeams, fileStream: buffer })
          await MatchLeagueModel.updateOne({ _id: ObjectId(matchLeague._id) }, { sFairPlay: data.key })
        } catch (error) {
          handleCatchError(error)
        }
      })
    }

    generateFairPlay()
  } catch (error) {
    await queuePush('dead:FairPlay', data)
    handleCatchError(error)
    generateFairPlay()
  }
}

async function autoCreateLeague() {
  let matchLeague
  try {
    matchLeague = await queuePop('autoCreateLeague')
    if (!matchLeague) {
      setTimeout(() => { autoCreateLeague() }, 2000)
      return
    }

    matchLeague = JSON.parse(matchLeague)
    const nTotalJoined = await UserLeagueModel.countDocuments({ iMatchLeagueId: ObjectId(matchLeague._id) }, { readPreference: 'primary' })
    if (Number(matchLeague.nMax) === nTotalJoined) {
      matchLeague = pick(matchLeague, ['sName', 'sLeagueCategory', 'sFilterCategory', 'nTotalWinners', 'iLeagueId', 'iFilterCatId', 'nLoyaltyPoint', 'aLeaguePrize', 'nTeamJoinLimit', 'nMax', 'nMin', 'nPrice', 'nTotalPayout', 'nDeductPercent', 'nBonusUtil', 'sPayoutBreakupDesign', 'bConfirmLeague', 'bMultipleEntry', 'bAutoCreate', 'bPoolPrize', 'nPosition', 'eStatus', 'eCategory', 'nWinnersCount', 'iLeagueCatId', 'iFilterCatId', 'bUnlimitedJoin', 'nMinCashbackTeam', 'nCashbackAmount', 'eCashbackType', 'nMinTeamCount', 'nBotsCount', 'bBotCreate', 'iMatchId', 'nCopyBotsPerTeam', 'nSameCopyBotTeam'])
      await MatchLeagueModel.create({ ...matchLeague, nJoined: 0, bCopyLeague: true, eMatchStatus: 'U' })
    }

    autoCreateLeague()
  } catch (error) {
    await queuePush('dead:autoCreateLeague', matchLeague)
    handleCatchError(error)
    autoCreateLeague()
  }
}

async function prizeDistributionBySeries() {
  let data
  try {
    data = await queuePop('MatchSeriesRank')
    if (!data) {
      setTimeout(() => { prizeDistributionBySeries() }, 2000)
      return
    }

    data = JSON.parse(data)
    const { _id, aPrizeBreakup, iCategoryId } = data
    const userRank = SeriesLBUserRankModel.aggregate([
      {
        $match: {
          iSeriesId: ObjectId(_id),
          iCategoryId: ObjectId(iCategoryId)
        }
      }, {
        $group: {
          id: { $first: '$_id' },
          _id: '$nUserRank',
          count: { $sum: 1 },
          data: { $push: '$$ROOT' }
        }
      }, {
        $project: {
          _id: '$id',
          nRank: '$_id',
          data: 1,
          count: 1
        }
      }, {
        $sort: { nRank: 1 }
      }
    ]).allowDiskUse(bAllowDiskUse).cursor()

    const aUpdateUsersRank = []
    for await (const user of userRank) {
      let sameRankTeamCount = 1
      if (user.count > 1) {
        sameRankTeamCount = user.count
      }
      const prize = getPrice(aPrizeBreakup, user.nRank, sameRankTeamCount)
      let { nTotalRealMoney, nTotalBonus, aTotalExtraWin } = prize

      nTotalRealMoney = sameRankTeamCount > 1 ? Number(((nTotalRealMoney / sameRankTeamCount).toFixed(2))) : nTotalRealMoney
      nTotalBonus = sameRankTeamCount > 1 ? Number(((nTotalBonus / sameRankTeamCount).toFixed(2))) : nTotalBonus

      const userRankUpdate = { nPrize: nTotalRealMoney, aExtraWin: aTotalExtraWin, nBonusWin: nTotalBonus, bPrizeCalculated: true }

      user.data.map((eUser) => {
        aUpdateUsersRank.push({
          updateOne: {
            filter: { _id: ObjectId(eUser._id) },
            update: userRankUpdate
          }
        })
      })
    }
    await Promise.all([
      SeriesLBUserRankModel.bulkWrite(aUpdateUsersRank, { ordered: false }),
      SeriesLeaderBoardModel.updateOne({ _id: ObjectId(_id), aSeriesCategory: { $elemMatch: { _id: ObjectId(iCategoryId) } } }, { 'aSeriesCategory.$.bPrizeDone': true })
    ])

    prizeDistributionBySeries()
  } catch (error) {
    await queuePush('dead:MatchSeriesRank', data)
    handleCatchError(error)
    prizeDistributionBySeries()
  }
}

async function processMatchLeague() {
  let matchLeague
  try {
    matchLeague = await queuePop('ProcessMatchLeague')
    if (!matchLeague) {
      setTimeout(() => {
        processMatchLeague()
      }, 2000)
      return
    }
    matchLeague = JSON.parse(matchLeague)

    const { _id } = matchLeague

    const nJoined = await UserLeagueModel.countDocuments({ iMatchLeagueId: _id }, { readPreference: 'primary' })

    matchLeague.nJoined = nJoined

    const uniqueUserJoin = await UserLeagueModel.aggregate([
      {
        $match: { iMatchLeagueId: ObjectId(_id) }
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
    const uniqueUserJoinCount = uniqueUserJoin[0].nJoinedCount

    if (uniqueUserJoinCount < 2) {
      await matchLeagueServices.processPlayReturn(matchLeague, 'MATCHLEAGUE', null, '', 'PROCESS MATCHLEAGUE CRON', nJoined, uniqueUserJoinCount)
    } else {
      await matchLeagueServices.processPlayReturn(matchLeague, 'OVERFLOW', null, '', 'PROCESS MATCHLEAGUE CRON', nJoined, uniqueUserJoinCount)
    }

    processMatchLeague()
  } catch (error) {
    await queuePush('dead:ProcessMatchLeague', matchLeague)
    handleCatchError(error)
    processMatchLeague()
  }
}

async function checkRedisJoinedCount() {
  let matchLeague
  try {
    matchLeague = await queuePop('checkRedisJoinedCount')
    if (!matchLeague) {
      setTimeout(() => {
        checkRedisJoinedCount()
      }, 2000)
      return
    }
    matchLeague = JSON.parse(matchLeague)

    const { _id, nJoined: nMatchLeagueJoined, bCancelled, eMatchStatus } = matchLeague

    let nJoined
    if (!bCancelled && eMatchStatus === 'U') {
      nJoined = await UserLeagueModel.countDocuments({ iMatchLeagueId: ObjectId(_id), bCancelled: false }, { readPreference: 'primary' })
      if (nMatchLeagueJoined !== nJoined) {
        await MatchLeagueModel.updateOne({ _id: ObjectId(_id) }, { nJoined }, { readPreference: 'primary' })
      }
    }

    checkRedisJoinedCount()
  } catch (error) {
    await queuePush('dead:checkRedisJoinedCount', matchLeague)
    handleCatchError(error)
    checkRedisJoinedCount()
  }
}

async function processUserCashbackReturnV2() {
  let data
  try {
    data = await queuePop('ProcessUsersCashbackReturn')
    if (!data) {
      setTimeout(() => {
        processUserCashbackReturnV2()
      }, 2000)
      return
    }
    data = JSON.parse(data)
    const { _id, iMatchId, nMinTeam, nCashbackAmount, eCashbackType, eCategory } = data
    if (nMinTeam) {
      const nAmount = parseFloat(nCashbackAmount)

      const cashbackUserLeagues = await UserLeagueModel.aggregate([
        {
          $match: {
            iMatchLeagueId: ObjectId(_id)
          }
        }, {
          $addFields: {
            eType: { $cond: [{ $eq: ['$eType', 'U'] }, 'U', 'B'] }
          }
        }, {
          $group: {
            _id: '$iUserId',
            count: { $sum: 1 },
            sUserName: { $first: '$sUserName' },
            sLeagueName: { $first: '$sLeagueName' },
            iLeagueId: { $first: '$_id' },
            eType: { $first: '$eType' }
          }
        }, {
          $match: {
            count: { $gte: nMinTeam }
          }
        }
      ]).allowDiskUse(bAllowDiskUse).exec()

      if (cashbackUserLeagues && cashbackUserLeagues.length) {
        await userBalanceServices.userContestCashbackReturnV2({ nAmount, eCashbackType, nTeams: nMinTeam, aUserLeagues: cashbackUserLeagues, iMatchId, iMatchLeagueId: _id, eCategory })
      }
    }

    processUserCashbackReturnV2()
  } catch (error) {
    await queuePush('dead:ProcessUsersCashbackReturn', data)
    handleCatchError(error)
    processUserCashbackReturnV2()
  }
}

async function processTransactionLog() {
  let data
  try {
    const length = await queueLen('TransactionLog')
    if (length <= TRANSACTION_LOG_BULK_INSERT_SIZE) {
      setTimeout(() => { processTransactionLog() }, 2000)
      return
    }
    data = await bulkQueuePop('TransactionLog', TRANSACTION_LOG_BULK_INSERT_SIZE)
    data = data.map((d) => JSON.parse(d))

    await TransactionLogModel.insertMany(data)
    processTransactionLog()
  } catch (error) {
    await queuePush('dead:TransactionLog', data)
    handleCatchError(error)
    processTransactionLog()
  }
}

async function generateShareCodes() {
  try {
    const aCode = []

    const [generatedCodes, queueLength] = await Promise.all([
      redisClient.lrange('generateShareCodes', 0, -1),
      queueLen('generateShareCodes')
    ])

    if (queueLength < THRESHOLD_CODE_QUEUE_LENGTH) {
      for (let i = 0; i < (THRESHOLD_CODE_QUEUE_LENGTH - queueLength); i++) {
        aCode.push(randomStr(6, 'private'))
      }

      let [user, matchLeague] = await Promise.all([
        UserModel.find({ sReferCode: { $in: aCode } }, { sReferCode: 1, _id: 0 }).lean(),
        MatchLeagueModel.find({ sShareCode: { $in: aCode } }, { sShareCode: 1, _id: 0 }).lean()])

      const aUniqueCodes = new Set(aCode)

      user = user.map(value => value.sReferCode)
      matchLeague = matchLeague.map(value => value.sShareCode)

      aUniqueCodes.forEach(value => {
        if (!(user.includes(value) && matchLeague.includes(value) && generatedCodes.includes(value))) {
          queuePush('generateShareCodes', value)
        }
      })
      return
    }
  } catch (error) {
    handleCatchError(error)
    setTimeout(() => {
      generateShareCodes()
    }, 2000)
  }
}

// This is an internal function
async function switchCapAndViceCap(_id, oTeam, c = 0) {
  try {
    let { aPlayers, iCaptainId, iViceCaptainId } = oTeam

    if (!iCaptainId && !iViceCaptainId) {
      const indx1 = generateNumber(0, 10)
      let indx2 = generateNumber(0, 10)
      indx2 = (indx1 !== indx2) ? indx2 : generateNumber(0, 10)
      iCaptainId = aPlayers[indx1].iMatchPlayerId || aPlayers[indx1]
      iViceCaptainId = aPlayers[indx2].iMatchPlayerId || aPlayers[indx2]
    }
    _id = _id.toString()
    iCaptainId = iCaptainId.toString()
    iViceCaptainId = iViceCaptainId.toString()

    const data = (iCaptainId && iViceCaptainId && (iCaptainId !== iViceCaptainId)) ? await checkTeamExist(_id, `${iCaptainId}:${iViceCaptainId}`) : 'EXIST'
    if (data === 'EXIST') {
      c++
      const indx3 = generateNumber(0, 10)
      let indx4 = generateNumber(0, 10)
      indx4 = (indx3 !== indx4) ? indx4 : generateNumber(0, 10)
      iCaptainId = aPlayers[indx3].iMatchPlayerId || aPlayers[indx3]
      iViceCaptainId = aPlayers[indx4].iMatchPlayerId || aPlayers[indx4]
      oTeam = {
        ...oTeam,
        iCaptainId,
        iViceCaptainId
      }
      return await switchCapAndViceCap(_id, oTeam, c)
    }
    return oTeam
  } catch (error) {
    handleCatchError(error)
    return oTeam
  }
}

async function CopyTeamUpdate(copyTeam) {
  try {
    const { matchLeagueIds, iUserId, iMatchId, iUserTeamId, iNewUserTeamId, eUpdateTeamType, dStartDate } = copyTeam

    const copyTeamLogs = await CopyTeamLogModel.find({ iMatchLeagueId: { $in: matchLeagueIds }, iMatchId: iMatchId, iUserId, iUserTeamId }).lean()

    const teamId = eUpdateTeamType === 'SWITCH' ? iNewUserTeamId : iUserTeamId

    const newTeam = await UserTeamModel.findById(teamId, { _id: 0, iUserId: 0 }).lean()
    const matchTeams = await MatchTeamsModel.findOne({ sHash: newTeam.sHash }, { aPlayers: 1 }).lean()
    const aPlayers = matchTeams.aPlayers

    const { iCaptainId, iViceCaptainId, sHash } = newTeam

    const sameTeamUpdate = []
    const rotateTeamUpdate = []
    const randomTeams = []
    const aBulkCopyTeam = []
    for (const logs of copyTeamLogs) {
      const copyTeam = logs
      if (copyTeam.eTeamType === 'SAME') {
        sameTeamUpdate.push(copyTeam.iSystemUserTeamId)
        if (eUpdateTeamType === 'SWITCH') await removeMember(iUserTeamId.toString(), `${iCaptainId.toString()}:${iViceCaptainId.toString()}`)
        await addMember(teamId.toString(), `${iCaptainId.toString()}:${iViceCaptainId.toString()}`, +new Date(dStartDate) + 84600)
      } else if (copyTeam.eTeamType === 'ROTATE') {
        rotateTeamUpdate.push(copyTeam.iSystemUserTeamId)
        if (eUpdateTeamType === 'SWITCH') await removeMember(iUserTeamId.toString(), `${iViceCaptainId.toString()}:${iCaptainId.toString()}`)
        await addMember(teamId.toString(), `${iViceCaptainId.toString()}:${iCaptainId.toString()}`, +new Date(dStartDate) + 84600)
      } else if (copyTeam.eTeamType === 'RANDOM') {
        randomTeams.push(copyTeam.iSystemUserTeamId)

        let capIndex
        let viceCapIndex
        do {
          capIndex = Math.floor((Math.random() * (aPlayers.length - 1)))
          viceCapIndex = Math.floor((Math.random() * (aPlayers.length - 1)))
        } while (capIndex === viceCapIndex)

        const data = await switchCapAndViceCap(teamId, {
          aPlayers,
          iCaptainId: aPlayers[capIndex].iMatchPlayerId,
          iViceCaptainId: aPlayers[viceCapIndex].iMatchPlayerId
        })

        if (eUpdateTeamType === 'SWITCH') await removeMember(iUserTeamId.toString(), `${data.iCaptainId.toString()}:${data.iViceCaptainId.toString()}`)
        await addMember(teamId.toString(), `${data.iCaptainId.toString()}:${data.iViceCaptainId.toString()}`, +new Date(dStartDate) + 84600)

        aBulkCopyTeam.push({
          updateOne: {
            filter: { _id: ObjectId(copyTeam.iSystemUserTeamId) },
            update: {
              $set: {
                iCaptainId: data.iCaptainId,
                iViceCaptainId: data.iViceCaptainId,
                sHash
              }
            }
          }
        })
      }
    }

    await Promise.all([
      UserTeamModel.updateMany({ _id: { $in: sameTeamUpdate } }, { iCaptainId, iViceCaptainId, sHash }),
      UserTeamModel.updateMany({ _id: { $in: rotateTeamUpdate } }, { iCaptainId: iViceCaptainId, iViceCaptainId: iCaptainId, sHash })
    ])

    if (randomTeams.length) await UserTeamModel.bulkWrite(aBulkCopyTeam, { ordered: false })
    if (eUpdateTeamType === 'SWITCH') {
      await CopyTeamLogModel.updateMany({ iMatchLeagueId: { $in: matchLeagueIds }, iMatchId: iMatchId, iUserId, iUserTeamId }, { $push: { aHash: sHash }, $set: { iUserTeamId: iNewUserTeamId } })
    }
    return { bSuccess: true }
  } catch (error) {
    console.log('Error while updating switch copy bot team updatation', copyTeam)
    handleCatchError(error)
    return { bSuccess: false }
  }
}

async function sendMultiCastNotifications(tokens, title, body) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await sendMultiCastNotification(tokens, title, body)
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function winNotify() {
  let data
  try {
    data = await bulkQueuePop('pushNotification:Win', 500)
    if (!data?.length) {
      setTimeout(() => { winNotify() }, 2000)
      return
    }
    data = data.map(d => JSON.parse(d))
    const aUserIds = data.map(user => user?.iUserId)
    const user = await UserModel.find({ _id: { $in: aUserIds }, 'aPushToken.sPushToken': { $exists: true } }, { 'aPushToken.sPushToken': 1, _id: 1 }).lean()
    const oUserPushTokens = user.reduce((acc, user) => {
      acc[user?._id.toString()] = user.aPushToken.filter(token => token?.sPushToken).map(token => token.sPushToken)
      return acc
    }, {})
    for await (const notification of data) {
      if (oUserPushTokens[notification?.iUserId]?.length) await sendMultiCastNotifications([...oUserPushTokens[notification?.iUserId]], 'You\'re a Winner!', `Congratulations on your victory! You have won ₹${notification?.nPrice}! Join more contests on Fansportiz and keep winning big!`, 'completedMatches')
    }
    winNotify()
  } catch (error) {
    await queuePush('dead:pushNotification:Win', data)
    handleCatchError(error)
    winNotify()
  }
}

async function processReferReward() {
  let data
  try {
    let data = await queuePop('processReferReward')

    if (!data) {
      setTimeout(() => { processReferReward() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { sReferral } = data
    switch (sReferral) {
      case 'RB': // Register Bonus
        await processRegisterBonus(data)
        break

      case 'RCB': // Register with Refer Code Bonus
        await processRegisterReferCodeBonus(data)
        break

      case 'LB': // League Join Refer Reward
        await processLeagueJoinReferReward(data)
        break

      case 'DB': // First Time Deposit Refer Bonus
        await processFirstDepositReferBonus(data)
        break

      default:
        break
    }

    processReferReward()
  } catch (error) {
    await queuePush('dead:processReferReward', data)
    handleCatchError(error)
    setTimeout(() => { processReferReward() }, 2000)
  }
}

async function calculateTotalScorePointV2() {
  let data
  try {
    data = await queuePop('MatchTeams')
    if (!data) {
      setTimeout(() => { calculateTotalScorePointV2() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { eCategory } = data

    const points = await PlayerRoleModel.findOne({ eCategory: eCategory }).lean()
    const players = await MatchTeamsModel.findOne({ iMatchId: data.iMatchId, sHash: data.sHash }, { aPlayers: 1 }).populate('aPlayers.iMatchPlayerId', 'nScoredPoints').read('primary').readConcern('majority').lean()

    let totalPoint = 0
    const point = players.aPlayers.map((player) => { // calculate total team point
      const { _id, nScoredPoints } = player.iMatchPlayerId || { nScoredPoints: 0 }
      totalPoint = totalPoint + nScoredPoints
      return { iTeamId: player.iTeamId, iMatchPlayerId: _id, nScoredPoints }
    })

    await MatchTeamsModel.updateOne({ _id: ObjectId(players._id) }, { nTotalPoint: totalPoint, aPlayers: point }).w('majority')

    let aBulkUserTeam = []
    let aBulkUserLeague = []
    UserTeamModel.find({ iMatchId: data.iMatchId, sHash: data.sHash, bPointCalculated: false }).populate('iCaptainId', 'nScoredPoints').populate('iViceCaptainId', 'nScoredPoints').read('primary').readConcern('majority').cursor()
      .on('data', async (team) => {
        try {
          let nTotalPoints = totalPoint - (team.iViceCaptainId.nScoredPoints + team.iCaptainId.nScoredPoints)
          // calculate and update captain and viceCaption point
          nTotalPoints = nTotalPoints + (team.iViceCaptainId.nScoredPoints * points.nViceCaptainPoint) + (team.iCaptainId.nScoredPoints * points.nCaptainPoint)

          if (aBulkUserTeam.length > 5000 && aBulkUserLeague.length > 5000) {
            const promises = [UserTeamModel.bulkWrite(aBulkUserTeam.splice(0, 5000), { writeConcern: { w: 'majority' }, ordered: false }), UserLeagueModel.bulkWrite(aBulkUserLeague.splice(0, 5000), { writeConcern: { w: 'majority' }, ordered: false })]
            await Promise.all(promises)
          }
          aBulkUserTeam.push({
            updateOne: {
              filter: { _id: ObjectId(team._id) },
              update: { $set: { nTotalPoints, bPointCalculated: true } }
            }
          })
          aBulkUserLeague.push({
            updateMany: {
              filter: { iUserTeamId: ObjectId(team._id) },
              update: { $set: { nTotalPoints, bPointCalculated: true } }
            }
          })
        } catch (err) {
          handleCatchError(err)
        }
      })
      .on('end', async () => {
        try {
          if (aBulkUserTeam.length || aBulkUserLeague.length) {
            await Promise.all([
              UserTeamModel.bulkWrite(aBulkUserTeam, { writeConcern: { w: 'majority' }, ordered: false }),
              UserLeagueModel.bulkWrite(aBulkUserLeague, { writeConcern: { w: 'majority' }, ordered: false })
            ])
            aBulkUserTeam = []
            aBulkUserLeague = []
          }

          calculateTotalScorePointV2()
        } catch (err) {
          handleCatchError(err)
        }
      })
  } catch (error) {
    await queuePush('dead:MatchTeams', data)
    handleCatchError(error)
    setTimeout(() => { calculateTotalScorePointV2() }, 2000)
  }
}

async function kycStatusNotify() {
  let data
  try {
    let sMessage = ''
    let sTitle = ''
    data = await queuePop('pushNotification:KYC')
    if (!data) {
      setTimeout(() => { kycStatusNotify() }, 2000)
      return
    }
    data = JSON.parse(data)

    const { iUserId = '', eStatus = '' } = data
    const user = await UserModel.findById(iUserId, { aPushToken: 1 }).lean()

    if (eStatus === 'R') {
      sTitle = 'KYC Verification Failed⚠️'
      sMessage = 'Seems like our third umpire needs more details to complete the KYC. Open app to complete the process now.'
    }
    if (eStatus === 'A') {
      sTitle = '🙌🏻Your KYC is Approved'
      sMessage = ' You can now withdraw your money and enjoy the glories of your winnings.'
    }

    if (user && user.aPushToken) {
      const tokens = user.aPushToken
      await sendNotification(tokens, sTitle, sMessage)
    }

    kycStatusNotify()
  } catch (error) {
    await queuePush('dead:pushNotification:KYC', data)
    handleCatchError(error)
    kycStatusNotify()
  }
}

async function backUpTeam() {
  let aMatchId
  try {
    aMatchId = await bulkQueuePop('backup:Teams', 5000)
    if (!aMatchId) {
      setTimeout(() => { backUpTeam() }, 2000)
      return
    }
    aMatchId = aMatchId.map(d => JSON.parse(d))

    const aBackupMatchTeams = []
    const aBackupUserTeams = []
    MatchTeamsModel.find({ iMatchId: { $in: aMatchId } }).lean().cursor()
      .on('data', async (oMatchTeam) => {
        try {
          aBackupMatchTeams.push(oMatchTeam)
          if (aBackupMatchTeams.length >= 5000) {
            await BackUpMatchTeamsModel.insertMany(aBackupMatchTeams.splice(0, 5000))
          }
        } catch (error) {
        }
      })
      .on('end', async () => {
        try {
          if (aBackupMatchTeams.length) {
            await BackUpMatchTeamsModel.insertMany(aBackupMatchTeams)
          }
          await MatchTeamsModel.deleteMany({ iMatchId: { $in: aMatchId } })
          await MatchModel.updateMany({ _id: { $in: aMatchId } }, { $set: { bMatchTeamBackup: true } })
        } catch (error) {
          handleCatchError(error)
        }
      })

    UserTeamModel.find({ iMatchId: { $in: aMatchId } }).lean().cursor()
      .on('data', async (oTeam) => {
        try {
          aBackupUserTeams.push(oTeam)
          if (aBackupUserTeams.length >= 5000) {
            await BackUpUserTeamsModel.insertMany(aBackupUserTeams.splice(0, 5000))
          }
        } catch (error) {
          handleCatchError(error)
        }
      })
      .on('end', async () => {
        try {
          if (aBackupUserTeams.length) {
            await BackUpMatchTeamsModel.insertMany(aBackupUserTeams)
          }
          await UserTeamModel.deleteMany({ iMatchId: { $in: aMatchId } })
          await MatchModel.updateMany({ _id: { $in: aMatchId } }, { $set: { bUserTeamBackUp: true } })
        } catch (error) {
          handleCatchError(error)
        }
      })
  } catch (err) {
    handleCatchError(err)
    setTimeout(() => { backUpTeam() }, 2000)
  }
}

setTimeout(() => {
  processTransactionLog()
  processReferReward()
  calculateTotalScorePointV2()
  kycStatusNotify()
  backUpTeam()
  winNotify()
}, 2000)
setInterval(() => {
  generateShareCodes()
}, 2000)

module.exports = {
  matchLive,
  generateFairPlay,
  autoCreateLeague,
  prizeDistributionBySeries,
  processMatchLeague,
  checkRedisJoinedCount,
  processUserCashbackReturnV2,
  processTransactionLog,
  generateShareCodes,
  CopyTeamUpdate
}
