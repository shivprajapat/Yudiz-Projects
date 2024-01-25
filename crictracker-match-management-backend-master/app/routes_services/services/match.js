/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
const moment = require('moment')
const { fetchMatchFromApi, fetchMatchSquadFun, fetchSeriesSquadFun, getTeamIdFromKey, getPlayerIdFromKey, updateSeriesStatusFun, fetchSeriesMatches, updatePlayersGenderFun } = require('../../modules/match/common')
const { matches: MatchesModel, series: SeriesModel, teams: TeamsModel, venues: VenuesModel, players: PlayersModel, SeriesDataModel, matchsquad: MatchSquadModel, seriessquad } = require('../../model')
const enums = require('../../model/enums')
const { setMatchInfo } = require('../../routes_services/services/scorecard')
const { scheduleMatchTask, builder: { seriesSeoBuilder } } = require('../../utils')
const { getSeriesIdFromKey, updateTeam, updatePlayerStats, fetchEntityStandings } = require('../../modules/match/common')
const axios = require('axios')
const { ObjectId } = require('mongoose').Types
const { playerSlug, teamSlug, venueSlug } = require('../../modules/Common/slug')
const grpcControllers = require('../../grpc/client')
const _ = require('../../../global/lib/helpers')
const config = require('../../../config')

class MatchService {
  async fetchMatch(req, res) {
    try {
      const dStartDate = moment().format('YYYY-MM-DD')
      const dEndDate = moment().add(1, 'days').format('YYYY-MM-DD')

      const { aMatches, sSeriesKey, bUpdate } = req?.body || {}

      if (req?.body?.aMatches) fetchMatchFromApi(null, null, aMatches)
      else if (sSeriesKey) fetchSeriesMatches([sSeriesKey], bUpdate)
      else fetchMatchFromApi(dStartDate, dEndDate)

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'match Done' })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'match Error', data: error?.response?.data })
    }
  }

  async fetchMatchSquad(req, res) {
    try {
      const dStartDate = moment().startOf('day').toDate()
      const dEndDate = moment().add('3', 'd').toDate()

      const { iMatchId = null } = req.params

      const query = iMatchId ? { _id: iMatchId } : { $or: [{ dStartDate: { $gt: dStartDate, $lte: dEndDate } }, { sStatusStr: 'live' }] }

      const aMatch = await MatchesModel.find(query).lean()

      if (iMatchId) {
        fetchMatchSquadFun(aMatch[0].sMatchKey)
        fetchSeriesSquadFun(aMatch[0].sSeriesKey)
        res.send('fetchMatchSquad Done')
      } else {
        const dCurrent = moment.utc().toDate()

        res.send('match-squad Done')
        for (const m of aMatch) {
          const dStart = moment.utc(m.dStartDate).subtract('2', 'd').toDate()
          const dEnd = moment.utc(m.dStartDate).add('30', 'minutes').toDate()

          if (((dCurrent > dStart) && (dCurrent < dEnd)) || iMatchId) fetchMatchSquadFun(m.sMatchKey)

          // update matchsquad for all scheduled matches of series

          const newMatches = await MatchesModel.find({ iSeriesId: ObjectId(m.iSeriesId), sStatusStr: 'scheduled', _id: { $ne: ObjectId(m._id) } }).lean()

          for (const sm of newMatches) await fetchMatchSquadFun(sm.sMatchKey)

          fetchSeriesSquadFun(m.sSeriesKey)

          // fetch Series squad
        }
      }
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'match-squad Error', data: error?.response?.data })
    }
  }

  async fetchMatchSquadBySeries(req, res) {
    try {
      const { iSeriesId = null } = req.body

      const query = { iSeriesId }
      const aMatch = await MatchesModel.find(query).lean()

      if (iSeriesId) {
        for (const m of aMatch) {
          fetchMatchSquadFun(m.sMatchKey)
          fetchSeriesSquadFun(m.sSeriesKey)
        }
      }

      return res.send('fetchMatchSquadBySeries Done')
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'match-squad-by-series Error', data: error?.response?.data })
    }
  }

  async updateSeriesStatus(req, res) {
    try {
      const dStartDate = moment().subtract('20', 'days').toDate()
      const dEndDate = moment().add('1', 'day').toDate()

      const aSeries = await SeriesModel.find({ dStartDate: { $gt: dStartDate }, dEndDate: { $lte: dEndDate } })

      if (aSeries?.length) {
        for (const s of aSeries) {
          updateSeriesStatusFun(s.sSeriesKey)
        }
      }
      res.send('series update done')
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong, data: error?.response?.data })
    }
  }

  // need to deprecate
  async updateSeriesStanding(req, res) {
    try {
      const { iSeriesId } = req?.body
      const query = {}

      const dStartDate = moment().startOf('day').toDate()
      const dEndDate = moment().endOf('day').toDate()

      if (iSeriesId) query._id = iSeriesId
      else Object.assign(query, { dStartDate: { $gt: dStartDate }, dEndDate: { $lte: dEndDate } })

      const aSeries = await SeriesModel.find(query)

      if (aSeries.length) {
        for (const s of aSeries) {
          await fetchEntityStandings(s?.sSeriesKey, s?._id)
          // scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: s.sSeriesKey, _id: s._id } }, moment().unix())
        }
      }

      return res.send('done')
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong, data: error?.response?.data })
    }
  }

  async fetchTeams(req, res) {
    try {
      for (let i = 0; i < 260; i++) {
        const teams = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}teams?per_page=10&paged=${i + 1}}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
        const teamsData = teams?.data?.response?.items
        if (teamsData.length) {
          for (let j = 0; j < teamsData.length; j++) {
            await getTeamIdFromKey(teamsData[j].tid, null, teamsData[j])
          }
        }
      }
      return res.send({ data: 'done' })
    } catch (error) {
      return res.send({ error })
    }
  }

  async updateTeams(req, res) {
    try {
      await updateTeam()
      return res.send({ data: 'done' })
    } catch (error) {
      return res.send({ error })
    }
  }

  async fetchPlayers(req, res) {
    try {
      for (let i = 0; i < 841; i++) {
        const players = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}players?per_page=100&paged=${i + 1}}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
        const playersData = players?.data?.response?.items
        if (playersData.length) {
          for (let j = 0; j < playersData.length; j++) {
            await getPlayerIdFromKey(playersData[j].pid, playersData[j])
          }
        }
      }
      return res.send({ data: 'done' })
    } catch (error) {
      return res.send({ error })
    }
  }

  async updatePastUpcomingMatches(req, res) {
    try {
      const { iMatchId } = req.body
      const dStartDate = moment().toDate()
      let query
      if (iMatchId) {
        query = { _id: iMatchId }
      } else {
        query = { dStartDate: { $lt: dStartDate }, sStatusStr: 'scheduled' }
      }
      const aMatch = await MatchesModel.find(query)
      if (aMatch?.length) {
        for (const m of aMatch) {
          req.body.iMatchId = m._id
          await setMatchInfo(m._id)
          scheduleMatchTask({ eType: 'fullScorecard', data: { _id: m?._id, sMatchKey: m?.sMatchKey, iSeriesId: m?.iSeriesId, iVenueId: m?.iVenueId, sETag: m?.sETag } }, moment().unix())
          scheduleMatchTask({ eType: 'commentary', data: { _id: m?._id, sMatchKey: m?.sMatchKey, nLatestInningNumber: m?.nLatestInningNumber, dEndDate: m?.dEndDate } }, moment().unix())
        }
      }

      // update past series
      const aSeries = await SeriesModel.find({ dEndDate: { $lt: dStartDate }, sStatus: { $ne: 'result' } }).lean()
      if (aSeries?.length) {
        for (const s of aSeries) updateSeriesStatusFun(s.sSeriesKey)
      }
      return res.send('past-upcoming Done')
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'past-upcoming Error', data: error?.response?.data })
    }
  }

  async fetchSeriesSquad(req, res) {
    try {
      const { iSeriesId, iMatchId } = req.body

      if (!iSeriesId) return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.inputRequired })

      const series = await SeriesModel.findOne({ _id: iSeriesId }).lean()
      let match
      if (iMatchId) match = await MatchesModel.findOne({ _id: iMatchId }).lean()

      await fetchSeriesSquadFun(series?.sSeriesKey, match?.sMatchKey)

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'Series Squad') })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong, data: error?.response?.data })
    }
  }

  async updateMatchSlug(req, res) {
    try {
      const aMatches = await MatchesModel.find({}).lean()
      // eslint-disable-next-line no-unused-vars
      for (const [i, m] of aMatches.entries()) {
        const teamData1 = await TeamsModel.findOne({ _id: m.oTeamScoreA.iTeamId })
        const teamData2 = await TeamsModel.findOne({ _id: m.oTeamScoreB.iTeamId })

        const seriesDetail = await getSeriesIdFromKey(m.sSeriesKey, 'details')

        const sMatchInfo = enums?.eMatchFormat?.description[`${m?.sFormatStr}`]

        const seoParams = {
          iId: m._id.toString(),
          eType: 'ma',
          sTitle: `${teamData1?.sAbbr} vs ${teamData2?.sAbbr} Live Score | ${teamData1?.sTitle} vs ${teamData2?.sTitle} Score & Updates`,
          sDescription: `${teamData1?.sAbbr} vs ${teamData2?.sAbbr} Live Score: Get all the latest ${teamData1?.sTitle} vs $${teamData2?.sTitle} ${sMatchInfo} Live Score, ball by ball commentary & cricket updates on CricTracker.`
        }

        let formatStr = await MatchesModel.distinct('sFormatStr')

        formatStr.shift()

        formatStr = formatStr.map((ele) => ele?.toLowerCase()?.split(' ')?.join('-'))

        let type

        if (m?.sSubtitle) {
          m.sSubtitle = m?.sSubtitle?.toLowerCase().split(' ').join('-')
          if (formatStr.some((ele) => m?.sSubtitle.includes(ele))) type = m?.sSubtitle
          else type = `${m?.sSubtitle.toLowerCase().split(' ').join('-')}-${m?.sFormatStr}`
        } else type = m?.sFormatStr

        seoParams.sSlug = `live-scores/${teamData1?.sAbbr}-vs-${teamData2?.sAbbr}-${type}-${seriesDetail?.sTitle}-${seriesDetail.sSeason.split('/').join('-')}`
        seoParams.sSlug = seoParams.sSlug?.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\/]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/_/g, '-')
          .replace(/\_\_+/g, '-')
          .replace(/^-+/, '')

        await axios.post('http://localhost:4003/api/update-slug', seoParams)
      }
    } catch (error) {
      return res.send({ message: 'Something went wrong' })
    }
  }

  async updatePlayerGender(req, res) {
    try {
      updatePlayersGenderFun()

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.updateSuccess.message.replace('##', 'player') })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong, data: error?.response?.data })
    }
  }

  async getMissingMatches(req, res) {
    try {
      // only run this script for prod
      if (!['dev', 'stag'].includes(process.env.NODE_ENV)) {
        const getEntityMatchCount = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}matches?per_page=1&paged=1`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
        const { data } = getEntityMatchCount

        const count = data.response.total_items
        const notFound = []

        for (let index = 1; index <= Math.round(Number(count) / 80); index++) {
          const getEntityMatches = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}matches?per_page=80&paged=${index}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
          const { data } = getEntityMatches

          const matches = data.response.items

          for (let i = 0; i < matches.length; i++) {
            const ele = matches[i]
            const { match_id } = ele

            const match = await MatchesModel.findOne({ sMatchKey: match_id.toString() })

            if (!match) {
              notFound.push(ele)
              fetchMatchFromApi(null, null, notFound)
            }
          }
        }
      }

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.updateSuccess.message.replace('##', 'player') })
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong, data: error?.response?.data })
    }
  }

  async getMissingSeries(req, res) {
    try {
      if (!['dev', 'stag'].includes(process.env.NODE_ENV)) {
        const getEntityMatchCount = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions?per_page=1&paged=1`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
        const { data } = getEntityMatchCount

        const count = data.response.total_items
        const notFound = []
        for (let index = 1; index <= Math.round(Number(count) / 10); index++) {
          const getEntityMatches = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions?per_page=10&paged=${index + 1}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
          const { data } = getEntityMatches

          const serieses = data.response.items

          for (let i = 0; i < serieses.length; i++) {
            const ele = serieses[i]
            // eslint-disable-next-line camelcase
            const { cid } = ele

            const series = await SeriesModel.findOne({ sSeriesKey: cid.toString() })

            if (!series) {
              notFound.push(ele)
              await getSeriesIdFromKey([cid.toString()], 'details')
              fetchSeriesMatches([cid.toString()])
            }
          }
        }
      }
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.updateSuccess.message.replace('##', 'match') })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong, data: error?.response?.data })
    }
  }

  async checkAllSlugs(req, res) {
    try {
      const dMonth = moment().subtract(1, 'day').toDate()
      // matches

      const aMatches = await MatchesModel.find({ dStartDate: { $gte: dMonth } }).sort({ dCreated: -1 }).lean()
      const aSeries = []
      const aTeams = []
      const aVenues = []

      for (const m of aMatches) {
        const teamData1 = await TeamsModel.findOne({ _id: ObjectId(m.oTeamScoreA.iTeamId) }).lean()
        const teamData2 = await TeamsModel.findOne({ _id: ObjectId(m.oTeamScoreB.iTeamId) }).lean()

        const seriesDetail = await SeriesModel.findOne({ _id: ObjectId(m.iSeriesId) })
        aSeries.push(m.sSeriesKey)
        aTeams.push(m.oTeamScoreA.iTeamId?.toString())
        aTeams.push(m.oTeamScoreB.iTeamId?.toString())
        aVenues.push(m.iVenueId?.toString())

        const sMatchInfo = enums?.eMatchFormat?.description[`${m?.sFormatStr}`]
        const seoParams = {
          iId: m._id.toString(),
          eType: 'ma',
          sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score | ${teamData1.sTitle} vs ${teamData2.sTitle} Score & Updates`,
          sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score: Get all the latest ${teamData1.sTitle} vs ${teamData2.sTitle} ${sMatchInfo} Live Score, ball by ball commentary & cricket updates on CricTracker.`,
          sServiceType: 'checkMatchSeo'
        }

        let formatStr = await MatchesModel.distinct('sFormatStr')

        formatStr.shift()

        formatStr = formatStr.map((ele) => ele?.toLowerCase()?.split(' ')?.join('-'))

        let type

        if (m?.sSubtitle) {
          m.sSubtitle = m?.sSubtitle?.toLowerCase().split(' ').join('-')
          if (formatStr.some((ele) => m?.sSubtitle.includes(ele))) type = m?.sSubtitle
          else type = `${m?.sSubtitle.toLowerCase().split(' ').join('-')}-${m?.sFormatStr}`
        } else type = m?.sFormatStr

        const date = new Date(m.dStartDate).toDateString().toLocaleLowerCase().split(' ')

        seoParams.sSlug = `live-scores/${teamData1.sAbbr}-vs-${teamData2.sAbbr}-${type}-${seriesDetail?.sTitle}-${date[2]}-${date[1]}-${date[3]}`

        // queuePush('addSeoData', seoParams)
        await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
        // matchSeoBuilder(m, teamData1, teamData2, sMatchInfo, seriesDetail, queuePush)
      }

      // series check
      checkSeriesSlug(aSeries)

      // teams check
      checkTeamsSlug(aTeams)

      // venue check
      checkVenuesSlug(aVenues)
      // players check
      checkPlayersSlug()
      console.log('slug check done')
      res.send('slug check started')
    } catch (error) {
      console.log('error', error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong, data: error?.response?.data })
    }
  }

  async updateMatches(req, res) {
    try {
      const allMatches = await MatchesModel.find().lean()
      for (const match of allMatches) {
        const teamData1 = await TeamsModel.findOne({ _id: match.oTeamScoreA.iTeamId })
        const teamData2 = await TeamsModel.findOne({ _id: match.oTeamScoreB.iTeamId })
        const sMatchInfo = enums?.eMatchFormat?.description[`${match?.sFormatStr}`]
        const seriesDetail = await SeriesModel.findOne({ _id: ObjectId(match.iSeriesId) })

        const seoParams = {
          iId: match._id.toString(),
          eType: 'ma'
        }

        let formatStr = await MatchesModel.distinct('sFormatStr')

        formatStr.shift()

        formatStr = formatStr.map((ele) => ele?.toLowerCase()?.split(' ')?.join('-'))

        let type

        if (match?.sSubtitle) {
          match.sSubtitle = match?.sSubtitle?.toLowerCase().split(' ').join('-')
          if (formatStr.some((ele) => match?.sSubtitle.includes(ele))) type = match?.sSubtitle
          else type = `${match?.sSubtitle.toLowerCase().split(' ').join('-')}-${match?.sFormatStr}`
        } else type = match?.sFormatStr

        const date = new Date(match.dStartDate).toDateString().toLocaleLowerCase().split(' ')

        Object.assign(seoParams, {
          sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score | ${teamData1.sTitle} vs ${teamData2.sTitle} Score & Updates`,
          sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score: Get all the latest ${teamData1.sAbbr} vs $${teamData2.sAbbr} ${sMatchInfo} Live Score, ball by ball commentary & cricket updates on CricTracker.`,
          sSlug: `live-scores/${teamData1?.sAbbr}-vs-${teamData2?.sAbbr}-${type}-${seriesDetail?.sTitle}-${date[2]}-${date[1]}-${date[3]}`,
          sCUrl: `live-scores/${teamData1?.sAbbr}-vs-${teamData2?.sAbbr}-${type}-${seriesDetail?.sTitle}-${date[2]}-${date[1]}-${date[3]}`
        })

        // queuePush('addSeoData', seoParams)
        await grpcControllers.addSeoData(seoParams)

        // matchSeoBuilder(match, teamData1, teamData2, sMatchInfo, seriesDetail)
      }
    } catch (error) {
      return error
    }
  }

  async updateSeries(req, res) {
    try {
      const allSeries = await SeriesModel.find({ $or: [{ sStatus: 'live' }, { sStatus: 'scheduled' }, { sStatus: { $in: ['fixture', 'upcoming'] } }] }).lean()
      for await (const series of allSeries) {
        const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${series.sSeriesKey}?token=${process.env.ENTITY_SPORT_TOKEN}`)
        const { data: { response } } = res
        if (typeof response !== 'string' && response) {
          const {
            cid: sSeriesKey, title: sTitle, abbr: sAbbr, type: sSeriesType, category: sCategory, game_format: sGameFormat, status: sStatus, season: sSeason, datestart: dStartDate, dateend: dEndDate, total_matches: nTotalMatches, total_rounds: nTotalRounds,
            total_teams: nTotalTeams, squad_type: sSquadType, country: sCountry, table: nTable, rounds = null
          } = response

          const seriesParams = {
            sSeriesKey: sSeriesKey.toString(),
            sTitle,
            sAbbr,
            sSeason,
            dStartDate: moment.utc(dStartDate, 'YYYY-MM-DD hh:mm:ss').toDate(),
            dEndDate: moment.utc(dEndDate, 'YYYY-MM-DD hh:mm:ss').toDate(),
            nTotalMatches,
            nTotalRounds,
            nTotalTeams,
            sSquadType,
            sCountry,
            nTable,
            sSeriesType,
            sCategory,
            sGameFormat,
            sStatus,
            eProvider: 'es'
          }

          if (rounds?.length) {
            seriesParams.aRound = rounds.map(r => {
              const { rid: sRoundKey, order: nOrder, name: sName, match_format: sMatchFormat, datestart: dStartDate, dateend: dEndDate, type: sRoundType, matches_url: sMatchesUrl, teams_url: sTeamsUrl } = r

              const obj = {
                sRoundKey: sRoundKey.toString(),
                nOrder,
                sName,
                sMatchFormat,
                sRoundType,
                sMatchesUrl,
                sTeamsUrl
              }

              if (dStartDate) obj.dStartDate = moment.utc(dStartDate, 'YYYY-MM-DD hh:mm:ss').toDate()
              if (dEndDate) obj.dEndDate = moment.utc(dEndDate, 'YYYY-MM-DD hh:mm:ss').toDate()

              return obj
            })
          }
          // add formats for stats service
          const statsRes = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${series.sSeriesKey}/stats/?token=${process.env.ENTITY_SPORT_TOKEN}`)
          if (typeof statsRes?.data?.response !== 'string') {
            seriesParams.aFormats = statsRes?.data?.response?.formats
          }

          await SeriesModel.updateOne({ _id: series._id }, seriesParams)

          fetchSeriesSquadFun(series.sSeriesKey)
          scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: series.sSeriesKey, _id: series._id } }, moment().unix())
          // scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: series.sSeriesKey } }, moment().unix())
        }
        const seoParams = {
          iId: series._id,
          eType: 'se'
        }

        const newSlug = series.sTitle.toString().toLowerCase().split(' ')

        Object.assign(seoParams, {
          sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | ${series.sAbbr.toUpperCase()} News, ${series.sAbbr.toUpperCase()} Live Score, Updates, Squads Results.`,
          sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()}: Get all the latest ${series.sAbbr.toUpperCase()} ${series.sSeason} news, ${series.sAbbr.toUpperCase()} live scores, squads, fixtures, injury updates, match results & fantasy tips only on CricTracker`,
          sSlug: `cricket-series/${newSlug.join('-')}-${series.sSeason.toString().split('/').join('-')}`
        })

        // queuePush('addSeoData', seoParams)
        await grpcControllers.addSeoData(seoParams)

        seriesSeoBuilder(seoParams, series)
      }
    } catch (error) {
      return error
    }
  }

  async updatePlayerStats(req, res) {
    try {
      const { iPlayerId, iSeriesId } = req.query
      if (iSeriesId) {
        const oSeriesData = await SeriesDataModel.findOne({ iSeriesId: _.mongify(iSeriesId) }, { aTeams: 1 }).lean()
        if (oSeriesData) {
          const aTeams = oSeriesData?.aTeams
          if (aTeams?.length) {
            const aPlaying11Players = await MatchSquadModel.aggregate([
              {
                $match: {
                  bPlaying11: true,
                  iTeamId: { $in: aTeams.map((ele) => _.mongify(ele)) }
                }
              }, {
                $group: {
                  _id: {
                    iPlayerId: '$iPlayerId'
                  }
                }
              }, {
                $lookup: {
                  from: 'players',
                  localField: '_id.iPlayerId',
                  foreignField: '_id',
                  as: 'oPlayer'
                }
              }, {
                $unwind: {
                  path: '$oPlayer',
                  preserveNullAndEmptyArrays: true
                }
              }
            ])
            updatePlayerStats(aPlaying11Players)
          }
        }
      }
      if (iPlayerId) {
        const oTeamPlayer = await PlayersModel.findById(iPlayerId).lean()
        updatePlayerStats([{ oPlayer: oTeamPlayer }])
      }
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.updateShortly.message })
    } catch (error) {
      return res.status(messages.english.wentWrong.status).jsonp({ status: messages.english.wentWrong.status, message: messages.english.wentWrong.message })
    }
  }

  async declareOversesPlayer(req, res) {
    try {
      const { iSeriesId, sHomeCountry, iMatchId } = req.body

      if (iSeriesId && sHomeCountry) {
        const seriesSquads = await seriessquad.find({ iSeriesId }).populate([{ path: 'oPlayer', select: 'sCountryFull' }]).lean()

        const idsOfOversesPlayer = []

        for (const seriesRec of seriesSquads) {
          if (seriesRec.oPlayer.sCountryFull !== sHomeCountry) {
            idsOfOversesPlayer.push(seriesRec._id)
          }
        }

        if (idsOfOversesPlayer.length && idsOfOversesPlayer.length !== seriesSquads.length) {
          const overses = await seriessquad.updateMany({ iSeriesId, _id: { $in: idsOfOversesPlayer } }, { $set: { bIsOverseas: true } })
          const noverses = await seriessquad.updateMany({ iSeriesId, _id: { $nin: idsOfOversesPlayer } }, { $set: { bIsOverseas: false } })
          console.log({ overses, noverses })
        }
      }

      if (iMatchId && sHomeCountry) {
        const matchSquad = await MatchSquadModel.find({ iMatchId }).populate([{ path: 'oPlayer', select: 'sCountryFull' }]).lean()

        const idsOfOversesPlayer = []

        for (const matchSquadRec of matchSquad) {
          console.log(matchSquadRec?.oPlayer?.sCountryFull !== sHomeCountry)
          if (matchSquadRec?.oPlayer?.sCountryFull !== sHomeCountry) {
            idsOfOversesPlayer.push(matchSquadRec._id)
          }
        }

        if (idsOfOversesPlayer.length && idsOfOversesPlayer.length !== matchSquad.length) {
          const overses = await MatchSquadModel.updateMany({ iMatchId: ObjectId(iMatchId), _id: { $in: idsOfOversesPlayer } }, { $set: { bIsOverseas: true } })
          const noverses = await MatchSquadModel.updateMany({ iMatchId: ObjectId(iMatchId), _id: { $nin: idsOfOversesPlayer } }, { $set: { bIsOverseas: false } })
          console.log({ overses, noverses })
        }
      }
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.updateSuccess.message.replace('##', 'Overses declared') })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong, data: error?.response?.data })
    }
  }
}

async function checkSeriesSlug(aSeries) {
  try {
    aSeries = [...new Set(aSeries)]

    for (const s of aSeries) {
      const series = await SeriesModel.findOne({ sSeriesKey: s }).lean()

      const newSlug = series.sTitle.toString().toLowerCase().split(' ')
      if (!isNaN(newSlug[newSlug.length - 1])) {
        newSlug.pop()
      }

      const seoParams = {
        iId: series._id,
        eType: 'se'
      }

      Object.assign(seoParams, {
        sTitle: `${series.sAbbr.toUpperCase()} ${series.sSeason} | ${series.sAbbr.toUpperCase()} News, ${series.sAbbr.toUpperCase()} Live Score, Updates, Squads Results`,
        sDescription: `${series.sAbbr.toUpperCase()} ${series.sSeason}: Get all the latest ${series.sAbbr.toUpperCase()} ${series.sSeason} news, ${series.sAbbr.toUpperCase()} live scores, squads, fixtures, injury updates, match results & fantasy tips only on CricTracker`,
        sSlug: `cricket-series/${newSlug.join('-')}-${series.sSeason.toString().split('/').join('-')}`
      })

      // queuePush('addSeoData', seoParams)
      await grpcControllers.addSeoData(seoParams)
    }
  } catch (error) {
    return error
  }
}

async function checkTeamsSlug(aTeams) {
  try {
    aTeams = [...new Set(aTeams)]

    for (const t of aTeams) {
      const team = await TeamsModel.findOne({ _id: ObjectId(t) })
      const seoParams = {}
      seoParams.iId = team._id.toString()
      seoParams.eType = 't'
      seoParams.sSlug = `${teamSlug}/${team.sTitle}`
      seoParams.sTitle = `${team.sTitle} Cricket Team: Latest ${team.sTitle} Cricket Team News, Matches, Players, Scores & Stats - Crictracker`
      seoParams.sDescription = `${team.sTitle} Cricket Team: Read all the latest ${team.sTitle} cricket team news, updates, previews, schedule, stats, and videos on Crictracker`

      // queuePush('addSeoData', seoParams)
      await grpcControllers.addSeoData(seoParams)
    }
  } catch (error) {
    return error
  }
}

async function checkVenuesSlug(aVenues) {
  try {
    aVenues = [...new Set(aVenues)]

    for (const v of aVenues) {
      const venue = await VenuesModel.findOne({ _id: ObjectId(v) })
      const seoParams = {
        iId: venue._id.toString(),
        eType: 'v'
      }
      seoParams.sSlug = `${venueSlug}/${venue?.sName}`

      // queuePush('addSeoData', seoParams)
      await grpcControllers.addSeoData(seoParams)
    }
  } catch (error) {
    return error
  }
}

async function checkPlayersSlug(aPlayers) {
  try {
    const aPlayers = await PlayersModel.find({}).sort({ dCreated: -1 }).limit(120).lean()

    for (const p of aPlayers) {
      const seoParams = {}
      seoParams.iId = p._id.toString()
      seoParams.eType = 'p'
      seoParams.sSlug = `${playerSlug}/${p.sFirstName}`
      seoParams.sTitle = `${p.sFullName} Latest News, Records, Stats & Career Info - CricTracker`
      seoParams.sDescription = `${p.sFullName} News: Check out the latest news and updates on ${p.sFullName} along with photos, videos, biography, career stats, and more on CricTracker.`

      // queuePush('addSeoData', seoParams)
      await grpcControllers.addSeoData(seoParams)
    }
  } catch (error) {
    return error
  }
}

module.exports = new MatchService()
