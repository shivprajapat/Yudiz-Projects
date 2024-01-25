const controllers = {}
const { players: PlayersModel, PlayerStatsModel } = require('../../model')
const axios = require('axios')
const _ = require('../../../global/')
const { uploadS3Image } = require('../../utils/lib/s3Bucket')
const path = require('path')
const fs = require('fs')
const { S3_PLAYER_HEAD_PATH } = require('../../../config')

controllers.getPlayer = async (req, res) => {
  try {
    const oPlayer = await PlayersModel.findOne({ sPlayerKey: req?.body?.sPlayerKey }).lean()
    res.json({ oPlayer })
  } catch (error) {
    return res.send({ error })
  }
}

controllers.addPlayerStats = async (req, res) => {
  try {
    const updateQueries = []
    // for (let i = 0; i < nTotalPlayers / 1000; i++) {
    const aPlayers = await PlayersModel.find({ }).sort({ _id: 1 }).skip(50000).limit(10000).lean()
    for (const oPlayer of aPlayers) {
      try {
        let nTotalBattingAverage = 0; let nTotalBattingStrikeRate = 0; let nTotalBowlingEconomy = 0; let nTotalBowlingAverage = 0; let nTotalBowlingStrikeRate = 0; let nBattingCount = 0; let nBowlingCount = 0
        const oEntityPlayerStatsData = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}players/${oPlayer?.sPlayerKey}/stats?token=${process.env.ENTITY_SPORT_TOKEN}`)
        const resData = oEntityPlayerStatsData?.data?.response
        const oBattingStats = resData?.batting
        const oBowlingStats = resData?.bowling
        const aBattingMatchStats = Object.keys(oBattingStats)
        const aBowlingMatchStats = Object.keys(oBowlingStats)
        for (const sStats of aBattingMatchStats) {
          const oStats = oBattingStats[sStats]
          const oBatting = {
            nMatches: oStats?.matches,
            nInnings: oStats?.innings,
            nNotOut: oStats?.notout,
            nRuns: oStats?.runs,
            nPlayedBalls: oStats?.balls,
            nHighest: oStats?.highest,
            nRun100: oStats?.run100,
            nRun50: oStats?.run50,
            nRun4: oStats?.run4,
            nRun6: oStats?.run6,
            sAverage: oStats?.average,
            sStrikeRate: oStats?.strike,
            nFastest50Balls: oStats?.fastest50balls,
            nFastest100Balls: oStats?.fastest100balls
          }
          if (oBatting?.sAverage && oBatting?.sStrikeRate) {
            nBattingCount += 1
            nTotalBattingAverage += parseFloat(oBatting?.sAverage || 0)
            nTotalBattingStrikeRate += parseFloat(oBatting?.sStrikeRate || 0)
          }
          console.log('batting', oBatting)
          console.log('batting', oPlayer?._id, oPlayer?.sFullName)
          // await PlayerStatsModel.findOneAndUpdate({ iPlayerId: oPlayer?._id, sPlayerKey: resData?.player?.pid, sMatchStatsTypes: sStats }, { $set: oBatting }, { upsert: true })
          updateQueries.push({
            updateOne: {
              filter: { iPlayerId: _.mongify(oPlayer?._id), sPlayerKey: resData?.player?.pid, sMatchStatsTypes: sStats },
              update: { $set: { oBatting } },
              upsert: true
            }
          })
        }
        for (const sStats of aBowlingMatchStats) {
          const oStats = oBowlingStats[`${sStats}`]
          const oBowling = {
            nMatches: oStats?.matches,
            nInnings: oStats?.innings,
            nBalls: oStats?.balls,
            sOvers: oStats?.overs,
            nRuns: oStats?.runs,
            nWickets: oStats?.wickets,
            sBestBowlingInning: oStats?.bestinning,
            sBestBowlingMatch: oStats?.bestmatch,
            sEconomy: oStats?.econ,
            sAverage: oStats?.average,
            sStrikeRate: oStats?.strike,
            nWkt4i: oStats?.wicket4i,
            nWkt5i: oStats?.wicket5i,
            nWkt10m: oStats?.wicket10m,
            nHatTrick: oStats?.hattrick,
            nMostExpensiveOver: oStats?.expensive_over_runs
          }
          if (oBowling?.sEconomy && oBowling?.sStrikeRate && oBowling?.sAverage) {
            nBowlingCount += 1
            nTotalBowlingEconomy += parseFloat(oBowling?.sEconomy || 0)
            nTotalBowlingStrikeRate += parseFloat(oBowling?.sStrikeRate || 0)
            nTotalBowlingAverage += parseFloat(oBowling?.sAverage || 0)
          }
          console.log('bowling', oBowling)
          console.log('bowling', oPlayer?._id, oPlayer?.sFullName)
          // await PlayerStatsModel.findOneAndUpdate({ iPlayerId: oPlayer?._id, sPlayerKey: resData?.player?.pid, sMatchStatsTypes: sStats }, { $set: oBowling }, { upsert: true })
          const nBattingPerformancePoint = +((nTotalBattingAverage + nTotalBattingStrikeRate) / nBattingCount).toFixed(2) || 0
          const nBowlingPerformancePoint = +((nTotalBowlingEconomy + nTotalBowlingStrikeRate + nTotalBowlingAverage) / nBowlingCount).toFixed(2) || 0
          await PlayersModel.findByIdAndUpdate(oPlayer?._id, { nBattingPerformancePoint, nBowlingPerformancePoint })
          updateQueries.push({
            updateOne: {
              filter: { iPlayerId: _.mongify(oPlayer?._id), sPlayerKey: oPlayer?.sPlayerKey, sMatchStatsTypes: sStats },
              update: { $set: { oBowling } },
              upsert: true
            }
          })
          await PlayerStatsModel.bulkWrite(updateQueries)
        }
      } catch (error) {
        console.log('error', error)
      }
    }
    // }
    return res.send('done')
  } catch (error) {
    console.log('errpr', error)
    return res.send({ error })
  }
}

controllers.uploadImageFromLocal = async (req, res) => {
  try {
    const sPlayerHeadURl = path.join(__dirname, '../../../playerHeads/')
    const files = fs.readdirSync(sPlayerHeadURl)
    for (const file of files) {
      const filePath = path.join(sPlayerHeadURl, file)
      const oPlayer = await PlayersModel.findOne({ sPlayerKey: file.split('_')[1].split('.')[0] }).lean()
      const hashed = _.encodeString(oPlayer?.sPlayerKey, 5)
      const imageName = oPlayer?.sFullName.split(' ').join('_') + '_' + hashed + path.extname(filePath)
      const stats = fs.statSync(filePath)
      const image = fs.readFileSync(filePath)
      const fileSizeInBytes = stats.size
      // Convert the file size to megabytes (optional)
      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024)
      const paramsObj = {
        ContentType: 'image/png',
        ContentLength: fileSizeInMegabytes,
        Body: image,
        Key: S3_PLAYER_HEAD_PATH + '300x300/' + imageName.toLowerCase(),
        ACL: 'public-read'
      }
      const oImg = {
        sUrl: S3_PLAYER_HEAD_PATH + '300x300/' + imageName.toLowerCase()
      }
      await uploadS3Image(paramsObj)
      await PlayersModel.updateOne({ _id: oPlayer?._id }, { oImg })
    }
    return res.send('done')
  } catch (error) {
    console.log(error)
    return res.send('error aavel che  ')
  }
}

module.exports = controllers
