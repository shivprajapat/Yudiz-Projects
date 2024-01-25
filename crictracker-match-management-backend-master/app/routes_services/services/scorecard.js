/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
const async = require('async')
const axios = require('axios')
const moment = require('moment')
const { ObjectId } = require('mongodb')
const { redis } = require('../../utils')
const { matches: MatchesModel, enums: EnumsModel, fullscorecards: FullScorecardsModel, liveinnings: LiveInningsModel, series: SeriesModel, miniscorecards: MiniScorecardModel, teams, CommentariesModel, MiniScoreCardHeader, matchoverviews: MatchesOverViewModel } = require('../../model')
const { getPlayerIdFromKey, getTeamIdFromKey, getVenueIdFromVenueObj, updateSeriesStatusFun, fetchMatchSquadFun, fetchSeriesSquadFun } = require('../../modules/match/common')
const _ = require('../../../global')
const { scheduleMatchTask } = require('../../utils')
const { redisMatchDb } = require('../../utils/lib/redis')
const { eUpdateStatsType, eMatchFormat } = require('../../model/enums')
const { getSeriesIdFromKey } = require('../../modules/match/common')
const config = require('../../../config')
const grpcController = require('../../grpc/client/')
const { createPoll } = require('../../modules/Common/controllers')

class Scorecard {
  async updateMatchInfo(req, res) {
    try {
      const { iMatchId, iSeriesId } = req.body
      this.setMatchInfo(iMatchId, iSeriesId)
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'match-info Done', data: 'Done' })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'match-info Error' })
    }
  }

  async setMatchInfo(iMatchId, iSeriesId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const matchSeoArr = []
          const startDate = moment().add(12, 'hours').toDate()
          const endDate = moment().subtract(1, 'hours').toDate()
          const startDateTBA = moment().add(12, 'days').toDate()
          const endDateTBA = moment().subtract(1, 'hours').toDate()
          let query = {}

          const TBAId = await teams.findOne({ $or: [{ sTitle: 'TBA' }, { sTeamKey: '111066' }] }, { _id: 1 }).lean()

          if (iMatchId) {
            query._id = iMatchId
          } else if (iSeriesId) {
            query.iSeriesId = ObjectId(iSeriesId)
          } else {
            query = {
              $or: [
                { dStartDate: { $lt: startDate }, dEndDate: { $gt: endDate } },
                { sLiveGameStatusStr: 'stumps' },
                { 'oTeamScoreA.iTeamId': ObjectId(TBAId._id), dStartDate: { $lt: startDateTBA }, dEndDate: { $gt: endDateTBA } },
                { 'oTeamScoreB.iTeamId': ObjectId(TBAId._id), dStartDate: { $lt: startDateTBA }, dEndDate: { $gt: endDateTBA } }
              ]
            }
          }

          const matches = await MatchesModel.find(query).lean()

          async.each(matches, async (s) => {
            if (s?.bEntityAccess !== false || typeof s?.bEntityAccess !== 'boolean') {
              await fetchSeriesSquadFun(s.sSeriesKey)
              await fetchMatchSquadFun(s.sMatchKey)

              axios.get(`https://rest.entitysport.com/v2/matches/${s.sMatchKey}/info`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then(async (matchRes) => {
                const { match_id: sMatchKey, title: sTitle, short_title: sShortTitle, subtitle: sSubtitle, status_note: sStatusNote, status: iStatusId, game_state: iLiveGameStatusId, teama: oTeamA, teamb: oTeamB, verified: bVerified, pre_squad: bPreSquad, venue: oVenue, equation: sEquation, umpires: sUmpires, referee: sReferee, commentary: bIsCommentary, date_start: dStartDate, date_end: dEndDate, timestamp_start: dStartTimestamp, timestamp_end: dEndTimestamp, latest_inning_number: nLatestInningNumber, toss: oToss, live: sLiveMatchNote, wagon: bIsWagon, etag: sETag, winning_team_id: sWinnerKey, weather, pitch } = matchRes.data.response
                // console.log({ chec: matchRes.data.response?.title })
                const match = await MatchesModel.findOne({ sMatchKey })
                if (match.sETag !== sETag) {
                  const obj = {}

                  const statusData = await EnumsModel.find({ $or: [{ sKey: iStatusId, eType: 'msc' }, { sKey: iLiveGameStatusId, eType: 'lmsc' }] })

                  const mscIndex = statusData.findIndex(s => s.eType === 'msc')
                  const lmscIndex = statusData.findIndex(s => s.eType === 'lmsc')

                  if (mscIndex > -1) {
                    obj.iStatusId = statusData[mscIndex]._id
                    obj.sStatusStr = statusData[mscIndex].sValue
                  }
                  if (lmscIndex > -1) {
                    obj.iLiveGameStatusId = statusData[lmscIndex]._id
                    obj.sLiveGameStatusStr = statusData[lmscIndex].sValue
                  }

                  const { team_id: sTeamKeyA, scores_full: sScoresFullA, scores: sScoresA, overs: sOversA } = oTeamA

                  const teamData1 = await getTeamIdFromKey(sTeamKeyA.toString(), 'details')
                  const oTeamScoreA = {
                    iTeamId: teamData1?._id,
                    sScoresFull: sScoresFullA,
                    sScores: sScoresA,
                    sOvers: sOversA
                  }

                  const { team_id: sTeamKeyB, scores_full: sScoresFullB, scores: sScoresB, overs: sOversB } = oTeamB

                  const teamData2 = await getTeamIdFromKey(sTeamKeyB.toString(), 'details')
                  const oTeamScoreB = {
                    iTeamId: teamData2?._id,
                    sScoresFull: sScoresFullB,
                    sScores: sScoresB,
                    sOvers: sOversB
                  }

                  obj.sTitle = sTitle
                  obj.sShortTitle = sShortTitle
                  obj.sSubtitle = sSubtitle
                  obj.oTeamScoreA = oTeamScoreA
                  obj.oTeamScoreB = oTeamScoreB
                  if (sStatusNote) obj.sStatusNote = sStatusNote.replace(/&amp;/g, '&')
                  obj.bVerified = bVerified === 'true'
                  obj.bPreSquad = bPreSquad === 'true'
                  obj.sEquation = sEquation
                  obj.sUmpires = sUmpires
                  obj.sReferee = sReferee
                  obj.bIsCommentary = bIsCommentary === 1
                  obj.nLatestInningNumber = nLatestInningNumber
                  obj.sLiveMatchNote = sLiveMatchNote
                  obj.dStartDate = moment.utc(dStartDate, 'YYYY-MM-DD hh:mm:ss').toDate()
                  obj.dEndDate = moment.utc(dEndDate, 'YYYY-MM-DD hh:mm:ss').toDate()
                  obj.dStartTimestamp = dStartTimestamp
                  obj.dEndTimestamp = dEndTimestamp
                  obj.bIsWagon = bIsWagon === 1
                  obj.sETag = sETag
                  obj.dUpdated = Date.now()
                  if (sWinnerKey) obj.iWinnerId = await getTeamIdFromKey(sWinnerKey)

                  if (oVenue && Object.keys(oVenue).length) {
                    const venueId = await getVenueIdFromVenueObj(oVenue)
                    obj.iVenueId = venueId
                  }

                  if (oToss && oToss.winner) {
                    const winnerId = await getTeamIdFromKey(oToss.winner)
                    const checkForPlaying11 = await CommentariesModel.find({ $or: [{ sEventId: '0-1', eEvent: 'p11' }, { sEventId: '0', eEvent: 'to' }], iMatchId: ObjectId(match?._id) }).lean()
                    if (checkForPlaying11.length < 2) fetchMatchSquadFun(sMatchKey)

                    const decision = await EnumsModel.findOne({ sKey: oToss.decision, eType: 'mtd' })
                    if (winnerId) {
                      obj.oToss = {
                        sText: oToss.text,
                        iWinnerTeamId: winnerId,
                        eDecision: decision.sValue
                      }
                    }
                  }

                  if (Object.keys(obj).length) {
                    const updatedMatch = await MatchesModel.findByIdAndUpdate(s._id, obj, { new: true })

                    // updating slug of TBA vs TBA match
                    if (s.oTeamScoreA?.iTeamId?.toString() === TBAId?._id?.toString() || s.oTeamScoreB?.iTeamId?.toString() === TBAId._id?.toString()) {
                      if (updatedMatch?.oTeamScoreA?.iTeamId?.toString() !== TBAId?._id?.toString() && updatedMatch?.oTeamScoreB?.iTeamId?.toString() !== TBAId._id?.toString() && !s?.aPollId) {
                        createPoll(s, teamData1, teamData2)
                      }

                      const sMatchInfo = eMatchFormat?.description[`${updatedMatch?.sFormatStr}`]

                      const seriesDetail = await getSeriesIdFromKey(s.sSeriesKey, 'details')

                      const seoParams = {
                        iId: updatedMatch._id.toString(),
                        eType: 'ma',
                        sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score | ${teamData1.sTitle} vs ${teamData2.sTitle} Score & Updates`,
                        sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score: Get all the latest ${teamData1.sTitle} vs $${teamData2.sTitle} ${sMatchInfo} Live Score, ball by ball commentary & cricket updates on CricTracker.`
                      }

                      let formatStr = await MatchesModel.distinct('sFormatStr')

                      formatStr.shift()

                      formatStr = formatStr.map((ele) => ele?.toLowerCase()?.split(' ')?.join('-'))

                      let type

                      if (updatedMatch?.sSubtitle) {
                        updatedMatch.sSubtitle = updatedMatch?.sSubtitle?.toLowerCase().split(' ').join('-')
                        if (formatStr.some((ele) => updatedMatch?.sSubtitle.includes(ele))) type = updatedMatch?.sSubtitle
                        else type = `${updatedMatch?.sSubtitle.toLowerCase().split(' ').join('-')}-${updatedMatch?.sFormatStr}`
                      } else type = updatedMatch?.sFormatStr

                      const date = new Date(updatedMatch.dStartDate).toDateString().toLocaleLowerCase().split(' ')

                      seoParams.sSlug = `live-scores/${teamData1.sAbbr}-vs-${teamData2.sAbbr}-${type}-${seriesDetail.sTitle}-${date[2]}-${date[1]}-${date[3]}`
                      // queuePush('addSeoData', seoParams)

                      matchSeoArr.push(seoParams)

                      // matchSeoBuilder(updatedMatch, teamData1, teamData2, sMatchInfo, seriesDetail, queuePush)
                    }

                    if (eUpdateStatsType.value.includes(updatedMatch?.sStatusStr)) {
                      if (!s.dMatchEndTime) {
                        MatchesModel.findByIdAndUpdate(s._id, { $set: { dMatchEndTime: moment().toDate() } }).exec()
                      }
                      // update standings on multiple time
                      scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: s.sSeriesKey, _id: s.iSeriesId } }, moment().unix())
                      scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: s.sSeriesKey, _id: s.iSeriesId } }, moment().add('1', 'hour').unix())

                      // update player stats on multiple time
                      scheduleMatchTask({ eType: 'playerStats', data: { sMatchKey: s.sMatchKey, _id: s._id } }, moment().unix())
                      scheduleMatchTask({ eType: 'playerStats', data: { sMatchKey: s.sMatchKey, _id: s._id } }, moment().add('1', 'hour').unix())

                      // it will add stats into scheduler
                      // scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: s.sSeriesKey } }, moment().unix())
                      // scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: s.sSeriesKey } }, moment().add('1', 'hours').unix())

                      // update series status
                      updateSeriesStatusFun(s.sSeriesKey)
                    }

                    if (updatedMatch?.sLiveGameStatusStr === 'stumps') {
                      scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: s.sSeriesKey, _id: s.iSeriesId } }, moment().unix())
                      // scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: s.sSeriesKey } }, moment().unix())
                    }
                  }
                  await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: matchSeoArr }, { headers: { 'Content-Type': 'application/json' } })
                  const oWeather = {
                    sWeather: weather?.weather,
                    sDesc: weather?.weather_desc,
                    nTemp: weather?.temp,
                    nHumidity: weather?.humidity,
                    nVisibility: weather?.visibility,
                    nWindSpeed: weather?.wind_speed,
                    nClouds: weather?.clouds
                  }
                  const oPitch = {
                    sCondition: pitch?.pitch_condition,
                    sBatting: pitch?.batting_condition,
                    sPaceBowling: pitch?.pace_bowling_condition,
                    sSpinBowling: pitch?.spine_bowling_condition
                  }
                  await MatchesOverViewModel.updateOne({ iMatchId: match?._id }, { oWeather, oPitch }, { upsert: true }).lean()
                }
              }).catch(error => {
                if (error?.response?.data?.status) {
                  if (error?.response?.data?.status === 'forbidden') {
                    console.log({ dddtt: error?.response?.data?.status === 'forbidden' })
                  }
                  resolve({ message: console.log('match-info:forbidden match', s.sMatchKey) })
                } else {
                  resolve({ error, message: 'done' })
                }
              })
            }
          }, (error) => {
            console.log('done', error)
            resolve({ error, message: 'done' })
          })
        } catch (error) {
          reject(error)
        }
      })()
    })
  }

  async storeMiniScorecard(req, res) {
    try {
      const startDate = moment().subtract(8, 'days').toDate()
      const endDate = moment().add(3, 'days').toDate()

      let liveMatches = await MatchesModel.find({ sStatusStr: 'live', $nor: [{ sFormatStr: 'firstclass' }], dStartDate: { $gt: startDate, $lt: endDate } }).populate([
        { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini sSrtTitle nTotalTeams iCategoryId' },
        { path: 'oVenue', select: 'sName sLocation' },
        { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'aFantasyTips', match: { eState: 'pub' }, select: '_id' }
      ]).sort({ dStartDate: -1 }).lean()

      let scheduledMatches = await MatchesModel.find({
        $or: [
          {
            $and: [
              { iSeriesId: ObjectId('63f052b9d5e097df610db62d') },
              { dStartDate: { $gt: moment().startOf('day').toDate() } },
              { dStartDate: { $lt: moment().add(15, 'days').toDate() } },
              { sStatusStr: 'scheduled' }
            ]
          },
          {
            $and: [
              { dStartDate: { $gt: moment().startOf('day').toDate() } },
              { dStartDate: { $lt: moment().add(3, 'days').toDate() } },
              { sStatusStr: 'scheduled' }
            ]
          }
        ]
      }).populate([
        { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini sSrtTitle nTotalTeams iCategoryId' },
        { path: 'oVenue', select: 'sName sLocation' },
        { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'aFantasyTips', match: { eState: 'pub' }, select: '_id' }
      ]).sort({ dStartDate: 1 }).lean()

      let completedLatestMatches = await MatchesModel.find({ $and: [{ dMatchEndTime: { $exists: true } }, { dMatchEndTime: { $gt: moment().subtract(2, 'days').toDate() } }, { $or: [{ sStatusStr: 'cancelled' }, { sStatusStr: 'completed' }] }], $nor: [{ sFormatStr: 'firstclass' }] }).populate([
        { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini sSrtTitle nTotalTeams iCategoryId' },
        { path: 'oVenue', select: 'sName sLocation' },
        { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oWinner', select: '_id sTitle sAbbr oImg' },
        { path: 'aFantasyTips', match: { eState: 'pub' }, select: '_id' }
      ]).sort({ dStartDate: -1 }).limit(3).lean()

      let completedMatches = await MatchesModel.find({ _id: { $nin: completedLatestMatches.map((ele) => ele._id) }, $and: [{ dEndDate: { $gt: moment().subtract(3, 'days').toDate() } }, { sStatusStr: 'completed' }], $nor: [{ sFormatStr: 'firstclass' }] }).populate([
        { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini sSrtTitle nTotalTeams iCategoryId' },
        { path: 'oVenue', select: 'sName sLocation' },
        { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oWinner', select: '_id sTitle sAbbr oImg' },
        { path: 'aFantasyTips', match: { eState: 'pub' }, select: '_id' }
      ]).sort({ dStartDate: -1 }).lean()

      liveMatches = liveMatches.filter(s => !s?.oSeries?.isBlockedMini)
      completedLatestMatches = completedLatestMatches.filter(s => !s?.oSeries?.isBlockedMini)
      scheduledMatches = scheduledMatches.filter(s => !s?.oSeries?.isBlockedMini)
      completedMatches = completedMatches.filter(s => !s?.oSeries?.isBlockedMini && +new Date() - +new Date(s.dStartDate) < 64800000)

      let sortBy
      let allMatches = []

      const grpcData = await grpcController.getMiniScorePriority({})

      if (grpcData?.aMiniScorePriority) {
        sortBy = grpcData?.aMiniScorePriority.sort((a, b) => a.nPriority - b.nPriority).map(ele => ele?.sSrtTitle.toLowerCase())
      } else {
        sortBy = ['indian premier league', 'women\'s premier league', 'india', 'icc', 'australia', 'pakistan', 'england', 'new zealand', 'west indies', 'bangladesh', 'afghanistan', 'sri lanka']
      }

      liveMatches = _.customSortByPriority({ data: liveMatches, sortBy })
      completedLatestMatches = _.customSortByPriority({ data: completedLatestMatches, sortBy })
      scheduledMatches = _.customSortByPriority({ data: scheduledMatches, sortBy })
      completedMatches = _.customSortByPriority({ data: completedMatches, sortBy })

      // await queuePush('scoreCard', { liveMatches, scheduledMatches, completedLatestMatches })

      const countArr = []

      scheduledMatches = scheduledMatches.filter((ele) => {
        const countIndex = countArr.findIndex((elem) => elem._id.toString() === ele.iSeriesId.toString())
        if (countIndex > -1) {
          if (countArr[countIndex].count >= 2) {
            return false
          } else {
            countArr[countIndex].count += 1
            return true
          }
        } else {
          countArr.push({ _id: ele.iSeriesId.toString(), count: 1 })
          return true
        }
      })

      scheduledMatches = scheduledMatches.slice(0, (liveMatches.length + completedLatestMatches.length) > 7 ? 4 : 7)
      completedMatches = completedMatches.slice(0, (liveMatches.length + completedLatestMatches.length + scheduledMatches.length) > 9 ? 3 : 5)

      allMatches = [...liveMatches, ...completedLatestMatches, ...scheduledMatches, ...completedMatches]

      const miniScoreCardHeader = [...new Set(allMatches.slice(0, 14).map((ele) => ele.iSeriesId.toString()))].map((ele, index) => ({ iSeriesId: ele, nPriority: index }))

      const insertQueries = []
      miniScoreCardHeader.map(object => insertQueries.push({ insertOne: { document: object } }))
      await MiniScoreCardHeader.bulkWrite([
        {
          deleteMany: {
            filter: {}
          }
        },
        ...insertQueries.map(ele => ele)
      ])

      allMatches.forEach((s, i) => {
        s.nPriority = i + 1
        s.iMatchId = s._id
        s.dStartDate = moment.utc(s.dStartDate, 'YYYY-MM-DD hh:mm:ss').toDate()
        s.dEndDate = moment.utc(s.dEndDate, 'YYYY-MM-DD hh:mm:ss').toDate()
        return s
      })

      let iFlag = 0
      for await (const m of allMatches) {
        const aFantasyTipsSlug = []
        if (m.nLatestInningNumber && m._id) {
          const inning = await LiveInningsModel.findOne({ iMatchId: m._id, nInningNumber: m.nLatestInningNumber }).lean()

          if (inning) {
            allMatches[iFlag].iBattingTeamId = inning.iBattingTeamId
            allMatches[iFlag].iFieldingTeamId = inning.iFieldingTeamId
          }
        }

        for (const fa of m?.aFantasyTips) {
          const { data: { data } } = await axios.get(`${config.SEO_REST_URL}api/seo/${fa._id}`)
          aFantasyTipsSlug.push(data?.sSlug)
        }

        allMatches[iFlag].aFantasyTipsSlug = aFantasyTipsSlug
        iFlag++
      }

      await MiniScorecardModel.deleteMany()
      await MiniScorecardModel.insertMany(allMatches, { ordered: false })
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'mini-scorecard Done', data: { allMatches } })
    } catch (error) {
      console.log({ miniscorecard: error })
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'mini-scorecard Error' })
    }
  }

  // Scorecard;
  // Squad;
  // Commentaries
  async fixMissingSquads(req, res) {
    try {
      // const seriesSquad = await SeriesSquadModel.find({ sSeriesKey: series.sSeriesKey }).lean()
      // if (!seriesSquad?.length) {
      //   console.log(seriesSquad?.length)
      //   await fetchSeriesSquadFun(series.sSeriesKey)
      // }
      const matches = []
      const allMatches = await MatchesModel.find().sort({ _id: 1 }).lean()
      for (const match of allMatches) {
        console.log(match?._id)
        const liveInnings = await LiveInningsModel.find({ iMatchId: _.mongify(match._id) })
        if (!liveInnings.length) matches.push(match?._id)
        // if (!liveInnings.length) {
        //   const parsedMatch = match
        //   axios.get(`https://rest.entitysport.com/v2/matches/${parsedMatch?.sMatchKey}/scorecard`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then(async (res) => {
        //     if (!parsedMatch?.sETag || parsedMatch?.sETag !== res.data.etag) {
        //       const {
        //         equation: sEquation,
        //         latest_inning_number: nLatestInningNumber,
        //         man_of_the_match: oMom,
        //         man_of_the_series: oMos,
        //         is_followon: bIsFollowOn,
        //         win_margin: sWinMargin,
        //         current_over: sCurrentOver,
        //         previous_over: sPreviousOver,
        //         last_five_overs: sLastFiveOvers,
        //         teama,
        //         teamb,
        //         live: sLiveMatchNote,
        //         result: sResult,
        //         status,
        //         winning_team_id: sWinnerKey,
        //         day_remaining_over: sDayRemainingOver,
        //         match_notes: aMatchNote
        //       } = res.data.response
        //       const oTeamScoreA = {}
        //       const oTeamScoreB = {}
        //       let sMomKey = ''
        //       let sMosKey = ''
        //       const teamAdata = await getTeamIdFromKey(teama.team_id, 'details')
        //       oTeamScoreA.iTeamId = teamAdata._id
        //       oTeamScoreA.sScoresFull = teama.scores_full
        //       oTeamScoreA.sScores = teama.scores
        //       oTeamScoreA.sOvers = teama.overs
        //       oTeamScoreA.oTeam = {
        //         _id: teamAdata._id,
        //         sTitle: teamAdata.sTitle,
        //         sAbbr: teamAdata.sAbbr,
        //         oImg: teamAdata.oImg
        //       }

        //       const teamBdata = await getTeamIdFromKey(teamb.team_id, 'details')

        //       oTeamScoreB.iTeamId = teamBdata._id
        //       oTeamScoreB.sScoresFull = teamb.scores_full
        //       oTeamScoreB.sScores = teamb.scores
        //       oTeamScoreB.sOvers = teamb.overs
        //       oTeamScoreB.oTeam = {
        //         _id: teamBdata._id,
        //         sTitle: teamBdata.sTitle,
        //         sAbbr: teamBdata.sAbbr,
        //         oImg: teamBdata.oImg
        //       }

        //       sMomKey = oMom?.pid || null
        //       sMosKey = oMos?.pid || null
        //       const updatedData = {
        //         iMatchId: parsedMatch?._id,
        //         iSeriesId: parsedMatch?.iSeriesId,
        //         iVenueId: parsedMatch?.iVenueId,
        //         sEquation,
        //         nLatestInningNumber,
        //         oTeamScoreA,
        //         oTeamScoreB,
        //         sLiveMatchNote,
        //         sResult,
        //         bIsFollowOn,
        //         sWinMargin,
        //         sCurrentOver,
        //         sPreviousOver,
        //         sETag: res.data.etag,
        //         eProvider: 'es',
        //         sDayRemainingOver
        //       }

        //       if (sWinnerKey) updatedData.iWinnerId = await getTeamIdFromKey(sWinnerKey)

        //       if (sLastFiveOvers && typeof sLastFiveOvers === 'string') updatedData.sLastFiveOvers = sLastFiveOvers

        //       if (sMomKey) {
        //         updatedData.iMomId = await getPlayerIdFromKey(sMomKey)
        //       } else {
        //         updatedData.iMomId = null
        //       }
        //       if (sMosKey) {
        //         updatedData.iMosId = await getPlayerIdFromKey(sMosKey)
        //       } else {
        //         updatedData.iMosId = null
        //       }

        //       updateLiveFullScorecardData({ _id: parsedMatch?._id }, updatedData).then().catch()
        //       updateLiveMiniScorecardData({ _id: parsedMatch?._id }, updatedData).then().catch()

        //       if (res.data.response.innings && res.data.response.innings.length) {
        //         for (let i = 0; i < res.data.response.innings.length; i++) {
        //           const {
        //             iid: sInningId,
        //             number: nInningNumber,
        //             name: sName,
        //             short_name: sShortName,
        //             batting_team_id: sBattingTeamKey,
        //             fielding_team_id: sFieldingTeamKey,
        //             batsmen: aBatsman,
        //             bowlers: aBowler,
        //             fielder: aFielder,
        //             last_wicket,
        //             fows: aFow,
        //             extra_runs: oER,
        //             equations: oEq,
        //             current_partnership: oCP,
        //             status: sLiveInningStatus,
        //             result: sLiveInningResult,
        //             powerplay: oPowerPlay,
        //             review: oReview,
        //             did_not_bat: aDidNotBatsMan
        //           } = res.data.response.innings[i]

        //           if (nInningNumber && sBattingTeamKey && sFieldingTeamKey) {
        //             const aBatters = []
        //             const aBowlers = []
        //             const aFielders = []
        //             const aFOWs = []
        //             const aPowerPlay = []
        //             const aDidNotBat = []
        //             let aInningNote = []

        //             if (!Array.isArray(oPowerPlay) && Object.keys(oPowerPlay).length) {
        //               const aPowerPlayKey = Object.keys(oPowerPlay)
        //               aPowerPlay.push(...aPowerPlayKey.map((ele) => ({
        //                 sPowerPlay: ele,
        //                 sStartOver: oPowerPlay[ele]?.startover,
        //                 sEndOver: oPowerPlay[ele]?.endover
        //               })))
        //             }

        //             const oBattingReview = {
        //               nTotal: parseInt(oReview?.batting?.batting_team_total_review),
        //               nSuccess: parseInt(oReview?.batting?.batting_team_review_success),
        //               nFailed: parseInt(oReview?.batting?.batting_team_review_failed),
        //               nAvailable: parseInt(oReview?.batting?.batting_team_review_available)
        //             }

        //             const oBowlingReview = {
        //               nTotal: parseInt(oReview?.bowling?.bowling_team_total_review),
        //               nSuccess: parseInt(oReview?.bowling?.bowling_team_review_success),
        //               nFailed: parseInt(oReview?.bowling?.bowling_team_review_failed),
        //               nAvailable: parseInt(oReview?.bowling?.bowling_team_review_available)
        //             }

        //             if (aDidNotBatsMan.length) {
        //               for (const oDidNotBatsMan of aDidNotBatsMan) {
        //                 aDidNotBat.push(await getPlayerIdFromKey(oDidNotBatsMan?.player_id))
        //               }
        //             }

        //             if (aMatchNote.length && aMatchNote[i].length) aInningNote = aMatchNote[i]

        //             for (const s of aBatsman) {
        //               const obj = {}

        //               obj.iBatterId = await getPlayerIdFromKey(s.batsman_id)
        //               obj.bIsBatting = s.batting === 'true'
        //               if (s.position && s.batting === 'true') obj.ePosition = s.position === 'striker' ? 's' : 'ns'
        //               obj.nRuns = s.runs
        //               obj.nBallFaced = s.balls_faced
        //               obj.nFours = s.fours
        //               obj.nSixes = s.sixes
        //               obj.nDots = s.run0
        //               obj.nSingles = s.run1
        //               obj.nDoubles = s.run2
        //               obj.nThree = s.run3
        //               obj.nFives = s.run5
        //               obj.sHowOut = s.how_out
        //               if (s.dismissal) obj.eDismissal = s.dismissal
        //               obj.sStrikeRate = s.strike_rate
        //               if (s.bowler_id) obj.iBowlerId = await getPlayerIdFromKey(s.bowler_id)
        //               if (s.first_fielder_id) obj.iFirstFielderId = await getPlayerIdFromKey(s.first_fielder_id)
        //               if (s.second_fielder_id) obj.iSecondFielderId = await getPlayerIdFromKey(s.second_fielder_id)
        //               if (s.third_fielder_id) obj.iThirdFielderId = await getPlayerIdFromKey(s.third_fielder_id)

        //               aBatters.push(obj)
        //             }
        //             for (const s of aBowler) {
        //               const obj = {}

        //               obj.iBowlerId = await getPlayerIdFromKey(s.bowler_id)
        //               obj.bIsBowling = s.bowling === 'true'
        //               if (s.position) obj.ePosition = s.position === 'active bowler' ? 'ab' : 'lb'
        //               obj.sOvers = s.overs
        //               obj.nMaidens = s.maidens
        //               obj.nRunsConceded = s.runs_conceded
        //               obj.nWickets = s.wickets
        //               obj.nNoBalls = s.noballs
        //               obj.nWides = s.wides
        //               obj.nDotBalls = s.run0
        //               obj.sEcon = s.econ
        //               obj.nBowled = s.bowledcount
        //               obj.nLbw = s.lbwcount

        //               aBowlers.push(obj)
        //             }
        //             for (const s of aFielder) {
        //               const obj = {}
        //               obj.iFielderId = await getPlayerIdFromKey(s.fielder_id)
        //               obj.sFielderName = s.fielder_name
        //               obj.nCatches = s.catches
        //               obj.nRunoutThrow = s.runout_thrower
        //               obj.nRunoutCatcher = s.runout_catcher
        //               obj.nRunoutDirect = s.runout_direct_hit
        //               obj.bIsSubstitute = s.is_substitute
        //               obj.nStumping = s.stumping

        //               aFielders.push(obj)
        //             }
        //             for (const s of aFow) {
        //               const obj = {}
        //               obj.iBatterId = await getPlayerIdFromKey(s.batsman_id)
        //               obj.nRuns = s.runs
        //               obj.nBallFaced = s.balls
        //               obj.sHowOut = s.how_out
        //               obj.nScoreDismissal = s.score_at_dismissal
        //               obj.sOverDismissal = s.overs_at_dismissal
        //               obj.iBowlerId = await getPlayerIdFromKey(s.bowler_id)
        //               obj.eDismissal = s.dismissal
        //               obj.nWicketNumber = s.number

        //               aFOWs.push(obj)
        //             }

        //             const oLastWicket = {
        //               iBatterId: await getPlayerIdFromKey(last_wicket.batsman_id),
        //               nRuns: last_wicket.runs,
        //               nBallFaced: last_wicket.balls,
        //               sHowOut: last_wicket.how_out,
        //               nScoreDismissal: last_wicket.score_dismissal,
        //               sOverDismissal: last_wicket.over_dismissal,
        //               iBowlerId: await getPlayerIdFromKey(last_wicket.bowler_id),
        //               eDismissal: last_wicket.dismissal,
        //               nWicketNumber: last_wicket.number
        //             }
        //             const oExtraRuns = {
        //               nByes: oER.byes,
        //               nLegByes: oER.legbyes,
        //               nWides: oER.wides,
        //               nNoBalls: oER.noballs,
        //               nPenalty: oER.penalty,
        //               nTotal: oER.total
        //             }
        //             const oEquations = {
        //               nRuns: oEq.runs,
        //               nWickets: oEq.wickets,
        //               sOvers: oEq.overs,
        //               nBowlersUsed: oEq.bowlers_used,
        //               sRunRate: oEq.runrate
        //             }

        //             let oCurrentPartnership = {}
        //             if (oCP && 'runs' in oCP) {
        //               oCurrentPartnership = {
        //                 nRuns: oCP.runs,
        //                 nBalls: oCP.balls,
        //                 sOvers: oCP.overs,
        //                 aBatters: []
        //               }
        //               oCP.batsmen.forEach(async (s) => {
        //                 const obj = {}
        //                 obj.iBatterId = await getPlayerIdFromKey(s.batsman_id)
        //                 obj.nRuns = s.runs
        //                 obj.nBalls = s.balls

        //                 oCurrentPartnership.aBatters.push(obj)
        //               })
        //             }

        //             let LiveInningStatusData
        //             let LiveInningResultData
        //             if (sLiveInningStatus?.toString()) LiveInningStatusData = await EnumsModel.findOne({ $or: [{ sKey: sLiveInningStatus.toString(), eType: 'isc' }] })
        //             if (sLiveInningResult?.toString()) LiveInningResultData = await EnumsModel.findOne({ $or: [{ sKey: sLiveInningResult.toString(), eType: 'irc' }] })

        //             const liveInningUpdatedData = {
        //               iMatchId: parsedMatch._id,
        //               sInningId,
        //               nInningNumber,
        //               sName,
        //               sShortName,
        //               iBattingTeamId: await getTeamIdFromKey(sBattingTeamKey),
        //               iFieldingTeamId: await getTeamIdFromKey(sFieldingTeamKey),
        //               aBatters,
        //               aBowlers,
        //               aFielders,
        //               aFOWs,
        //               oLastWicket,
        //               oExtraRuns,
        //               oEquations,
        //               sEtag: res.data.etag,
        //               eProvider: 'es',
        //               aPowerPlay,
        //               oBattingReview,
        //               oBowlingReview,
        //               aInningNote,
        //               aDidNotBat
        //             }

        //             if (LiveInningStatusData) {
        //               liveInningUpdatedData.iStatusId = LiveInningStatusData._id
        //               liveInningUpdatedData.sStatusStr = LiveInningStatusData.sValue
        //             }
        //             if (LiveInningResultData) {
        //               liveInningUpdatedData.iResultId = LiveInningResultData._id
        //               liveInningUpdatedData.sResultStr = LiveInningResultData.sValue
        //             }
        //             if (Object.keys(oCurrentPartnership).length) liveInningUpdatedData.oCurrentPartnership = oCurrentPartnership
        //             if (nInningNumber) updateLiveInningData({ _id: parsedMatch._id, nInningNumber }, liveInningUpdatedData).then().catch()
        //           }
        //         }
        //       }

        //       let liveUpdatedData = {}
        //       Object.assign(liveUpdatedData, { iMomId: updatedData?.iMomId, iMosId: updatedData?.iMosId })
        //       const statusData = await EnumsModel.findOne({ $or: [{ sKey: status, eType: 'msc' }] })
        //       if (statusData) {
        //         liveUpdatedData.iStatusId = statusData._id
        //         liveUpdatedData.sStatusStr = statusData.sValue
        //       }

        //       const matchLiveData = await axios.get(`https://rest.entitysport.com/v2/matches/${parsedMatch?.sMatchKey}/live`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })

        //       if (typeof matchLiveData?.data?.response !== 'string') {
        //         const { status: sStatusKey, game_state: sGameStateKey, status_note: sStatusNote, live_inning_number: nLatestInningNumber, batsmen, bowlers, commentary: bIsCommentary, wagon: bIsWagon, live_score: oLiveScore, live_inning: oLiveInning } = matchLiveData.data.response

        //         const aActiveBatters = []
        //         const aActiveBowlers = []
        //         if (batsmen && batsmen.length) {
        //           for (const s of batsmen) {
        //             const obj = {}
        //             obj.iBatterId = await getPlayerIdFromKey(s.batsman_id)
        //             obj.nRuns = s.runs
        //             obj.nBallFaced = s.balls_faced
        //             obj.nFours = s.fours
        //             obj.nSixes = s.sixes
        //             obj.sStrikeRate = s.strike_rate
        //             aActiveBatters.push(obj)
        //           }
        //         }
        //         if (bowlers && bowlers.length) {
        //           for (const s of bowlers) {
        //             const obj = {}
        //             obj.iBowlerId = await getPlayerIdFromKey(s.bowler_id)
        //             obj.sOvers = s.overs
        //             obj.nRunsConceded = s.runs_conceded
        //             obj.nWickets = s.wickets
        //             obj.nMaidens = s.maidens
        //             obj.sEcon = s.econ
        //             aActiveBowlers.push(obj)
        //           }
        //         }

        //         liveUpdatedData = {
        //           aActiveBatters,
        //           aActiveBowlers,
        //           sStatusNote: sStatusNote.replace(/&amp;/g, '&'),
        //           nLatestInningNumber,
        //           bIsCommentary: bIsCommentary === 1,
        //           bIsWagon: bIsWagon === 1
        //         }

        //         if (oLiveInning?.last_five_overs && typeof oLiveInning?.last_five_overs === 'string') liveUpdatedData.sLastFiveOvers = oLiveInning?.last_five_overs
        //         if (oLiveInning?.last_ten_overs && typeof oLiveInning?.last_ten_overs === 'string') liveUpdatedData.sLastTenOvers = oLiveInning?.last_ten_overs
        //         // add live score
        //         if (Object.keys(oLiveScore).length) {
        //           const {
        //             runs: nRuns, overs: sOvers, wickets: nWickets, target: nTarget, runrate: nRunrate,
        //             required_runrate: sRequiredRunrate
        //           } = oLiveScore

        //           liveUpdatedData.oLiveScore = {
        //             nRuns,
        //             sOvers: sOvers?.toString(),
        //             nWickets,
        //             nTarget,
        //             nRunrate,
        //             sRequiredRunrate: sRequiredRunrate?.toString()
        //           }
        //         }

        //         const statusData = await EnumsModel.find({ $or: [{ sKey: sStatusKey, eType: 'msc' }, { sKey: sGameStateKey, eType: 'lmsc' }] })

        //         const mscIndex = statusData.findIndex(s => s.eType === 'msc')
        //         const lmscIndex = statusData.findIndex(s => s.eType === 'lmsc')

        //         if (mscIndex > -1) {
        //           liveUpdatedData.iStatusId = statusData[mscIndex]._id
        //           liveUpdatedData.sStatusStr = statusData[mscIndex].sValue
        //         }
        //         if (lmscIndex > -1) {
        //           liveUpdatedData.iLiveGameStatusId = statusData[lmscIndex]._id
        //           liveUpdatedData.sLiveGameStatusStr = statusData[lmscIndex].sValue
        //         }
        //       }

        //       if (nLatestInningNumber) updateLiveInningData({ _id: parsedMatch._id, nInningNumber: nLatestInningNumber }, liveUpdatedData, false).then().catch()
        //       updateLiveFullScorecardData({ _id: parsedMatch._id }, liveUpdatedData).then().catch()
        //       updateLiveMatchData({ _id: parsedMatch._id }, liveUpdatedData).then().catch()
        //       updateLiveMiniScorecardData({ _id: parsedMatch._id }, liveUpdatedData).then().catch()
        //     }
        //   }).catch((error) => {
        //     console.log(error?.data?.data)
        //   })
        // }
        // const matchSquad = await MatchSquadModel.find({ sMatchKey: match.sMatchKey }).lean()
        // if (!matchSquad?.length) {
        //   console.log(matchSquad?.length)
        //   await fetchMatchSquadFun(match.sMatchKey)
        // }
        // console.log('done')
        // const commentaries = await CommentariesModel.find({ iMatchId: _.mongify(match._id) }).lean()
        // // if (!commentaries?.length)
      }
      console.log(matches.length)
    } catch (error) {
      console.log(error)
    }
    res.send('done')
  }
  // Need to deprecate this, added in full scorecard update
  // async updateMiniScorecard(req, res) {
  //   try {
  //     const data = await MiniScorecardModel.find({ sStatusStr: 'Live' }).lean()

  //     async.eachSeries(data, (s, callback) => {
  //       axios.get(`https://rest.entitysport.com/v2/matches/${s.sMatchKey}/scorecard`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then((res) => {
  //         const { status_str: sStatusStr, status_note: sStatusNote, game_state_str: sLiveGameStatusStr, equation: sEquation, latest_inning_number: nLatestInningNumber, live: sLiveMatchNote, result: sResult } = res.data.response
  //         if (!s.sETag || s.sETag !== res.data.etag) {
  //           const updatedData = {
  //             sStatusStr,
  //             sStatusNote,
  //             sLiveGameStatusStr,
  //             sEquation,
  //             nLatestInningNumber,
  //             oTeamScoreA: {
  //               ...s.oTeamScoreA,
  //               sScoresFull: res.data.response.teama.scores_full,
  //               sScores: res.data.response.teama.scores,
  //               sOvers: res.data.response.teama.overs
  //             },
  //             oTeamScoreB: {
  //               ...s.oTeamScoreB,
  //               sScoresFull: res.data.response.teamb.scores_full,
  //               sScores: res.data.response.teamb.scores,
  //               sOvers: res.data.response.teamb.over
  //             },
  //             sLiveMatchNote,
  //             sResult,
  //             sETag: res.data.etag
  //           }
  //           updateLiveMiniScorecardData({ _id: s._id, iMatchId: s.iMatchId }, updatedData).then().catch()
  //         }
  //         callback()
  //       }).catch((error) => {
  //
  //       })
  //     }, (error) => {
  //       console.log('done', error)
  //     })

  //     return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.successfully.message.replace('##', 'Data updated') })
  //   } catch (error) {
  //
  //     return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong })
  //   }
  // }

  // Update full scorecard, live inning, and match info, miniscorecard
  async updateFullScorecard(req, res) {
    try {
      const query = req?.body?.iMatchId ? { _id: req?.body?.iMatchId } : req?.body?.iSeriesId ? { iSeriesId: req?.body?.iSeriesId } : { sStatusStr: 'live', sLiveGameStatusStr: { $ne: 'stumps' } }

      const data = await MatchesModel.find(query).populate([
        { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini sSrtTitle nTotalTeams iCategoryId' },
        { path: 'oVenue', select: 'sName sLocation' },
        { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oWinner', select: '_id sTitle sAbbr oImg' }
      ]).sort({ dCreated: -1 }).lean()

      for (const m of data) {
        scheduleMatchTask({ eType: 'fullScorecard', data: { _id: m?._id, sMatchKey: m?.sMatchKey, iSeriesId: m?.iSeriesId, iVenueId: m?.iVenueId, sETag: m?.sETag } }, moment().unix())
      }

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'full-scorecard Done' })
    } catch (error) {
      console.log('done', error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'full-scorecard Error' })
    }
  }

  async updateAfterMatchInfo(req, res) {
    try {
      const endDate = moment().subtract(1, 'hours').toDate()
      const query = { dMatchEndTime: { $gt: endDate }, sStatusStr: { $ne: 'live' }, sLiveGameStatusStr: { $ne: 'playing ongoing' } }
      const data = await MatchesModel.find(query).sort({ dCreated: -1 })

      for (const m of data) {
        scheduleMatchTask({ eType: 'fullScorecard', data: { _id: m?._id, sMatchKey: m?.sMatchKey, iSeriesId: m?.iSeriesId, iVenueId: m?.iVenueId, sETag: m?.sETag } }, moment().unix())
      }

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'after-match-info Done' })
    } catch (error) {
      console.log('done', error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'after-match-info Error' })
    }
  }

  async getMatches(req, res) {
    try {
      const intSeriesQuery = { sCategory: 'international' } // International
      const domSeriesQuery = { sCategory: 'domestic', sGameFormat: { $ne: 'firstclass' } } // Domestic
      const iplQuery = { sTitle: 'Indian Premier League' } // Ipl

      const liveMatchQuery = {
        $and: [{ sFormatStr: { $ne: 'First Class' } }, { sFormatStr: { $ne: 'firstclass' } }, { sStatusStr: 'live' }]
      }

      const recentEndedMatchQuery = {
        $and: [{ sFormatStr: { $ne: 'First Class' } }, { sFormatStr: { $ne: 'firstclass' } }, { sStatusStr: 'completed' }],
        dEndDate: { $gt: moment().subtract(24, 'hours').toDate(), $lt: moment().add(350, 'minutes').toDate() }
      }
      const scheduledMatchQuery = {
        $and: [{ sFormatStr: { $ne: 'First Class' } }, { sFormatStr: { $ne: 'firstclass' } }, { sStatusStr: 'scheduled' }],
        dStartDate: { $gt: moment().toDate(), $lt: moment().add(24, 'hours').toDate() }
      }

      const response = { international: {}, domestic: {}, ipl: {} }
      const intSeriesCount = await SeriesModel.count(intSeriesQuery)
      const domSeriesCount = await SeriesModel.count(domSeriesQuery)
      const iplCount = await SeriesModel.count(iplQuery)

      if (intSeriesCount) {
        let iSeriesIds = await SeriesModel.find(intSeriesQuery, { _id: 1 })
        iSeriesIds = iSeriesIds.map((ele) => {
          ele = { iSeriesId: _.mongify(ele._id) }
          return ele
        })

        const live = await MatchesModel.find({ $or: iSeriesIds, ...liveMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        const recent = await MatchesModel.find({ $or: iSeriesIds, ...recentEndedMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        const scheduled = await MatchesModel.find({ $or: iSeriesIds, ...scheduledMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        Object.assign(response.international, { live, recent, scheduled })
      }

      if (domSeriesCount) {
        let iSeriesIds = await SeriesModel.find(domSeriesQuery, { _id: 1 })
        iSeriesIds = iSeriesIds.map((ele) => {
          ele = { iSeriesId: _.mongify(ele._id) }
          return ele
        })

        const live = await MatchesModel.find({ $or: iSeriesIds, ...liveMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        const recent = await MatchesModel.find({ $or: iSeriesIds, ...recentEndedMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        const scheduled = await MatchesModel.find({ $or: iSeriesIds, ...scheduledMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        Object.assign(response.domestic, { live, recent, scheduled })
      }

      if (iplCount) {
        let iSeriesIds = await SeriesModel.find(iplQuery, { _id: 1 })
        iSeriesIds = iSeriesIds.map((ele) => {
          ele = { iSeriesId: _.mongify(ele._id) }
          return ele
        })

        const live = await MatchesModel.find({ $or: iSeriesIds, ...liveMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        const recent = await MatchesModel.find({ $or: iSeriesIds, ...recentEndedMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        const scheduled = await MatchesModel.find({ $or: iSeriesIds, ...scheduledMatchQuery }, { _id: 1, iSeriesId: 1, sTitle: 1, sStatusStr: 1, sStatusNote: 1 })
        Object.assign(response.ipl, { live, recent, scheduled })
      }
      return res.status(messages.english.statusOk).json(response)
    } catch (error) {
      return res.status(messages.english.statusOk).jsonp({ error })
    }
  }

  async getSeriesMiniScorecard(req, res) {
    try {
      if (!req.params?.iSeriesId) throw new Error('iSeriesId required')

      const data = await MiniScorecardModel.find({ 'oSeries._id': _.mongify(req.params?.iSeriesId) }).lean()

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'mini scorecard'), data })
    } catch (error) {
      console.log('error')
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusOk, message: messages.english.wentWrong, data: error })
    }
  }

  async addNewFields(req, res) {
    try {
      // const aMatch = await MatchesModel.find({ _id: '644f7f6bab6b6ba08ececf20' }).sort({ _id: -1 }).lean()
      const result = await SeriesModel.aggregate(
        [
          {
            $match: {
              $or: [
                {
                  sCategory: 'international'
                }, {
                  bIsLeague: true
                }
              ]
            }
          }, {
            $sort: {
              _id: -1
            }
          }, {
            $lookup: {
              from: 'matches',
              localField: '_id',
              foreignField: 'iSeriesId',
              as: 'matches'
            }
          }, {
            $unwind: {
              path: '$matches',
              preserveNullAndEmptyArrays: true
            }
          }, {
            $group: {
              _id: '_id',
              aMatch: {
                $addToSet: '$matches'
              }
            }
          }
        ]
      )
      const aMatch = result[0]?.aMatch
      for (const oMatch of aMatch) {
        await axios.get(`https://rest.entitysport.com/v2/matches/${oMatch?.sMatchKey}/scorecard`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
          .then(async (response) => {
            if (response?.data?.status === 'ok') {
              const {
                day_remaining_over: sDayRemainingOver,
                match_notes: aMatchNote
              } = response?.data?.response
              await FullScorecardsModel.findOneAndUpdate({ iMatchId: oMatch?._id }, { sDayRemainingOver })
              if (response?.data.response.innings && response?.data.response.innings.length) {
                for (let i = 0; i < response?.data?.response.innings.length; i++) {
                  const {
                    number: nInningNumber,
                    powerplay: oPowerPlay,
                    review: oReview,
                    did_not_bat: aDidNotBatsMan
                  } = response.data.response.innings[i]

                  const aPowerPlay = []
                  const aDidNotBat = []
                  let aInningNote = []

                  if (!Array.isArray(oPowerPlay) && Object.keys(oPowerPlay).length) {
                    const aPowerPlayKey = Object.keys(oPowerPlay)
                    aPowerPlay.push(...aPowerPlayKey.map((ele) => ({
                      sPowerPlay: ele,
                      sStartOver: oPowerPlay[ele]?.startover,
                      sEndOver: oPowerPlay[ele]?.endover
                    })))
                  }

                  const oBattingReview = {
                    nTotal: parseInt(oReview?.batting?.batting_team_total_review),
                    nSuccess: parseInt(oReview?.batting?.batting_team_review_success),
                    nFailed: parseInt(oReview?.batting?.batting_team_review_failed),
                    nAvailable: parseInt(oReview?.batting?.batting_team_review_available)
                  }

                  const oBowlingReview = {
                    nTotal: parseInt(oReview?.bowling?.bowling_team_total_review),
                    nSuccess: parseInt(oReview?.bowling?.bowling_team_review_success),
                    nFailed: parseInt(oReview?.bowling?.bowling_team_review_failed),
                    nAvailable: parseInt(oReview?.bowling?.bowling_team_review_available)
                  }

                  if (aDidNotBatsMan.length) {
                    for (const oDidNotBatsMan of aDidNotBatsMan) {
                      aDidNotBat.push(await getPlayerIdFromKey(oDidNotBatsMan?.player_id))
                    }
                  }

                  if (aMatchNote.length && aMatchNote[i].length) aInningNote = aMatchNote[i]

                  await LiveInningsModel.findOneAndUpdate({ iMatchId: oMatch?._id, nInningNumber }, { aPowerPlay, oBattingReview, oBowlingReview, aDidNotBat, aInningNote })
                }
              }
              console.log('completed match id ', oMatch?._id)
            }
          }).catch((error) => {
            console.log(error)
          })
      }
      return res.send('done')
    } catch (error) {
      console.log('err', error)
      return res.send('err')
    }
  }
}

const updateLiveMiniScorecardData = (idData, data) => {
  return new Promise((resolve, reject) => {
    MiniScorecardModel.findOneAndUpdate({ iMatchId: idData._id }, data).then(s => {
      delete data.sETag
      MatchesModel.findByIdAndUpdate(idData._id, data).then().catch()
      resolve(s)
    }).catch(error => reject(error))
  })
}

const updateLiveFullScorecardData = (idData, data) => {
  return new Promise((resolve, reject) => {
    FullScorecardsModel.findOneAndUpdate({ iMatchId: idData._id }, data, { upsert: true }).then(s => {
      delete data.sETag
      MiniScorecardModel.findOneAndUpdate({ iMatchId: idData._id }, data, { new: true }).then((res) => {
        if (res) {
          res.iMatchId = idData._id
          res.dStartDate = new Date(res.dStartDate).getTime()
          res.dEndDate = new Date(res.dEndDate).getTime()
          res.dStartTimestamp *= 1000
          res.dEndTimestamp *= 1000
          redis.pubsub.publish('fetchMiniScorecardData', { fetchMiniScorecardData: [res] })
        }
      }).catch()
      resolve(s)
    }).catch(error => reject(error))
  })
}

const updateLiveInningData = (idData, data, isUpsert = true) => {
  return new Promise((resolve, reject) => {
    LiveInningsModel.findOneAndUpdate({ iMatchId: idData._id, nInningNumber: idData.nInningNumber }, data, { upsert: isUpsert, new: true })
      .populate('oMatch')
      .populate('oBattingTeam')
      .populate('oFieldingTeam')
      .populate('aBatters.oBatter')
      .populate('aBatters.oBowler')
      .populate('aBatters.oFirstFielder')
      .populate('aBatters.oSecondFielder')
      .populate('aBatters.oThirdFielder')
      .populate('aBowlers.oBowler')
      .populate('aFielders.oFielder')
      .populate('oLastWicket.oBatter')
      .populate('oLastWicket.oBowler')
      .populate('aFOWs.oBatter')
      .populate('aFOWs.oBowler')
      .populate('oCurrentPartnership.aBatters.oBatter')
      .populate('aActiveBatters.oBatter')
      .populate('aActiveBowlers.oBowler')
      .lean().then(s => {
        MatchesModel.findOne({ _id: idData._id }).populate([
          { path: 'oVenue' },
          { path: 'oSeries' },
          { path: 'oTeamA' },
          { path: 'oTeamB' },
          { path: 'oToss.oWinnerTeam' },
          { path: 'oTeamScoreA.oTeam' },
          { path: 'oTeamScoreB.oTeam' },
          { path: 'oMom', select: 'sTitle sShortName sFullName sThumbUrl' },
          { path: 'oMos', select: 'sTitle sShortName sFullName sThumbUrl' }
        ]).lean().then(async (matchInningNumber) => {
          if (matchInningNumber?.nLatestInningNumber === idData.nInningNumber) {
            const aInning = await LiveInningsModel.find({ iMatchId: _.mongify(matchInningNumber?._id) })
              .populate([
                { path: 'oBattingTeam' },
                { path: 'oFieldingTeam' },
                { path: 'aActiveBatters.oBatter', select: 'sTitle sShortName sFullName' },
                { path: 'aActiveBowlers.oBowler', select: 'sTitle sShortName sFullName' }
              ]).lean()
            Object.assign(matchInningNumber, { aInning })
            redis.pubsub.publish(`fetchLiveInningsData:${idData._id}`, { fetchLiveInningsData: s })
            redis.pubsub.publish(`getMatchBySlug:${idData._id}`, { getMatchBySlug: { oMatchDetailsFront: matchInningNumber, LiveInnings: s } })
          }
        })
        resolve(s)
      }).catch(error => reject(error))
  })
}

const updateLiveMatchData = (idData, data) => {
  return new Promise((resolve, reject) => {
    MatchesModel.findByIdAndUpdate(idData._id, data, { upsert: true, new: true }).then(async s => {
      if (eUpdateStatsType.value.includes(s?.sStatusStr)) {
        if (!s?.dMatchEndTime) {
          MatchesModel.findByIdAndUpdate(idData._id, { $set: { dMatchEndTime: moment().toDate() } }).exec()

          const after1Min = moment().add('1', 'minutes').unix()

          for (let i = 0; i <= 10; i++) {
            const sheduleTime = moment.unix(after1Min).add(i.toString(), 'minutes').unix()
            scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: s.sSeriesKey, _id: s.iSeriesId }, ts: sheduleTime }, sheduleTime)
          }
        }

        scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: s.sSeriesKey, _id: s.iSeriesId }, ts: moment().unix() }, moment().unix())
        scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: s.sSeriesKey, _id: s.iSeriesId }, ts: moment().add('30', 'minutes').unix() }, moment().add('30', 'minutes').unix())

        // it will add stats into scheduler
        // scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: s.sSeriesKey } }, moment().unix())
        // scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: s.sSeriesKey } }, moment().add('30', 'minutes').unix())
        // scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: s.sSeriesKey } }, moment().add('1', 'hours').unix())

        updateSeriesStatusFun(s.sSeriesKey)
      }
      resolve(s)
    }).catch(error => reject(error))
  })
}

const pullFullScorecard = async () => {
  try {
    const liveMatch = await redisMatchDb.lpop('fullScorecard', 1)
    if (!liveMatch) return setTimeout(() => pullFullScorecard(), 2000)

    const parsedMatch = JSON.parse(liveMatch)

    axios.get(`https://rest.entitysport.com/v2/matches/${parsedMatch?.sMatchKey}/scorecard`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then(async (res) => {
      if (!parsedMatch?.sETag || parsedMatch?.sETag !== res.data.etag) {
        const {
          equation: sEquation,
          latest_inning_number: nLatestInningNumber,
          man_of_the_match: oMom,
          man_of_the_series: oMos,
          is_followon: bIsFollowOn,
          win_margin: sWinMargin,
          current_over: sCurrentOver,
          previous_over: sPreviousOver,
          last_five_overs: sLastFiveOvers,
          teama,
          teamb,
          live: sLiveMatchNote,
          result: sResult,
          status,
          winning_team_id: sWinnerKey,
          day_remaining_over: sDayRemainingOver,
          match_notes: aMatchNote
        } = res.data.response
        const oTeamScoreA = {}
        const oTeamScoreB = {}
        let sMomKey = ''
        let sMosKey = ''
        const teamAdata = await getTeamIdFromKey(teama.team_id, 'details')
        oTeamScoreA.iTeamId = teamAdata._id
        oTeamScoreA.sScoresFull = teama.scores_full
        oTeamScoreA.sScores = teama.scores
        oTeamScoreA.sOvers = teama.overs
        oTeamScoreA.oTeam = {
          _id: teamAdata._id,
          sTitle: teamAdata.sTitle,
          sAbbr: teamAdata.sAbbr,
          oImg: teamAdata.oImg
        }

        const teamBdata = await getTeamIdFromKey(teamb.team_id, 'details')

        oTeamScoreB.iTeamId = teamBdata._id
        oTeamScoreB.sScoresFull = teamb.scores_full
        oTeamScoreB.sScores = teamb.scores
        oTeamScoreB.sOvers = teamb.overs
        oTeamScoreB.oTeam = {
          _id: teamBdata._id,
          sTitle: teamBdata.sTitle,
          sAbbr: teamBdata.sAbbr,
          oImg: teamBdata.oImg
        }

        sMomKey = oMom?.pid || null
        sMosKey = oMos?.pid || null
        const updatedData = {
          iMatchId: parsedMatch?._id,
          iSeriesId: parsedMatch?.iSeriesId,
          iVenueId: parsedMatch?.iVenueId,
          sEquation,
          nLatestInningNumber,
          oTeamScoreA,
          oTeamScoreB,
          sLiveMatchNote,
          sResult,
          bIsFollowOn,
          sWinMargin,
          sCurrentOver,
          sPreviousOver,
          sETag: res.data.etag,
          eProvider: 'es',
          sDayRemainingOver
        }

        if (sWinnerKey) updatedData.iWinnerId = await getTeamIdFromKey(sWinnerKey)

        if (sLastFiveOvers && typeof sLastFiveOvers === 'string') updatedData.sLastFiveOvers = sLastFiveOvers

        if (sMomKey) {
          updatedData.iMomId = await getPlayerIdFromKey(sMomKey)
        } else {
          updatedData.iMomId = null
        }
        if (sMosKey) {
          updatedData.iMosId = await getPlayerIdFromKey(sMosKey)
        } else {
          if (!liveMatch?.oneDay) scheduleMatchTask({ eType: 'fullScorecard', data: { _id: liveMatch?._id, sMatchKey: liveMatch?.sMatchKey, iSeriesId: liveMatch?.iSeriesId, iVenueId: liveMatch?.iVenueId, sETag: liveMatch?.sETag, oneDay: true } }, moment().add(1, 'day').unix())
          updatedData.iMosId = null
        }
        updateLiveFullScorecardData({ _id: parsedMatch?._id }, updatedData).then().catch()
        updateLiveMiniScorecardData({ _id: parsedMatch?._id }, updatedData).then().catch()

        if (res.data.response.innings && res.data.response.innings.length) {
          for (let i = 0; i < res.data.response.innings.length; i++) {
            const {
              iid: sInningId,
              number: nInningNumber,
              name: sName,
              short_name: sShortName,
              batting_team_id: sBattingTeamKey,
              fielding_team_id: sFieldingTeamKey,
              batsmen: aBatsman,
              bowlers: aBowler,
              fielder: aFielder,
              last_wicket,
              fows: aFow,
              extra_runs: oER,
              equations: oEq,
              current_partnership: oCP,
              status: sLiveInningStatus,
              result: sLiveInningResult,
              powerplay: oPowerPlay,
              review: oReview,
              did_not_bat: aDidNotBatsMan
            } = res.data.response.innings[i]

            if (nInningNumber && sBattingTeamKey && sFieldingTeamKey) {
              const aBatters = []
              const aBowlers = []
              const aFielders = []
              const aFOWs = []
              const aPowerPlay = []
              const aDidNotBat = []
              let aInningNote = []

              if (!Array.isArray(oPowerPlay) && Object.keys(oPowerPlay).length) {
                const aPowerPlayKey = Object.keys(oPowerPlay)
                aPowerPlay.push(...aPowerPlayKey.map((ele) => ({
                  sPowerPlay: ele,
                  sStartOver: oPowerPlay[ele]?.startover,
                  sEndOver: oPowerPlay[ele]?.endover
                })))
              }

              const oBattingReview = {
                nTotal: parseInt(oReview?.batting?.batting_team_total_review),
                nSuccess: parseInt(oReview?.batting?.batting_team_review_success),
                nFailed: parseInt(oReview?.batting?.batting_team_review_failed),
                nAvailable: parseInt(oReview?.batting?.batting_team_review_available)
              }

              const oBowlingReview = {
                nTotal: parseInt(oReview?.bowling?.bowling_team_total_review),
                nSuccess: parseInt(oReview?.bowling?.bowling_team_review_success),
                nFailed: parseInt(oReview?.bowling?.bowling_team_review_failed),
                nAvailable: parseInt(oReview?.bowling?.bowling_team_review_available)
              }

              if (aDidNotBatsMan.length) {
                for (const oDidNotBatsMan of aDidNotBatsMan) {
                  aDidNotBat.push(await getPlayerIdFromKey(oDidNotBatsMan?.player_id))
                }
              }

              if (aMatchNote.length && aMatchNote[i].length) aInningNote = aMatchNote[i]
              for (const s of aBatsman) {
                const obj = {}

                obj.iBatterId = await getPlayerIdFromKey(s.batsman_id)
                obj.bIsBatting = s.batting === 'true'
                if (s.position && s.batting === 'true') obj.ePosition = s.position === 'striker' ? 's' : 'ns'
                obj.nRuns = s.runs
                obj.nBallFaced = s.balls_faced
                obj.nFours = s.fours
                obj.nSixes = s.sixes
                obj.nDots = s.run0
                obj.nSingles = s.run1
                obj.nDoubles = s.run2
                obj.nThree = s.run3
                obj.nFives = s.run5
                obj.sHowOut = s.how_out
                if (s.dismissal) obj.eDismissal = s.dismissal
                obj.sStrikeRate = s.strike_rate
                if (s.bowler_id) obj.iBowlerId = await getPlayerIdFromKey(s.bowler_id)
                if (s.first_fielder_id) obj.iFirstFielderId = await getPlayerIdFromKey(s.first_fielder_id)
                if (s.second_fielder_id) obj.iSecondFielderId = await getPlayerIdFromKey(s.second_fielder_id)
                if (s.third_fielder_id) obj.iThirdFielderId = await getPlayerIdFromKey(s.third_fielder_id)

                aBatters.push(obj)
              }
              for (const s of aBowler) {
                const obj = {}

                obj.iBowlerId = await getPlayerIdFromKey(s.bowler_id)
                obj.bIsBowling = s.bowling === 'true'
                if (s.position) obj.ePosition = s.position === 'active bowler' ? 'ab' : 'lb'
                obj.sOvers = s.overs
                obj.nMaidens = s.maidens
                obj.nRunsConceded = s.runs_conceded
                obj.nWickets = s.wickets
                obj.nNoBalls = s.noballs
                obj.nWides = s.wides
                obj.nDotBalls = s.run0
                obj.sEcon = s.econ
                obj.nBowled = s.bowledcount
                obj.nLbw = s.lbwcount

                aBowlers.push(obj)
              }
              for (const s of aFielder) {
                const obj = {}
                obj.iFielderId = await getPlayerIdFromKey(s.fielder_id)
                obj.sFielderName = s.fielder_name
                obj.nCatches = s.catches
                obj.nRunoutThrow = s.runout_thrower
                obj.nRunoutCatcher = s.runout_catcher
                obj.nRunoutDirect = s.runout_direct_hit
                obj.bIsSubstitute = s.is_substitute
                obj.nStumping = s.stumping

                aFielders.push(obj)
              }
              for (const s of aFow) {
                const obj = {}
                obj.iBatterId = await getPlayerIdFromKey(s.batsman_id)
                obj.nRuns = s.runs
                obj.nBallFaced = s.balls
                obj.sHowOut = s.how_out
                obj.nScoreDismissal = s.score_at_dismissal
                obj.sOverDismissal = s.overs_at_dismissal
                obj.iBowlerId = await getPlayerIdFromKey(s.bowler_id)
                obj.eDismissal = s.dismissal
                obj.nWicketNumber = s.number

                aFOWs.push(obj)
              }

              const oLastWicket = {
                iBatterId: await getPlayerIdFromKey(last_wicket.batsman_id),
                nRuns: last_wicket.runs,
                nBallFaced: last_wicket.balls,
                sHowOut: last_wicket.how_out,
                nScoreDismissal: last_wicket.score_dismissal,
                sOverDismissal: last_wicket.over_dismissal,
                iBowlerId: await getPlayerIdFromKey(last_wicket.bowler_id),
                eDismissal: last_wicket.dismissal,
                nWicketNumber: last_wicket.number
              }
              const oExtraRuns = {
                nByes: oER.byes,
                nLegByes: oER.legbyes,
                nWides: oER.wides,
                nNoBalls: oER.noballs,
                nPenalty: oER.penalty,
                nTotal: oER.total
              }
              const oEquations = {
                nRuns: oEq.runs,
                nWickets: oEq.wickets,
                sOvers: oEq.overs,
                nBowlersUsed: oEq.bowlers_used,
                sRunRate: oEq.runrate
              }

              let oCurrentPartnership = {}
              if (oCP && 'runs' in oCP) {
                oCurrentPartnership = {
                  nRuns: oCP.runs,
                  nBalls: oCP.balls,
                  sOvers: oCP.overs,
                  aBatters: []
                }
                oCP.batsmen.forEach(async (s) => {
                  const obj = {}
                  obj.iBatterId = await getPlayerIdFromKey(s.batsman_id)
                  obj.nRuns = s.runs
                  obj.nBalls = s.balls

                  oCurrentPartnership.aBatters.push(obj)
                })
              }

              let LiveInningStatusData
              let LiveInningResultData
              if (sLiveInningStatus?.toString()) LiveInningStatusData = await EnumsModel.findOne({ $or: [{ sKey: sLiveInningStatus.toString(), eType: 'isc' }] })
              if (sLiveInningResult?.toString()) LiveInningResultData = await EnumsModel.findOne({ $or: [{ sKey: sLiveInningResult.toString(), eType: 'irc' }] })

              const liveInningUpdatedData = {
                iMatchId: parsedMatch._id,
                sInningId,
                nInningNumber,
                sName,
                sShortName,
                iBattingTeamId: await getTeamIdFromKey(sBattingTeamKey),
                iFieldingTeamId: await getTeamIdFromKey(sFieldingTeamKey),
                aBatters,
                aBowlers,
                aFielders,
                aFOWs,
                oLastWicket,
                oExtraRuns,
                oEquations,
                sEtag: res.data.etag,
                eProvider: 'es',
                aPowerPlay,
                oBattingReview,
                oBowlingReview,
                aInningNote,
                aDidNotBat
              }

              if (LiveInningStatusData) {
                liveInningUpdatedData.iStatusId = LiveInningStatusData._id
                liveInningUpdatedData.sStatusStr = LiveInningStatusData.sValue
              }
              if (LiveInningResultData) {
                liveInningUpdatedData.iResultId = LiveInningResultData._id
                liveInningUpdatedData.sResultStr = LiveInningResultData.sValue
              }
              if (Object.keys(oCurrentPartnership).length) liveInningUpdatedData.oCurrentPartnership = oCurrentPartnership
              if (nInningNumber) updateLiveInningData({ _id: parsedMatch._id, nInningNumber }, liveInningUpdatedData).then().catch()
            }
          }
        }

        let liveUpdatedData = {}
        Object.assign(liveUpdatedData, { iMomId: updatedData?.iMomId, iMosId: updatedData?.iMosId })
        const statusData = await EnumsModel.findOne({ $or: [{ sKey: status, eType: 'msc' }] })
        if (statusData) {
          liveUpdatedData.iStatusId = statusData._id
          liveUpdatedData.sStatusStr = statusData.sValue
        }

        const matchLiveData = await axios.get(`https://rest.entitysport.com/v2/matches/${parsedMatch?.sMatchKey}/live`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })

        if (typeof matchLiveData?.data?.response !== 'string') {
          const { status: sStatusKey, game_state: sGameStateKey, status_note: sStatusNote, live_inning_number: nLatestInningNumber, batsmen, bowlers, commentary: bIsCommentary, wagon: bIsWagon, live_score: oLiveScore, live_inning: oLiveInning } = matchLiveData.data.response

          const aActiveBatters = []
          const aActiveBowlers = []
          if (batsmen && batsmen.length) {
            for (const s of batsmen) {
              const obj = {}
              obj.iBatterId = await getPlayerIdFromKey(s.batsman_id)
              obj.nRuns = s.runs
              obj.nBallFaced = s.balls_faced
              obj.nFours = s.fours
              obj.nSixes = s.sixes
              obj.sStrikeRate = s.strike_rate
              aActiveBatters.push(obj)
            }
          }
          if (bowlers && bowlers.length) {
            for (const s of bowlers) {
              const obj = {}
              obj.iBowlerId = await getPlayerIdFromKey(s.bowler_id)
              obj.sOvers = s.overs
              obj.nRunsConceded = s.runs_conceded
              obj.nWickets = s.wickets
              obj.nMaidens = s.maidens
              obj.sEcon = s.econ
              aActiveBowlers.push(obj)
            }
          }

          liveUpdatedData = {
            aActiveBatters,
            aActiveBowlers,
            sStatusNote: sStatusNote.replace(/&amp;/g, '&'),
            nLatestInningNumber,
            bIsCommentary: bIsCommentary === 1,
            bIsWagon: bIsWagon === 1
          }

          if (oLiveInning?.last_five_overs && typeof oLiveInning?.last_five_overs === 'string') liveUpdatedData.sLastFiveOvers = oLiveInning?.last_five_overs
          if (oLiveInning?.last_ten_overs && typeof oLiveInning?.last_ten_overs === 'string') liveUpdatedData.sLastTenOvers = oLiveInning?.last_ten_overs
          // add live score
          if (Object.keys(oLiveScore).length) {
            const {
              runs: nRuns, overs: sOvers, wickets: nWickets, target: nTarget, runrate: nRunrate,
              required_runrate: sRequiredRunrate
            } = oLiveScore

            liveUpdatedData.oLiveScore = {
              nRuns,
              sOvers: sOvers?.toString(),
              nWickets,
              nTarget,
              nRunrate,
              sRequiredRunrate: sRequiredRunrate?.toString()
            }
          }

          const statusData = await EnumsModel.find({ $or: [{ sKey: sStatusKey, eType: 'msc' }, { sKey: sGameStateKey, eType: 'lmsc' }] })

          const mscIndex = statusData.findIndex(s => s.eType === 'msc')
          const lmscIndex = statusData.findIndex(s => s.eType === 'lmsc')

          if (mscIndex > -1) {
            liveUpdatedData.iStatusId = statusData[mscIndex]._id
            liveUpdatedData.sStatusStr = statusData[mscIndex].sValue
          }
          if (lmscIndex > -1) {
            liveUpdatedData.iLiveGameStatusId = statusData[lmscIndex]._id
            liveUpdatedData.sLiveGameStatusStr = statusData[lmscIndex].sValue
          }
        }

        if (nLatestInningNumber) updateLiveInningData({ _id: parsedMatch._id, nInningNumber: nLatestInningNumber }, liveUpdatedData, false).then().catch()
        updateLiveFullScorecardData({ _id: parsedMatch._id }, liveUpdatedData).then().catch()
        updateLiveMatchData({ _id: parsedMatch._id }, liveUpdatedData).then().catch()
        updateLiveMiniScorecardData({ _id: parsedMatch._id }, liveUpdatedData).then().catch()
      }
    }).catch((error) => {
      console.log(error?.data?.data)
      pullFullScorecard()
    })
    pullFullScorecard()
  } catch (error) {
    console.log(error)
    pullFullScorecard()
  }
}

setTimeout(() => pullFullScorecard(), 2000)

module.exports = new Scorecard()
