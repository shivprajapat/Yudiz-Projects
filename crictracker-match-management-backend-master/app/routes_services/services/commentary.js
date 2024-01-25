// const async = require('async')
const axios = require('axios')
const { ObjectId } = require('mongodb')
const { matches: MatchesModel, CommentariesModel, OversModel } = require('../../model/index')
const { getPlayerIdFromKey } = require('../../modules/match/common')
const { scheduleMatchTask } = require('../../utils')
const moment = require('moment')
const { redisMatchDb, pubsub } = require('../../utils/lib/redis')
const crypto = require('crypto')
class CommentaryService {
  async updateCommentary(req, res) {
    try {
      const { iMatchId, nInningNumber } = req.body
      const matchQuery = { bIsCommentary: true }

      const endDate = moment().subtract(5, 'minutes').toDate()

      if (iMatchId) {
        matchQuery._id = ObjectId(iMatchId)
      } else {
        matchQuery.$or = []
        matchQuery.$or.push({ sStatusStr: 'live', sLiveGameStatusStr: { $ne: 'stumps' } })
        matchQuery.$or.push({ dMatchEndTime: { $gt: endDate }, sStatusStr: { $ne: 'live' }, sLiveGameStatusStr: { $ne: 'playing ongoing' } })
      }
      const data = await MatchesModel.find(matchQuery)

      for (const m of data) {
        const nLatestInningNumber = nInningNumber || m?.nLatestInningNumber
        scheduleMatchTask({ eType: 'commentary', data: { _id: m?._id, sMatchKey: m?.sMatchKey, nLatestInningNumber } }, moment().unix())
      }
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'commentaries Done' })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'commentaries Error' })
    }
  }

  async removeDuplicate(req, res) {
    try {
      const { iMatchId } = req.body
      const startDate = moment().toDate()
      const endDate = moment().subtract(1, 'hours').toDate()
      let query = {}

      if (iMatchId) {
        query._id = iMatchId
      } else {
        query = {
          $or: [
            { dStartDate: { $lt: startDate }, dEndDate: { $gt: endDate } },
            { sStatusStr: 'live' }
          ]
        }
      }

      // const matches = await MatchesModel.find(query)

      // async.eachSeries(matches, async (s, callback) => {
      //   const distinctInnings = await CommentariesModel.distinct('nInningNumber', { iMatchId: ObjectId(s._id) })

      //   async.eachSeries(distinctInnings, async (i, cbInning) => {
      //     const toeRemoveCommentaries = await CommentariesModel.aggregate([
      //       { $match: { iMatchId: ObjectId(s._id), nInningNumber: i } },
      //       { $group: { _id: '$sEventId', count: { $sum: 1 }, cid: { $first: '$_id' }, sOver: { $first: '$sOver' } } },
      //       { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
      //       { $project: { sEventId: '$_id', cid: 1, sOver: 1 } }
      //     ])
      //     const ids = toeRemoveCommentaries.map(o => o.cid)
      //     const uniqueOvers = [...new Set(toeRemoveCommentaries.map(e => e.sOver))]
      //     console.log({ ids: JSON.stringify(ids), uniqueOvers: JSON.stringify(uniqueOvers) })

      //     async.eachSeries(uniqueOvers, async (over, cbUniqueOver) => {
      //       const duplicateOver = await CommentariesModel.find({ iMatchId: ObjectId(s._id), nInningNumber: i, sOver: over, eEvent: { $ne: 'oe' } }).sort({ sEventId: 1 }).collation({ locale: 'en_US', numericOrdering: true })

      //       const aBalls = [...new Map(duplicateOver.map(item => [item.sEventId, item])).values()]
      //       const aScore = aBalls.map(s => s.sScore)

      //       await CommentariesModel.findOneAndUpdate({ iMatchId: ObjectId(s._id), sOver: over, eEvent: 'oe', _id: { $nin: ids } }, { $set: { aOverScores: aScore } })

      //       const overToUpdate = (parseInt(over) + 1).toString()
      //       await OversModel.findOneAndUpdate({ iMatchId: ObjectId(s._id), nInningNumber: i, sOver: overToUpdate }, { $set: { aBall: aBalls } })

      //       Promise.resolve()
      //     }, (error) => {
      //       console.log('done matches', error)
      //     })
      //     await CommentariesModel.deleteMany({ _id: ids })
      //     Promise.resolve()
      //   }, (error) => {
      //     console.log('done matches', error)
      //   })
      //   Promise.resolve()
      // }, (error) => {
      //   console.log('done', error)
      // })

      // // update 0/0 overs function
      // for (const m of matches) {
      //   console.log('in invalid over')
      //   const aInvalidOver = await CommentariesModel.find({ iMatchId: ObjectId(m._id), eEvent: 'oe', $or: [{ aBatters: { $size: 0 } }, { aBowlers: { $size: 0 } }, { sScore: '0/0', nRuns: { $gt: 0 } }] })

      //   if (aInvalidOver?.length) {
      //     for (const io of aInvalidOver) {
      //       const commentaryData = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}/matches/${m?.sMatchKey}/innings/${io?.nInningNumber}/commentary?token=${process.env.ENTITY_SPORT_TOKEN}`)

      //       const aCommentary = commentaryData?.data?.response?.commentaries
      //       if (aCommentary?.length) {
      //         const invalidCommentary = aCommentary.find((ele, i) => {
      //           const overEventId = io?.sEventId?.split('-')[0]
      //           if (ele.event === 'overend' && ele?.over?.toString() === io.sOver && aCommentary[--i]?.event_id === overEventId) {
      //             return true
      //           } else return false
      //         })

      //         if (invalidCommentary) {
      //           const { over: sOver, runs: nRuns, commentary: sCommentary, score: sScore, bats: aBatters, bowls: aBowlers } = invalidCommentary

      //           const updateCommentary = {
      //             sOver,
      //             sScore,
      //             nRuns,
      //             sCommentary,
      //             aBatters: [],
      //             aBowlers: []
      //           }

      //           for (const b of aBatters) {
      //             const objBatter = {}

      //             objBatter.nRuns = b.runs
      //             objBatter.nBallFaced = b.balls_faced
      //             objBatter.nFours = b.fours
      //             objBatter.nSixes = b.sixes
      //             objBatter.iBatterId = await getPlayerIdFromKey(b.batsman_id)

      //             updateCommentary.aBatters.push(objBatter)
      //           }

      //           for (const b of aBowlers) {
      //             const objBowler = {}

      //             objBowler.nRunsConceded = b.runs_conceded
      //             objBowler.sOvers = b.overs
      //             objBowler.nWickets = b.wickets
      //             objBowler.nMaidens = b.maidens
      //             objBowler.iBowlerId = await getPlayerIdFromKey(b.bowler_id)

      //             updateCommentary.aBowlers.push(objBowler)
      //           }
      //           const updateQuery = { iMatchId: ObjectId(m._id), nInningNumber: io.nInningNumber, sOver: io.sOver, eEvent: io.eEvent }
      //           console.log({ updateCommentary })
      //           await CommentariesModel.updateOne(updateQuery, updateCommentary)

      //           await OversModel.updateOne(updateQuery, { oOver: updateCommentary })
      //         }
      //       }
      //     }
      //   }
      // }

      // console.log('over fixed')
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.successfully.message.replace('##', 'Data get'), data: 'Done' })
    } catch (error) {
      return error
    }
  }

  async checkCommentries(req, res) {
    try {
      if (!['dev', 'stag'].includes(process.env.NODE_ENV)) {
        const commentriesMatch = await MatchesModel.find({ bIsCommentary: true }).lean()

        for (const m of commentriesMatch) {
          const commentries = await CommentariesModel.findOne({ iMatchId: ObjectId(m._id) }).lean()
          if (!commentries) {
            const nLatestInningNumber = m?.nLatestInningNumber
            for (let index = 0; index <= nLatestInningNumber; index++) {
              scheduleMatchTask({ eType: 'commentary', data: { _id: m?._id, sMatchKey: m?.sMatchKey, nLatestInningNumber } }, moment().unix())
            }
          }
        }
      }
      res.send('ok')
    } catch (error) {
      return error
    }
  }

  /// new commentary service v2
  async newCommentariesV2(req, res) {
    try {
      const matchQuery = { bIsCommentary: true }

      const endDate = moment().subtract(5, 'minutes').toDate()

      if (req?.body?.iMatchId) {
        Object.assign(matchQuery, { _id: ObjectId(req.body.iMatchId) })
      } else {
        matchQuery.$or = []
        matchQuery.$or.push({ sStatusStr: 'live', sLiveGameStatusStr: { $ne: 'stumps' } })
        matchQuery.$or.push({ dMatchEndTime: { $gt: endDate }, sStatusStr: { $ne: 'live' }, sLiveGameStatusStr: { $ne: 'playing ongoing' } })
      }

      const aMatches = await MatchesModel.find(matchQuery).lean()

      for (const m of aMatches) {
        const nLatestInningNumber = parseInt(req?.body?.nLatestInningNumber) || m?.nLatestInningNumber || 1

        // add to commentary scheduler
        scheduleMatchTask({ eType: 'commentary', data: { _id: m?._id, sMatchKey: m?.sMatchKey, nLatestInningNumber } }, moment().unix())
      }
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'Commentary') })
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

// for v2 : insert and update
const updateCommFun = async (aCommES, iMatchId, nInningNumber, aCommentaryES = null, bIsUpdate = false, iCommId, bIsMiss = false) => {
  try {
    for (const [j, comm] of aCommES.entries()) {
      const { event_id: sEventId, batsman_id: sBatterKey, bowler_id: sBowlerKey, over: sOver, ball: sBall, score: sScore, commentary: sCommentary, text: sText, run: nRuns, runs: nOeRuns, timestamp: nTimestamp, noball_dismissal: bIsNoBallDismissal, batsman_balls: nBatterBalls, batsman_runs: nBatterRuns, how_out: sHowOut, wicket_batsman_id: sWicketBatterKey, bats: aBatters, bowls: aBowlers, event: eEvent, noball_run: sNoBallRun, wide_run: sWideRun, bye_run: sByeRun, legbye_run: sLegbyeRun, bat_run: sBatrun, noball: bIsNoball, wideball: bIsWideball, six: bIsSix, four: bIsFour } = comm

      const sHash = createHash(comm, 'es')
      const updateOverObj = {
        iMatchId: ObjectId(iMatchId),
        nInningNumber,
        sOver,
        sScore,
        sCommentary,
        sEventId,
        sHash
      }

      const updateObj = {
        sBall,
        nTimestamp,
        sText,
        bIsNoBallDismissal: !!bIsNoBallDismissal,
        ...updateOverObj,
        sWideRun,
        sNoBallRun,
        sByeRun,
        sBatrun,
        bIsNoball,
        bIsWideball,
        bIsSix,
        bIsFour,
        sLegbyeRun
      }

      if (eEvent === 'ball') {
        const iBatterId = await getPlayerIdFromKey(sBatterKey)
        const iBowlerId = await getPlayerIdFromKey(sBowlerKey)

        // check if wide ball
        let newScore

        if (sScore.toString().split('')[1] === 'w') newScore = sScore.toString().split('')[0] + 'Wd'
        else newScore = sScore

        Object.assign(updateObj, { eEvent: 'b', nRuns, sEventId, iBatterId, iBowlerId, sScore: newScore })
      }
      if (eEvent === 'wicket') {
        const iWicketBatterId = await getPlayerIdFromKey(sWicketBatterKey)

        Object.assign(updateObj, {
          eEvent: 'w',
          iWicketBatterId,
          sHowOut,
          nBatterRuns,
          nBatterBalls,
          nRuns,
          sEventId
        })
      }
      if (eEvent === 'overend') {
        Object.assign(updateObj, {
          eEvent: 'oe',
          aBatters: [],
          aBowlers: [],
          nRuns: nOeRuns
        })

        for (const s of aBatters) {
          const objBatter = {}

          objBatter.nRuns = s.runs
          objBatter.nBallFaced = s.balls_faced
          objBatter.nFours = s.fours
          objBatter.nSixes = s.sixes
          objBatter.iBatterId = await getPlayerIdFromKey(s.batsman_id)

          updateObj.aBatters.push(objBatter)
        }

        for (const s of aBowlers) {
          const objBowler = {}

          objBowler.nRunsConceded = s.runs_conceded
          objBowler.sOvers = s.overs
          objBowler.nWickets = s.wickets
          objBowler.nMaidens = s.maidens
          objBowler.iBowlerId = await getPlayerIdFromKey(s.bowler_id)

          updateObj.aBowlers.push(objBowler)
        }

        let overEventId
        if (j) {
          overEventId = aCommES[j - 1].event_id + '-1'
        } else {
          const lastMongoComm = await CommentariesModel.findOne({ iMatchId: ObjectId(iMatchId), nInningNumber, sOver: (sOver - 1), eEvent: { $ne: 'oe' } }).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()

          overEventId = lastMongoComm.sEventId + '-1'
        }

        Object.assign(updateObj, { sEventId: overEventId })
      }

      let newComm
      if (bIsUpdate) {
        newComm = await CommentariesModel.findOneAndUpdate({ _id: ObjectId(iCommId) }, updateObj, { new: true })
        await calculateOvers(newComm, iMatchId, nInningNumber)
      } else {
        newComm = await CommentariesModel.create(updateObj)
        await calculateOvers(newComm, iMatchId, nInningNumber)
      }

      // check commentary in overs
      if (eEvent === 'overend' && !bIsMiss && !bIsUpdate) {
        await checkCommentary(aCommentaryES, iMatchId, nInningNumber)
        const nPreviousInn = nInningNumber - 1
        if (nPreviousInn > 0) await checkCommentary(null, iMatchId, nPreviousInn)

        // break loop
        if (aCommentaryES?.length) {
          const lastESHash = createHash(aCommentaryES[aCommentaryES?.length - 1], 'es')
          const lastMongo = await CommentariesModel.findOne({ iMatchId: ObjectId(iMatchId), nInningNumber }).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()
          if (lastESHash === lastMongo.sHash) break
        }
      }
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

/// for v2 : check commentary
const checkCommentary = async (aCommentary, iMatchId, nInningNumber) => {
  try {
    const aMissCommentary = []

    // get latest commentary from api
    const match = await MatchesModel.findOne({ _id: iMatchId }, { sMatchKey: 1 }).lean()
    if (!aCommentary?.length) {
      const commentaryRes = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}/matches/${match?.sMatchKey}/innings/${nInningNumber}/commentary?token=${process.env.ENTITY_SPORT_TOKEN}`)

      aCommentary = commentaryRes?.data?.response?.commentaries
    }

    const mongoCommentary = await CommentariesModel.find({ iMatchId: ObjectId(iMatchId), nInningNumber }).lean()

    for (const [i, comm] of aCommentary.entries()) {
      let exist

      // check if data exist in db and its changed then update otherwise add in missing comm array
      if (comm.event === 'ball') {
        exist = mongoCommentary.findIndex(ele => {
          if (comm.over === ele.sOver && comm.event_id === ele.sEventId && comm.ball === ele.sBall && ele.eEvent === 'b') return true
          return false
        })
      } else if (comm.event === 'wicket') {
        exist = mongoCommentary.findIndex(ele => {
          if (comm.over === ele.sOver && comm.event_id === ele.sEventId && comm.ball === ele.sBall && ele.eEvent === 'w') return true
          return false
        })
      } else if (comm.event === 'overend') {
        exist = mongoCommentary.findIndex(ele => {
          if (comm.over?.toString() === ele.sOver && ele.eEvent === 'oe') return true
          return false
        })
      }
      if (exist >= 0) {
        // if exist then check its hash
        const checkHash = createHash(comm, 'es')
        const mongoDoc = mongoCommentary[exist]

        if (checkHash !== mongoDoc?.sHash) {
          // update old doc
          await updateCommFun([comm], iMatchId, nInningNumber, null, true, mongoDoc._id)
        } else if (comm.event === 'overend' && mongoDoc.sEventId !== (aCommentary[i - 1].event_id + '-1')) {
          // if ball is added inbetween
          await CommentariesModel.updateOne({ _id: mongoDoc._id }, { sEventId: aCommentary[i - 1].event_id + '-1' })
        }
      } else if (exist < 0) {
        aMissCommentary.push(comm)
      }
    }

    if (aMissCommentary.length) await updateCommFun(aMissCommentary, iMatchId, nInningNumber, null, false, null, true)

    // remove invalid commentary
    await deleteComms(match?.sMatchKey, iMatchId, nInningNumber)
  } catch (error) {
    return error
  }
}

/// for v2 : delete comms
const deleteComms = async (sMatchKey, iMatchId, nInningNumber) => {
  try {
    const commentaryRes = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}/matches/${sMatchKey}/innings/${nInningNumber}/commentary?token=${process.env.ENTITY_SPORT_TOKEN}`)

    const aCommentaryES = commentaryRes?.data?.response?.commentaries

    const aHash = aCommentaryES.map(ele => createHash(ele, 'es'))
    let aDelete = []

    const mongoComms = await CommentariesModel.find({ iMatchId: ObjectId(iMatchId), nInningNumber, sHash: { $nin: aHash } }).lean()

    const duplicatesCheck = await CommentariesModel.aggregate([
      { $match: { iMatchId: ObjectId(iMatchId), nInningNumber } },
      { $group: { _id: '$sHash', count: { $sum: 1 }, arr: { $push: '$$ROOT' } } },
      { $match: { count: { $gt: 1 } } }
    ])

    if (duplicatesCheck?.length) {
      const dupArr = duplicatesCheck.map(d => d.arr.slice(1)).flat(1)
      aDelete = [...dupArr, ...mongoComms]
    } else aDelete = [...mongoComms]

    for (const c of aDelete) {
      await CommentariesModel.deleteOne({ _id: c._id })

      // recalculate overs
      await calculateOvers(c, iMatchId, nInningNumber)
    }

    // delete duplicate overs
    const aDupOvers = await OversModel.aggregate([
      {
        $match: {
          iMatchId: ObjectId(iMatchId), nInningNumber
        }
      }, {
        $group: {
          _id: '$sOver',
          count: {
            $sum: 1
          },
          arr: { $push: '$$ROOT' }
        }
      }, {
        $match: {
          count: {
            $gt: 1
          }
        }
      }
    ]).allowDiskUse(true)

    if (aDupOvers?.length) {
      const dupOverArr = aDupOvers.map(o => o.arr.slice(1)).flat(1)

      for (const o of dupOverArr) {
        await OversModel.deleteOne({ _id: o?._id })
      }
    }
  } catch (error) {
    return error
  }
}

// for commentary v2
const calculateOvers = async (c, iMatchId, nInningNumber) => {
  try {
    let ballOver
    let over
    if (c.eEvent === 'b' || c.eEvent === 'w') {
      ballOver = c.sOver
      over = (parseInt(c.sOver) + 1).toString()
    } else {
      ballOver = (parseInt(c.sOver) - 1).toString()
      over = c.sOver
    }

    const commData = await CommentariesModel.find({ iMatchId: ObjectId(iMatchId), nInningNumber, $or: [{ eEvent: { $ne: 'oe' }, sOver: ballOver }, { eEvent: 'oe', sOver: over }] }).sort({ sEventId: 1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()

    const aNewBall = commData?.filter(ele => ele.eEvent !== 'oe')
    let overDoc = commData?.find(ele => ele.eEvent === 'oe')

    const updateQuery = { iMatchId: ObjectId(iMatchId), nInningNumber, sOver: over }

    if (!overDoc) {
      overDoc = {
        aBatters: [],
        aBowlers: []
      }

      if (c.eEvent === 'b') {
        aNewBall.forEach(ele => {
          if (!overDoc.aBatters?.length) return overDoc.aBatters.push({ iBatterId: ele.iBatterId })

          else if ((overDoc.aBatters.findIndex(b => b?.iBatterId?.toString() === ele.iBatterId?.toString())) < 0) overDoc.aBatters.push({ iBatterId: ele.iBatterId })
        })

        aNewBall?.forEach(ele => {
          if (!overDoc.aBowlers?.length) return overDoc.aBowlers.push({ iBowlerId: ele.iBowlerId })

          else if (overDoc.aBowlers.findIndex(b => b?.iBowlerId?.toString() === ele.iBowlerId?.toString()) < 0) overDoc.aBowlers.push({ iBowlerId: ele.iBowlerId })
        })
      }
    }

    const overObj = {
      iMatchId: ObjectId(iMatchId),
      nInningNumber,
      aBall: aNewBall,
      oOver: overDoc,
      sOver: over
    }

    await OversModel.updateOne(updateQuery, overObj, { upsert: true })

    // subscription
    const updatedOver = await OversModel.findOne(updateQuery, { iMatchId: 1, nInningNumber: 1, sOver: 1, aBall: 1, oOver: 1, nOverTotal: { $sum: '$aBall.nRuns' }, dUpdated: 1 }).populate([
      { path: 'aBall.oBatter' },
      { path: 'aBall.oBowler' },
      { path: 'aBall.oWicketBatter' },
      { path: 'oOver.aBatters.oBatter' },
      { path: 'oOver.aBowlers.oBowler' }
    ]).sort({ sOver: -1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()

    pubsub.publish(`listMatchOvers:${iMatchId?.toString()}`, { listMatchOvers: updatedOver })

    // updating overs
    const aOverScores = aNewBall?.map(ele => ele.sScore)
    await CommentariesModel.updateOne({ ...updateQuery, eEvent: 'oe' }, { aOverScores })
  } catch (error) {
    return error
  }
}

// key - es: Entity Sports
const createHash = (data, key) => typeof data !== 'string' ? crypto.createHmac('sha256', key).update(JSON.stringify(data)).digest('hex') : crypto.createHmac('sha256', key).update(data).digest('hex')

//! old commentary

// const updateOver = async (overs) => {
//   for (const over of overs) {
//     if (over) {
//       const query = {
//         sOver: over.sOver,
//         iMatchId: over.iMatchId,
//         nInningNumber: over.nInningNumber
//       }
//       /** check ball or over end data available for update over collection */
//       if (over.aBall.length > 0 || over.oOverEnd.length > 0) {
//         if (over.oOverEnd.length > 0) {
//           over.oOver = over.oOverEnd[0]
//         }

//         /** check over detail already exist or not */
//         const overObj = await OversModel.findOne(query).lean()
//         let existingBall = []
//         if (overObj) {
//           existingBall = overObj.aBall
//         }
//         let newBallArray = []
//         if (existingBall.length > 0) {
//           newBallArray = [...existingBall, ...over.aBall]
//         } else {
//           newBallArray = [...over.aBall]
//         }
//         over.aBall = newBallArray
//         const oeArray = newBallArray.map(s => {
//           return s.sScore
//         })

//         const updatedOver = await OversModel.findOneAndUpdate(query, over, { upsert: true, new: true, projection: { iMatchId: 1, nInningNumber: 1, sOver: 1, aBall: 1, oOver: 1, nOverTotal: { $sum: '$aBall.nRuns' }, dUpdated: 1 } }).populate([
//           { path: 'aBall.oBatter' },
//           { path: 'aBall.oBowler' },
//           { path: 'aBall.oWicketBatter' },
//           { path: 'oOver.aBatters.oBatter' },
//           { path: 'oOver.aBowlers.oBowler' }
//         ]).sort({ sOver: -1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()
//         query.eEvent = 'oe'
//         await CommentariesModel.updateOne(query, { $set: { aOverScores: oeArray } })

//         pubsub.publish(`listMatchOvers:${query.iMatchId}`, { listMatchOvers: updatedOver })
//       }
//     }
//   }
// }

// const pullCommentary = async () => {
//   try {
//     const matchData = await redisMatchDb.lpop('commentary', 1)
//     if (!matchData) return setTimeout(() => pullCommentary(), 2000)

//     const data = JSON.parse(matchData)
//     if (data && data?.nLatestInningNumber) {
//       axios.get(`${process.env.ENTITY_SPORT_BASE_URL}/matches/${data?.sMatchKey}/innings/${data?.nLatestInningNumber}/commentary?token=${process.env.ENTITY_SPORT_TOKEN}`).then(async (commentaryData) => {
//         const lastCommentaryData = await CommentariesModel.findOne({ iMatchId: data?._id, nInningNumber: data?.nLatestInningNumber }).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()
//         let sLastEventId = ''

//         const lastEventId = await redisMatchDb.get(`lastCommentaryEventId:${data?._id}:${data?.nLatestInningNumber}`)

//         if (lastCommentaryData) {
//           if (!lastEventId) {
//             sLastEventId = lastCommentaryData.sEventId.split('-')[0]
//           } else {
//             sLastEventId = lastEventId
//           }
//         } else {
//           sLastEventId = '0'
//         }

//         let commentaryArr = []

//         if (commentaryData?.data?.response?.commentaries?.length) {
//           if (sLastEventId === '0') {
//             commentaryArr = commentaryData.data.response.commentaries
//           } else {
//             // need to check lastEventID
//             const index = commentaryData.data.response.commentaries.findIndex(s => {
//               if (s.event_id) {
//                 return parseInt(s.event_id.split('-')[0]) > parseInt(sLastEventId.split('-')[0])
//               } else {
//                 return false
//               }
//             })

//             if (index > -1) {
//               if (commentaryData.data.response.commentaries[index - 1].event === 'overend' && lastCommentaryData.eEvent !== 'oe') {
//                 commentaryArr = commentaryData.data.response.commentaries.slice(index - 1)
//               } else {
//                 commentaryArr = commentaryData.data.response.commentaries.slice(index)
//               }
//             }
//           }
//         }
//         if (commentaryArr.length) {
//           if (commentaryArr[commentaryArr.length - 1].event_id) {
//             redisMatchDb.setex(`lastCommentaryEventId:${data._id}:${data?.nLatestInningNumber}`, 300, commentaryArr[commentaryArr.length - 1].event_id)
//           } else {
//             redisMatchDb.setex(`lastCommentaryEventId:${data._id}:${data?.nLatestInningNumber}`, 300, commentaryArr[commentaryArr.length - 2].event_id)
//           }
//         }

//         const insertObj = []
//         const overObj = []
//         for (let j = 0; j < commentaryArr.length; j++) {
//           const { event_id: sEventId, event: eEvent, batsman_id: sBatterKey, bowler_id: sBowlerKey, over: sOver, ball: sBall, score: sScore, commentary: sCommentary, text: sText, run: nRuns, runs: nOeRuns, timestamp: nTimestamp, noball_dismissal: bIsNoBallDismissal, batsman_balls: nBatterBalls, batsman_runs: nBatterRuns, how_out: sHowOut, wicket_batsman_id: sWicketBatterKey, bats: aBatters, bowls: aBowlers } = commentaryArr[j]

//           let obj = {}
//           if (eEvent === 'ball') {
//             obj = {
//               iMatchId: data._id,
//               nInningNumber: data?.nLatestInningNumber,
//               sEventId,
//               eEvent: 'b',
//               iBatterId: await getPlayerIdFromKey(sBatterKey),
//               iBowlerId: await getPlayerIdFromKey(sBowlerKey),
//               sOver,
//               sBall,
//               sScore,
//               nRuns,
//               nTimestamp,
//               sText,
//               sCommentary
//             }
//             if (bIsNoBallDismissal) obj.bIsNoBallDismissal = true
//           } else if (eEvent === 'wicket') {
//             obj = {
//               iMatchId: data._id,
//               nInningNumber: data?.nLatestInningNumber,
//               sEventId,
//               eEvent: 'w',
//               iBatterId: await getPlayerIdFromKey(sBatterKey),
//               iBowlerId: await getPlayerIdFromKey(sBowlerKey),
//               iWicketBatterId: await getPlayerIdFromKey(sWicketBatterKey),
//               sOver,
//               sBall,
//               sScore,
//               nRuns,
//               sHowOut,
//               nBatterRuns,
//               nBatterBalls,
//               nTimestamp,
//               sText,
//               sCommentary
//             }
//             if (bIsNoBallDismissal) obj.bIsNoBallDismissal = true
//           } else if (eEvent === 'overend') {
//             obj = {
//               iMatchId: data._id,
//               nInningNumber: data?.nLatestInningNumber,
//               eEvent: 'oe',
//               sOver,
//               sScore,
//               nRuns: nOeRuns,
//               sCommentary,
//               aBatters: [],
//               aBowlers: []
//             }

//             for (const s of aBatters) {
//               const objBatter = {}

//               objBatter.nRuns = s.runs
//               objBatter.nBallFaced = s.balls_faced
//               objBatter.nFours = s.fours
//               objBatter.nSixes = s.sixes
//               objBatter.iBatterId = await getPlayerIdFromKey(s.batsman_id)

//               obj.aBatters.push(objBatter)
//             }

//             for (const s of aBowlers) {
//               const objBowler = {}

//               objBowler.nRunsConceded = s.runs_conceded
//               objBowler.sOvers = s.overs
//               objBowler.nWickets = s.wickets
//               objBowler.nMaidens = s.maidens
//               objBowler.iBowlerId = await getPlayerIdFromKey(s.bowler_id)

//               obj.aBowlers.push(objBowler)
//             }

//             if (j) {
//               obj.sEventId = commentaryArr[j - 1].event_id + '-1'
//             } else { // when j = 0
//               const lastCommentary = await CommentariesModel.findOne({ iMatchId: data._id, nInningNumber: data?.nLatestInningNumber }).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()
//               obj.sEventId = lastCommentary.sEventId.split('-')[0] + '-1'
//             }
//           } else {
//             continue
//           }

//           // over object crate to store over data
//           if (!overObj[sOver]) {
//             overObj[sOver] = {
//               iMatchId: data._id,
//               nInningNumber: data?.nLatestInningNumber,
//               sOver: parseInt(sOver) + 1,
//               aBall: [],
//               oOverEnd: [],
//               oOver: { aBatters: [], aBowlers: [] }
//             }
//           }

//           if (eEvent !== 'overend') {
//             overObj[sOver].aBall.push(obj)
//             const overData = await OversModel.findOne({ iMatchId: data._id, nInningNumber: data?.nLatestInningNumber, sOver: parseInt(sOver) }).lean()

//             if (overData?.oOver?.aBatters.length) {
//               if (overData?.oOver?.aBatters.findIndex(e => e?.iBatterId.toString() === obj.iBatterId.toString()) < 0) {
//                 overObj[sOver].oOver.aBatters.push({ iBatterId: obj.iBatterId })
//               }
//             }

//             if (overData?.oOver?.aBowlers.length) {
//               if (overData?.oOver?.aBowlers.findIndex(e => e?.iBowlerId.toString() === obj.iBowlerId.toString()) < 0) {
//                 overObj[sOver].oOver.aBowlers.push({ iBowlerId: obj.iBowlerId })
//               }
//             }

//             if (overObj[sOver].oOver.aBatters.findIndex(e => e?.iBatterId.toString() === obj.iBatterId.toString()) < 0) {
//               overObj[sOver].oOver.aBatters.push({ iBatterId: obj.iBatterId })
//             }

//             if (overObj[sOver].oOver.aBowlers.findIndex(e => e?.iBowlerId.toString() === obj.iBowlerId.toString()) < 0) {
//               overObj[sOver].oOver.aBowlers.push({ iBowlerId: obj.iBowlerId })
//             }
//             // overObj[]
//           } else if (eEvent === 'overend') {
//             const overEnd = parseInt(sOver) - 1
//             if (!overObj[overEnd]) {
//               overObj[overEnd] = {
//                 iMatchId: data._id,
//                 nInningNumber: data?.nLatestInningNumber,
//                 sOver: parseInt(sOver),
//                 oOverEnd: []
//               }
//             }
//             overObj[overEnd].oOverEnd.push(obj)
//           }

//           insertObj.push(obj)
//         }
//         await CommentariesModel.insertMany(insertObj)
//         if (insertObj.filter((ele) => ele.iMatchId === data._id).length) {
//           const updatedCommentaries = await CommentariesModel.find({ iMatchId: _.mongify(data._id) }).populate([
//             { path: 'oMatch', select: 'sTitle sSubtitle sFormatStr' },
//             { path: 'oBatter', select: 'sTitle sShortName sFullName' },
//             { path: 'oBowler', select: 'sTitle sShortName sFullName' },
//             { path: 'aBatters.oBatter', select: 'sTitle sShortName sFullName' },
//             { path: 'aBowlers.oBowler', select: 'sTitle sShortName sFullName' }
//           ]).sort({ nInningNumber: -1, sEventId: -1 }).skip(0).limit(insertObj.filter((ele) => ele.iMatchId === data._id).length).collation({ locale: 'en_US', numericOrdering: true }).lean()
//           pubsub.publish(`listMatchCommentaries:${data._id}`, { listMatchCommentaries: updatedCommentaries })
//         }
//         /** update over data */
//         await updateOver(overObj)
//         pullCommentary()
//       }).catch(err => {
//         console.log({ err })
//         pullCommentary()
//       })
//     } else pullCommentary()
//   } catch (error) {
//     console.log({ error })
//     pullCommentary()
//   }
// }

const pullCommentaryV2 = async () => {
  try {
    const matchData = await redisMatchDb.lpop('commentary')
    if (!matchData) return setTimeout(() => pullCommentaryV2(), 2000)

    if (matchData) {
      const data = JSON.parse(matchData)

      const { _id: iMatchId, nLatestInningNumber: nInningNumber, sMatchKey } = data

      const commentaryRes = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}/matches/${sMatchKey}/innings/${nInningNumber}/commentary?token=${process.env.ENTITY_SPORT_TOKEN}`)

      let nStatus
      let nGameState
      let aCommentaryES = []
      const commRes = commentaryRes.data.response
      if (typeof commRes !== 'string') {
        aCommentaryES = commRes?.commentaries
        nStatus = commRes.match.status
        nGameState = commRes?.match?.game_state
      }

      if (aCommentaryES?.length) {
        const mongoComm = await CommentariesModel.find({ iMatchId: ObjectId(iMatchId), nInningNumber }).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()

        let aNewComm = []
        const nLastIndex = aCommentaryES.findIndex(ele => {
          if (ele?.event_id) {
            return parseInt(ele.event_id) > parseInt(mongoComm[0]?.sEventId.split('-')[0])
          } else if (ele.event === 'overend') {
            return ele.over > parseInt(mongoComm[0]?.sOver)
          } else {
            return false
          }
        })

        if (nLastIndex > -1) {
          aNewComm = aCommentaryES.slice(nLastIndex)
        } else if (!mongoComm?.length) {
          aNewComm = aCommentaryES
        }
        if (aNewComm?.length) {
          await updateCommFun(aNewComm, iMatchId, nInningNumber, aCommentaryES)

          // send subscription
          const updatedCommentaries = await CommentariesModel.find({ iMatchId: ObjectId(iMatchId) })
            .populate({ path: 'oMatch', select: 'sTitle sSubtitle sFormatStr' })
            .populate({ path: 'oBatter', select: 'sTitle sShortName sFullName' })
            .populate({ path: 'oBowler', select: 'sTitle sShortName sFullName' })
            .populate({ path: 'oWicketBatter', select: 'sTitle sShortName sFullName sThumbUrl' })
            .populate({ path: 'aBatters.oBatter', select: 'sTitle sShortName sFullName' })
            .populate({ path: 'aBowlers.oBowler', select: 'sTitle sShortName sFullName' })
            .sort({ nInningNumber: -1, sEventId: -1 })
            .skip(0)
            .limit(aNewComm?.length)
            .collation({ locale: 'en_US', numericOrdering: true }).lean()

          pubsub.publish(`listMatchCommentaries:${iMatchId?.toString()}`, { listMatchCommentaries: updatedCommentaries })
        }

        // check commentary when match is over
        if (nStatus === 2 || [5, 6, 7, 8, 9].includes(nGameState)) {
          await checkCommentary(aCommentaryES, iMatchId, nInningNumber)
        }
      }
      setTimeout(() => pullCommentaryV2(), 2000)
    }
  } catch (error) {
    pullCommentaryV2()
    return error
  }
}

setTimeout(() => {
  // pullCommentary()
  pullCommentaryV2()
}, 2000)

module.exports = new CommentaryService()
