/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
const { matches: MatchesModel, series: SeriesModel, enums: EnumsModel, venues: VenuesModel, teams: TeamsModel, players: PlayersModel, seriessquad: SeriesSquadModel, matchsquad: MatchSquadModel, CountryModel, SeriesDataModel, SeriesRoundsModel, SeriesStatsTypesModel, SeriesStatsModel, SeriesStandingsModel, SeriesTopPlayers, CommentariesModel, PlayerStatsModel, OversesPlayerModel, fantasyarticles: FantasyArticlesModel, FantasyPlayersModel } = require('../../model')
const { ePlatformType, eTopPlayerType } = require('../../model/enums')
const axios = require('axios')
const enums = require('../../model/enums')
const moment = require('moment')
const { playerSlug, teamSlug, venueSlug } = require('../Common/slug')
const { redisMatchDb, redisclient } = require('../../utils/lib/redis')
const { queuePush, builder: { seriesSeoBuilder } } = require('../../utils')
const { scheduleMatchTask } = require('../../utils/lib/matchScheduler')
const { getS3ImageURL } = require('../../utils/lib/services')
const config = require('../../../config')
const { ObjectId } = require('mongoose').Types
const cachegoose = require('cachegoose')
const grpcControllers = require('../../grpc/client')
const _ = require('../../../global/lib/helpers')
const opencage = require('opencage-api-client')
const { createPoll } = require('../Common/controllers')

const fetchPlayersByCountry = async (sCountry, context) => {
  try {
    const seoArr = []
    let entitySportsPath
    if (sCountry) entitySportsPath = `${process.env.ENTITY_SPORT_BASE_URL}players?country=${sCountry}`
    if (sCountry === 'all') entitySportsPath = `${process.env.ENTITY_SPORT_BASE_URL}players`

    const nPerPage = 300
    let nPaged = 1
    let bIsRemaining = true
    let nTotal = null

    while (bIsRemaining) {
      const { data } = await axios.get(entitySportsPath, { params: { token: process.env.ENTITY_SPORT_TOKEN, per_page: nPerPage, paged: nPaged } })

      const { response: { items, total_pages: nTotalPages } } = data
      if (!nTotal) {
        nTotal = nTotalPages
      }

      if (items?.length) {
        for (const p of items) {
          const { pid } = p

          const player = await PlayersModel.findOne({ sPlayerKey: pid.toString() }).lean()

          if (!player) {
            const { pid: sPlayerKey, short_name: sShortName, first_name: sFirstName, last_name: sLastName, middle_name: sMiddleName, birthdate: sBirthDate, birthplace: sBirthPlace, country: sCountry, logo_url: sLogoUrl, playing_role: sPlayingRole, batting_style: sBattingStyle, bowling_style: sBowlingStyle, fielding_position: sFieldingPosition, recent_match: sRecentMatchKey, recent_appearance: dRecentAppearance, fantasy_player_rating: nFantasyPlayerRating, nationality: sNationality } = p

            const playerParams = {
              sPlayerKey: sPlayerKey.toString(),
              sFullName: sFirstName,
              sShortName,
              sFirstName,
              sLastName,
              sMiddleName,
              sBirthDate: moment(sBirthDate).isValid() ? sBirthDate : null,
              sBirthPlace,
              sCountry,
              sBowlingStyle,
              sFieldingPosition,
              dRecentAppearance,
              sNationality,
              sLogoUrl,
              sPlayingRole,
              sBattingStyle,
              eTagStatus: 'p',
              sCountryFull: sNationality
            }
            const s3Res = await getS3ImageURL(encodeURI(sLogoUrl), config.S3_BUCKET_PLAYER_THUMB_URL_PATH)
            if (s3Res?.success) playerParams.oImg = { sUrl: s3Res.path }
            else playerParams.oImg = { sUrl: '' }

            playerParams.aFantasyPlayerRating = []
            enums.ePlatformType.value.forEach(e => {
              playerParams.aFantasyPlayerRating.push({
                ePlatformType: e,
                nRating: nFantasyPlayerRating
              })
            })
            if (sRecentMatchKey) playerParams.iRecentMatchId = await getMatchIdFromKey(sRecentMatchKey.toString())
            const newPlayer = await PlayersModel.create(playerParams)
            const seoParams = {}
            seoParams.iId = newPlayer._id.toString()
            seoParams.eType = 'p'
            seoParams.sTitle = `${playerParams.sFullName} Latest News, Records, Stats & Career Info - CricTracker`
            seoParams.sDescription = `${playerParams.sFullName} News: Check out the latest news and updates on ${playerParams.sFullName} along with photos, videos, biography, career stats, and more on CricTracker.`
            seoParams.sSlug = `${playerSlug}/${newPlayer.sFirstName}`
            seoArr.push(seoParams)
            // queuePush('addSeoData', seoParams)
            updatePlayersGenderFun(newPlayer._id)
          }
        }
      }

      if ((nTotal !== nPaged) && nTotal) {
        ++nPaged
      } else {
        bIsRemaining = false
      }
    }
    await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: seoArr }, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return error
  }
}

const getEnumFromKey = async (sKey, eType, resType, sValue) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // resType = id --> _id
        // resType = value --> sValue
        // resType = null --> {_id,sValue}
        // sValue = string value for creating new doc

        sKey = sKey.toLowerCase().replace(' ', '')
        let enumData = await EnumsModel.findOne({ sKey, eType })
        if (!enumData) {
          // create new doc
          const newValue = sValue?.toLowerCase()?.replace(' ', '')
          enumData = await EnumsModel.create({ sKey, eType, sValue: newValue })
        }

        if (resType === 'id') resolve(enumData?._id)
        else if (resType === 'value') resolve(enumData?.sValue)
        else resolve({ _id: enumData?._id, sValue: enumData?.sValue })
      } catch (error) {
        reject(error)
      }
    })()
  })
}

const getTeamIdFromKey = async (sTeamKey, type, teamObj = null) => {
  try {
    if (!sTeamKey) return null
    let teamValue
    const team = await TeamsModel.findOne({ sTeamKey })
    if (team) {
      teamValue = team
    } else if (teamObj) {
      const { tid, title: sTeamTitle, abbr: sAbbr, logo_url: sLogoUrl, type: sTeamType, country: sCountry, alt_name: sAltName, sex: sSex } = teamObj

      const teamParams = {
        sTeamKey: tid.toString(),
        sTitle: sTeamTitle,
        sAbbr,
        sLogoUrl,
        sTeamType,
        sCountry,
        sAltName,
        sSex,
        eProvider: 'es'
      }
      const s3Res = await getS3ImageURL(sLogoUrl, config.S3_BUCKET_TEAM_THUMB_URL_PATH)
      if (s3Res?.success) teamParams.oImg = { sUrl: s3Res.path }
      else teamParams.oImg = { sUrl: '' }

      if (sCountry) teamParams.sCountryFull = await getCountryFullName(sCountry)

      const newTeam = await TeamsModel.create(teamParams)
      teamValue = newTeam

      const seoParams = {}
      seoParams.iId = newTeam._id.toString()
      seoParams.eType = 't'
      seoParams.sSlug = `${teamSlug}/${newTeam.sTitle}`
      seoParams.sTitle = `${newTeam.sTitle} Cricket Team: Latest ${newTeam.sTitle} Cricket Team News, Matches, Players, Scores & Stats - Crictracker`
      seoParams.sDescription = `${newTeam.sTitle} Cricket Team: Read all the latest ${newTeam.sTitle} cricket team news, updates, previews, schedule, stats, and videos on Crictracker`

      await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
      // queuePush('addSeoData', seoParams)
    } else {
      const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}teams/${sTeamKey}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })

      if (res?.data?.response) {
        const { tid: sTeamKey, title: sTitle, abbr: sAbbr, logo_url: sLogoUrl, type: sTeamType, country: sCountry, alt_name: sAltName, sex: sSex } = res.data.response

        const newTeamParams = { sTeamKey: sTeamKey.toString(), sTitle, sAbbr, sLogoUrl, sTeamType, sCountry, sAltName, sSex }
        const s3Res = await getS3ImageURL(sLogoUrl, config.S3_BUCKET_TEAM_THUMB_URL_PATH, sTeamKey)
        if (s3Res?.success) newTeamParams.oImg = { sUrl: s3Res.path }
        else newTeamParams.oImg = { sUrl: '' }

        if (sCountry) newTeamParams.sCountryFull = await getCountryFullName(sCountry)

        const newTeam = await TeamsModel.create(newTeamParams)
        teamValue = newTeam

        const seoParams = {}
        seoParams.iId = newTeam._id.toString()
        seoParams.eType = 't'
        seoParams.sSlug = `${teamSlug}/${newTeam.sTitle}`
        seoParams.sTitle = `${newTeam.sTitle} Cricket Team: Latest ${newTeam.sTitle} Cricket Team News, Matches, Players, Scores & Stats - Crictracker`
        seoParams.sDescription = `${newTeam.sTitle} Cricket Team: Read all the latest ${newTeam.sTitle} cricket team news, updates, previews, schedule, stats, and videos on Crictracker`

        await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
        // queuePush('addSeoData', seoParams)
      } else teamValue = null
    }
    if (teamValue) return type === 'details' ? teamValue : teamValue?._id
    else return null
  } catch (error) {
    return error
  }
}

const updateTeam = async () => {
  try {
    const teams = await TeamsModel.find({
      _id: {
        $in: [ObjectId('622dae0c09a36f4f3cbf7513'), ObjectId('622dadec09a36f4f3cbf6406'), ObjectId('622dae0909a36f4f3cbf7365'), ObjectId('622dadf409a36f4f3cbf6845'), ObjectId('622dae0609a36f4f3cbf71ba')

        ]
      }
    })

    for (let i = 0; i < teams.length; i++) {
      const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}teams/${teams[i].sTeamKey}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })

      if (res?.data?.response) {
        const { tid: sTeamKey, title: sTitle, abbr: sAbbr, logo_url: sLogoUrl, type: sTeamType, country: sCountry, alt_name: sAltName, sex: sSex } = res.data.response

        const newTeamParams = { sTeamKey: sTeamKey.toString(), sTitle, sAbbr, sLogoUrl, sTeamType, sCountry, sAltName, sSex }
        const s3Res = await getS3ImageURL(sLogoUrl, config.S3_BUCKET_TEAM_THUMB_URL_PATH)
        if (s3Res?.success) newTeamParams.oImg = { sUrl: s3Res.path }
        else newTeamParams.oImg = { sUrl: '' }

        // if (sCountry) newTeamParams.sCountryFull = await getCountryFullName(sCountry)
        await TeamsModel.updateOne({ _id: teams[i]._id }, { $set: newTeamParams })
      }
    }
  } catch (error) {

  }
}

const getMatchIdFromKey = async (sMatchKey) => {
  try {
    let matchId
    const match = await MatchesModel.findOne({ sMatchKey }).lean()
    if (match) {
      matchId = match._id
      if (match?.oToss?.iWinnerTeamId) {
        const query = {
          iMatchId: match?._id,
          nInningNumber: 0,
          sEventId: '0',
          eEvent: 'to',
          sCommentary: match?.oToss?.sText
        }

        const tossInfo = await CommentariesModel.findOne({ sEventId: '0', eEvent: 'to', iMatchId: ObjectId(match?._id) }).lean()
        if (!tossInfo) await CommentariesModel.updateOne({ iMatchId: ObjectId(match?._id), sEventId: '0', eEvent: 'to' }, query, { upsert: true })
      }
    } else {
      const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}matches/${sMatchKey}/info?token=${process.env.ENTITY_SPORT_TOKEN}`)

      if (res?.data?.response) {
        const { competition: { cid, category: seriesCategory }, match_id: sMatchKey, title: sTitle, short_title: sShortTitle, subtitle: sSubtitle, format, format_str: sFormatStr, status, status_str: sStatusStr, status_note: sStatusNote, verified: bVerified, pre_squad: bPreSquad, game_state: sLiveGameStatus, game_state_str: sLiveGameStatusStr, teama, teamb, date_start: startDate, date_end: endDate, timestamp_start: dStartTimestamp, timestamp_end: dEndTimestamp, venue, umpires: sUmpires, referee: sReferee, equation: sEquation, live: sLiveMatchNote, result: sResult, win_margin: sWinMargin, winning_team_id: sWinningTeamKey, commentary, wagon, latest_inning_number: nLatestInningNumber, toss, domestic } = res.data.response
        const { etag: sETag } = res.data.response

        const { team_id: sTeamKeyA, scores_full: sScoresFullA, scores: sScoresA, overs: sOversA } = teama
        const sSeriesKey = cid?.toString()

        const teamData1 = await getTeamIdFromKey(sTeamKeyA.toString(), 'details')
        const oTeamScoreA = {
          iTeamId: teamData1?._id,
          sScoresFull: sScoresFullA,
          sScores: sScoresA,
          sOvers: sOversA
        }

        const { team_id: sTeamKeyB, scores_full: sScoresFullB, scores: sScoresB, overs: sOversB } = teamb

        const teamData2 = await getTeamIdFromKey(sTeamKeyB.toString(), 'details')
        const oTeamScoreB = {
          iTeamId: teamData2?._id,
          sScoresFull: sScoresFullB,
          sScores: sScoresB,
          sOvers: sOversB
        }

        const matchParams = {}
        let aCMatches

        const seriesDetail = await getSeriesIdFromKey(cid.toString(), 'details')

        matchParams.iSeriesId = seriesDetail?._id
        matchParams.sSeriesKey = sSeriesKey
        matchParams.sMatchKey = sMatchKey.toString()
        matchParams.iVenueId = await getVenueIdFromVenueObj(venue)
        matchParams.sTitle = sTitle
        matchParams.oTeamScoreA = oTeamScoreA
        matchParams.oTeamScoreB = oTeamScoreB
        matchParams.bIsCommentary = commentary === 1
        matchParams.bIsWagon = wagon === 1
        matchParams.sShortTitle = sShortTitle
        matchParams.sSubtitle = sSubtitle // match no. (33rd Match)
        matchParams.bVerified = bVerified
        matchParams.bPreSquad = bPreSquad
        matchParams.dStartDate = moment.utc(startDate, 'YYYY-MM-DD hh:mm:ss').toDate()
        matchParams.dEndDate = moment.utc(endDate, 'YYYY-MM-DD hh:mm:ss').toDate()
        matchParams.dStartTimestamp = dStartTimestamp
        matchParams.dEndTimestamp = dEndTimestamp
        matchParams.nLatestInningNumber = nLatestInningNumber
        matchParams.eProvider = 'es'
        matchParams.sETag = sETag

        if (toss) {
          const oToss = {}
          if (toss?.sText) oToss.sText = toss.text
          if (toss?.decision !== 0) {
            const decisionEnum = await getEnumFromKey(toss?.decision?.toString(), 'mtd')
            oToss.eDecision = decisionEnum?.sValue
          }
          if (toss?.winner) oToss.iWinnerTeamId = await getTeamIdFromKey(toss?.winner.toString())
          matchParams.oToss = oToss
        }

        if (sLiveGameStatus) {
          const enumData = await getEnumFromKey(sLiveGameStatus.toString(), 'lmsc', null, sLiveGameStatusStr.toString())
          matchParams.iLiveGameStatusId = enumData?._id || null
          matchParams.sLiveGameStatusStr = enumData?.sValue || sLiveGameStatusStr.toString()
        }

        if (format) {
          const formatEnum = await getEnumFromKey(format.toString(), 'mfc', null, sFormatStr.toString())
          matchParams.iFormatId = formatEnum?._id || null
          matchParams.sFormatStr = formatEnum?.sValue || sFormatStr.toString()
          if (seriesCategory !== 'women') matchParams.bIsDomestic = seriesCategory !== 'international'
          else {
            if (domestic) matchParams.bIsDomestic = domestic !== '0'
            else {
              // call competition matches
              aCMatches = await fetchFullSeriesMatchesFun(sSeriesKey)
              if (aCMatches?.length) {
                const existMatch = aCMatches.find((ele) => ele?.match_id?.toString() === sMatchKey.toString())
                matchParams.bIsDomestic = existMatch?.domestic !== '0'

                // add all competition matches if it isnt exist
                const allMatchesCount = await MatchesModel.countDocuments({ sSeriesKey })
                if (aCMatches?.length !== allMatchesCount) fetchMatchFromApi(null, null, aCMatches, false)
              }
            }
          }
        }

        if (status) {
          const statusEnum = await getEnumFromKey(status.toString(), 'msc', null, sStatusStr.toString())
          matchParams.iStatusId = statusEnum?._id || null
          matchParams.sStatusStr = statusEnum?.sValue || sStatusStr.toString()
        }

        if (sStatusNote) matchParams.sStatusNote = sStatusNote.replace(/&amp;/g, '&')
        if (sUmpires) matchParams.sUmpires = sUmpires
        if (sReferee) matchParams.sReferee = sReferee
        if (sEquation) matchParams.sEquation = sEquation
        if (sLiveMatchNote) matchParams.sLiveMatchNote = sLiveMatchNote
        if (sResult) matchParams.sResult = sResult
        if (sWinMargin) matchParams.sWinMargin = sWinMargin
        if (sWinningTeamKey) matchParams.iWinnerId = await getTeamIdFromKey(sWinningTeamKey.toString())

        const newMatch = await MatchesModel.create(matchParams)

        if (!newMatch?.sShortTitle?.includes('TBA') || !newMatch?.sTitle?.includes('TBA')) {
          createPoll(newMatch, teamData1, teamData2)
        }

        if (newMatch?.oToss?.iWinnerTeamId) {
          const query = {
            iMatchId: newMatch?._id,
            nInningNumber: 0,
            sEventId: '0',
            eEvent: 'to',
            sCommentary: newMatch?.oToss?.sText
          }

          const tossInfo = await CommentariesModel.findOne({ sEventId: '0', eEvent: 'to', iMatchId: ObjectId(match?._id) }).lean()

          if (!tossInfo) await CommentariesModel.updateOne({ iMatchId: newMatch?._id, sEventId: '0', eEvent: 'to' }, query, { upsert: true })
        }

        matchId = newMatch._id

        // add series teams, venues and matches
        // create seo
        const sMatchInfo = enums?.eMatchFormat?.description[`${newMatch?.sFormatStr}`]
        const seoParams = {
          iId: newMatch._id.toString(),
          eType: 'ma',
          sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score | ${teamData1.sTitle} vs ${teamData2.sTitle} Score & Updates`,
          sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score: Get all the latest ${teamData1.sTitle} vs ${teamData2.sTitle} ${sMatchInfo} Live Score, ball by ball commentary & cricket updates on CricTracker.`
        }

        let formatStr = await MatchesModel.distinct('sFormatStr')

        formatStr.shift()

        formatStr = formatStr.map((ele) => ele?.toLowerCase()?.split(' ')?.join('-'))

        let type

        if (newMatch?.sSubtitle) {
          newMatch.sSubtitle = newMatch?.sSubtitle?.toLowerCase().split(' ').join('-')
          if (formatStr.some((ele) => newMatch?.sSubtitle.includes(ele))) type = newMatch?.sSubtitle
          else type = `${newMatch?.sSubtitle.toLowerCase().split(' ').join('-')}-${newMatch?.sFormatStr}`
        } else type = newMatch?.sFormatStr

        const date = new Date(newMatch.dStartDate).toDateString().toLocaleLowerCase().split(' ')

        seoParams.sSlug = `live-scores/${teamData1.sAbbr}-vs-${teamData2.sAbbr}-${type}-${seriesDetail.sTitle}-${date[2]}-${date[1]}-${date[3]}`

        await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
        // queuePush('addSeoData', seoParams)
        // matchSeoBuilder(newMatch, teamData1, teamData2, sMatchInfo, seriesDetail, queuePush)
        addSeriesData(newMatch)
      } else matchId = null
    }
    return matchId
  } catch (error) {
    return (error)
  }
}

const getVenueIdFromVenueObj = async (oVenue = null, sVenueKey) => {
  try {
    const query = {}
    if (Object.keys(oVenue).length) query.sVenueKey = oVenue.venue_id
    if (sVenueKey) query.sVenueKey = sVenueKey

    let venue = await VenuesModel.findOne(query).lean()
    let data
    if (!venue) {
      const { venue_id: sVenueKey, name: sName, location: sLocation, timezone: sTimezone } = oVenue
      try {
        data = await opencage.geocode({ q: oVenue?.sName || oVenue?.name })
        if (data?.results[0]?.geometry?.lat && data?.results[0]?.geometry?.lng) {
          data = await opencage.geocode({ q: oVenue?.sLocation || oVenue?.city })
        }
      } catch (error) {
        console.log(error)
      }
      venue = await VenuesModel.create({ sVenueKey, sName, sLocation, sTimezone, sLatitude: data?.results[0]?.geometry?.lat, sLongitude: data?.results[0]?.geometry?.lng })

      // seo stream
      const seoParams = {
        iId: venue._id.toString(),
        eType: 'v'
      }
      seoParams.sSlug = `${venueSlug}/${venue?.sName}`
      await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
      // queuePush('addSeoData', seoParams)
    }
    return venue._id
  } catch (error) {
    return error
  }
}

const getPlayerIdFromKey = async (sPlayerKey, playerObj = null, type) => {
  try {
    if (!sPlayerKey) return null
    let playerId
    const player = await PlayersModel.findOne({ sPlayerKey }).populate('oPrimaryTeam', ['oJersey']).lean()

    if (!sPlayerKey) return null
    if (player) {
      playerId = type ? player : player._id
    } else if (playerObj) {
      const { pid: sPlayerKey, title: sTitle, short_name: sShortName, first_name: sFirstName, last_name: sLastName, middle_name: sMiddleName, birthdate: dBirthDate, birthplace: sBirthPlace, country: sCountry, primary_team: aPrimaryTeam, logo_url: sLogoUrl, playing_role: sPlayingRole, batting_style: sBattingStyle, bowling_style: sBowlingStyle, fielding_position: sFieldingPosition, recent_match: sRecentMatchKey, recent_appearance: dRecentAppearance, fantasy_player_rating: nFantasyPlayerRating, nationality: sPlayerNationality } = playerObj

      const playerParams = {
        sPlayerKey: sPlayerKey.toString(),
        sFullName: sTitle || sFirstName,
        sShortName,
        sFirstName,
        sLastName,
        sMiddleName,
        sBirthPlace,
        sCountry,
        aPrimaryTeam,
        sLogoUrl,
        sPlayingRole: await getEnumFromKey(sPlayingRole, 'pr', 'value'),
        sBattingStyle,
        sBowlingStyle,
        sFieldingPosition,
        sNationality: sPlayerNationality,
        eProvider: 'es'
      }
      const s3Res = await getS3ImageURL(sLogoUrl, config.S3_BUCKET_PLAYER_THUMB_URL_PATH)
      if (s3Res?.success) playerParams.oImg = { sUrl: s3Res.path }
      else playerParams.oImg = { sUrl: '' }

      const aRating = ePlatformType.value.map(p => {
        return {
          ePlatformType: p,
          nRating: nFantasyPlayerRating
        }
      })
      playerParams.aFantasyPlayerRating = aRating

      if (dBirthDate && (dBirthDate !== '0000-00-00')) playerParams.dBirthDate = moment(dBirthDate, 'YYYY-MM-DD').toDate()
      if (sRecentMatchKey) playerParams.iRecentMatchId = await getMatchIdFromKey(sRecentMatchKey.toString())
      if (dRecentAppearance) playerParams.dRecentAppearance = moment(dRecentAppearance).unix()
      if (sCountry) playerParams.sCountryFull = await getCountryFullName(sCountry)

      const newPlayer = await PlayersModel.create(playerParams)
      playerId = type ? newPlayer : newPlayer._id

      // seo creation
      const seoParams = {}
      seoParams.iId = newPlayer._id.toString()
      seoParams.eType = 'p'
      seoParams.sTitle = `${playerParams.sFullName} Latest News, Records, Stats & Career Info - CricTracker`
      seoParams.sDescription = `${playerParams.sFullName} News: Check out the latest news and updates on ${playerParams.sFullName} along with photos, videos, biography, career stats, and more on CricTracker.`
      seoParams.sSlug = `${playerSlug}/${newPlayer.sFirstName}`
      // queuePush('addSeoData', seoParams)
      updatePlayersGenderFun(playerId)
      await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
    } else {
      const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}players/${sPlayerKey}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
      const { data: { response } } = res

      if (response?.player) {
        const {
          pid: sPlayerKey, short_name: sShortName, first_name: sFirstName, last_name: sLastName, middle_name: sMiddleName, title: sTitle, birthdate: dBirthDate, birthplace: sBirthPlace, country: sCountry, thumb_url: sThumbUrl, logo_url: sLogoUrl, playing_role: sPlayingRole, batting_style: sBattingStyle, bowling_style: sBowlingStyle, fielding_position: sFieldingPosition, recent_match: sRecentMatchKey, recent_appearance: dRecentAppearance, fantasy_player_rating: nFantasyPlayerRating, nationality: sCountryFull
        } = response.player

        const playerParam = {
          sPlayerKey,
          sShortName,
          sFirstName,
          sLastName,
          sMiddleName,
          sFullName: sTitle || sFirstName,
          sBirthPlace,
          sCountry,
          sThumbUrl, // oImg
          sLogoUrl,
          sPlayingRole,
          sBattingStyle,
          sBowlingStyle,
          sFieldingPosition,
          sCountryFull
        }
        const s3Res = await getS3ImageURL(sLogoUrl, config.S3_BUCKET_PLAYER_THUMB_URL_PATH)
        if (s3Res?.success) playerParam.oImg = { sUrl: s3Res.path }
        else playerParam.oImg = { sUrl: '' }

        const aRating = ePlatformType.value.map(p => {
          return {
            ePlatformType: p,
            nRating: nFantasyPlayerRating
          }
        })
        playerParam.aFantasyPlayerRating = aRating

        if (dBirthDate && (dBirthDate !== '0000-00-00')) playerParam.dBirthDate = moment(dBirthDate, 'YYYY-MM-DD').toDate()

        if (sRecentMatchKey) playerParam.iRecentMatchId = await getMatchIdFromKey(sRecentMatchKey.toString())
        if (dRecentAppearance) playerParam.dRecentAppearance = moment(dRecentAppearance).unix()

        const newPlayerDoc = await PlayersModel.create(playerParam)

        // seo creation
        const seoParams = {}
        seoParams.iId = newPlayerDoc._id.toString()
        seoParams.eType = 'p'
        seoParams.sTitle = `${newPlayerDoc.sFullName} Latest News, Records, Stats & Career Info - CricTracker`
        seoParams.sDescription = `${newPlayerDoc.sFullName} News: Check out the latest news and updates on ${newPlayerDoc.sFullName} along with photos, videos, biography, career stats, and more on CricTracker.`
        seoParams.sSlug = `${playerSlug}/${newPlayerDoc.sFirstName}`
        // queuePush('addSeoData', seoParams)
        await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
        updatePlayersGenderFun(playerId)

        playerId = type ? newPlayerDoc : newPlayerDoc._id
      } else playerId = null
    }
    return playerId
  } catch (error) {
    return error
  }
}

const getCountryFullName = async (sISO) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (sISO) {
          const country = await CountryModel.findOne({ sISO })

          if (country) resolve(country.sTitle)
          else resolve(null)
        } else resolve(null)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })()
  })
}

const fetchSeriesSquadFun = async (sSeriesKey = '', sMatchesKey = '') => {
  try {
    let res
    if (sSeriesKey && sMatchesKey) {
      res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sSeriesKey}/squads/${sMatchesKey}?token=${process.env.ENTITY_SPORT_TOKEN}`)
    } else {
      res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sSeriesKey}/squads/?token=${process.env.ENTITY_SPORT_TOKEN}`)
    }

    const overseaseDeclare = await OversesPlayerModel.findOne({ sSeriesKey }).lean()

    const { data } = res
    const { response: { squads } } = data
    const bulkUpdate = []
    const bulkUpdateFantasyPlayer = []
    if (squads?.length) {
      for (const squad of squads) {
        const { team_id: sTeamKey, title: sTitle, players, team } = squad
        let match
        if (sMatchesKey) match = await MatchesModel.findOne({ sMatchKey: sMatchesKey.toString() }).lean() // obj removed
        const mongoPlayers = await SeriesSquadModel.find({ sSeriesKey, sTeamKey: squad.team_id }).sort({ sPlayerKey: 1 }).collation({ locale: 'en_US', numericOrdering: true })

        const iTeamId = await getTeamIdFromKey(sTeamKey.toString())

        for (const p of players) {
          const index = mongoPlayers.findIndex((ele) => ele.sPlayerKey === p.pid.toString())
          // Insert new players in series squad
          const oPlayer = await getPlayerIdFromKey(p.pid.toString(), null, 'details') // obj removed
          if (index === -1) {
            const query = { sSeriesKey: sSeriesKey.toString(), sTeamKey: sTeamKey.toString(), sPlayerKey: p.pid.toString() }

            const iTeamId = await getTeamIdFromKey(sTeamKey.toString())
            const iSeriesId = await getSeriesIdFromKey(sSeriesKey)

            const seriesSquadParams = {
              iTeamId,
              iPlayerId: oPlayer?._id,
              iSeriesId,
              sTeamKey,
              sSeriesKey,
              sPlayerKey: p.pid.toString(),
              sTitle,
              eProvider: 'es'
            }

            if (overseaseDeclare && p?.nationality) Object.assign(seriesSquadParams, { bIsOverseas: p.nationality !== overseaseDeclare.sHomeCountry })
            if (iTeamId && oPlayer?._id && iSeriesId) {
              bulkUpdate.push({
                updateOne: {
                  filter: query,
                  update: seriesSquadParams,
                  upsert: true
                }
              })
              // add series team
              addSeriesTeamData(sSeriesKey, team?.tid?.toString())
            }
          }
        }

        for (const player of mongoPlayers) {
          const index = players.findIndex((ele) => ele.pid.toString() === player.sPlayerKey)
          if (index === -1) {
            bulkUpdate.push({
              deleteOne: {
                filter: { sSeriesKey: sSeriesKey.toString(), sPlayerKey: player.sPlayerKey, sTeamKey: squad.team_id.toString() }
              }
            })
          }
        }

        // Checks if there is any extra or invalid player in our db
        if (match) {
          const fantasyPlayers = await FantasyPlayersModel.find({ iMatchId: _.mongify(match._id), iTeamId: _.mongify(iTeamId) }).populate('oPlayer').lean()

          for (const platformType of ePlatformType.value) {
            const bFantasyArticle = await FantasyArticlesModel.countDocuments({ iMatchId: _.mongify(match._id), ePlatformType: platformType, eState: { $ne: 't' } }).lean()
            if (bFantasyArticle) {
              // Update Fantasy Players if updating for a match
              // Check if player coming from entity and not in our db
              for (const p of players) {
                const oPlayer = await getPlayerIdFromKey(p.pid.toString(), null, 'details') // obj removed

                const isPlayerExist = fantasyPlayers.findIndex((ele) => ele.iPlayerId.toString() === oPlayer._id.toString())

                if (isPlayerExist === -1) {
                  const playerParams = {
                    iMatchId: match?._id,
                    iPlayerId: oPlayer._id,
                    iTeamId,
                    ePlatformType: platformType,
                    eRole: oPlayer?.sPlayingRole || null
                  }

                  const { aFantasyPlayerRating } = oPlayer // obj
                  const creditIndex = aFantasyPlayerRating.findIndex(c => c?.ePlatformType === platformType)
                  playerParams.nRating = aFantasyPlayerRating[creditIndex]?.nRating || 8 // default player credit
                  bulkUpdateFantasyPlayer.push({
                    updateOne: {
                      filter: { iMatchId: _.mongify(match._id), iPlayerId: _.mongify(playerParams?.iPlayerId), iTeamId: _.mongify(playerParams?.iTeamId), ePlatformType: platformType },
                      update: playerParams,
                      upsert: true
                    }
                  })
                }
              }

              // Check if player is in our db and not in entity
              for (const player of fantasyPlayers) {
                const isPlayerExist = players.findIndex((ele) => ele.pid.toString() === player?.oPlayer.sPlayerKey.toString())
                if (isPlayerExist === -1) {
                  const matchSquad = await MatchSquadModel.countDocuments({ iMatchId: _.mongify(match._id), iPlayerId: _.mongify(player?.oPlayer?._id), iTeamId: _.mongify(iTeamId) }).lean()
                  if (!matchSquad) {
                    bulkUpdateFantasyPlayer.push({
                      deleteOne: {
                        filter: { iMatchId: _.mongify(match._id), iPlayerId: _.mongify(player?.oPlayer?._id), iTeamId: _.mongify(iTeamId), ePlatformType: platformType }
                      }
                    })
                  }
                }
              }
            }
          }
        }
      }

      await SeriesSquadModel.bulkWrite(bulkUpdate)
      if (sMatchesKey) await FantasyPlayersModel.bulkWrite(bulkUpdateFantasyPlayer)
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const getSeriesIdFromKey = async (sKey, type = null) => {
  try {
    let series = await SeriesModel.findOne({ sSeriesKey: sKey })
    if (!series) {
      const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sKey}?token=${process.env.ENTITY_SPORT_TOKEN}`)
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

        if (sGameFormat === 'lista' || sGameFormat === 'firstclass') seriesParams.isBlockedMini = true

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
        const statsRes = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sKey}/stats/?token=${process.env.ENTITY_SPORT_TOKEN}`)
        if (typeof statsRes?.data?.response !== 'string') {
          seriesParams.aFormats = statsRes?.data?.response?.formats
        }

        const newSeries = await SeriesModel.create(seriesParams)
        series = newSeries

        // check series seo
        const newSlug = series.sTitle.toString().toLowerCase().split(' ')
        if (!isNaN(newSlug[newSlug.length - 1])) {
          newSlug.pop()
        }
        const seoParams = {
          iId: series._id,
          eType: 'se'
        }

        Object.assign(seoParams, {
          sTitle: `${series.sAbbr.toUpperCase()} Live Score | ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} News, Updates & Scores.`,
          sDescription: `${series.sAbbr.toUpperCase()} Live Score: Get all the latest ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} news, ${series.sAbbr.toUpperCase()} scores, squads, fixtures, injury updates, match results & fantasy tips only on CricTracker.`,
          sSlug: `cricket-series/${newSlug.join('-')}-${series.sSeason.toString().split('/').join('-')}`,
          sCUrl: `cricket-series/${newSlug.join('-')}-${series.sSeason.toString().split('/').join('-')}`
        })

        // queuePush('addSeoData', seoParams)
        await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })

        seriesSeoBuilder({
          iId: series._id,
          eType: 'se'
        }, series, queuePush)

        fetchSeriesSquadFun(sKey)
        scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: series.sSeriesKey, _id: series._id } }, moment().unix())
        // scheduleMatchTask({ eType: 'statTypes', data: { sSeriesKey: series.sSeriesKey } }, moment().unix())
      }
      fetchSeriesMatches([sKey])
    }

    // it will add stats into scheduler

    return type === 'details' ? series : series._id
  } catch (error) {
    return error
  }
}

const fetchMatchSquadFun = async (sMatchKey) => {
  try {
    const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}matches/${sMatchKey}/squads?token=${process.env.ENTITY_SPORT_TOKEN}`)
    const { data } = res
    if (data?.response) {
      const { response: { teama, teamb } } = data

      const { team_id: teamKeyA, squads: squadA } = teama
      const { team_id: teamKeyB, squads: squadB } = teamb

      const match = await MatchesModel.findOne({ sMatchKey }, { sSeriesKey: 1 }).lean()

      const iTeamIdA = await getTeamIdFromKey(teamKeyA.toString()) // send team obj
      const iTeamIdB = await getTeamIdFromKey(teamKeyB.toString())

      const squadAUpdate = []
      const squadBUpdate = []

      const mongoTeamSquadA = await MatchSquadModel.find({ iMatchId: _.mongify(match._id), iTeamId: _.mongify(iTeamIdA) }).lean()

      const mongoTeamSquadB = await MatchSquadModel.find({ iMatchId: _.mongify(match._id), iTeamId: _.mongify(iTeamIdB) }).lean()

      const overseaseDeclare = await OversesPlayerModel.findOne({ sSeriesKey: match?.sSeriesKey }).lean()

      for (let i = 0; i < squadA.length; i++) {
        const player = squadA[i]
        const {
          player_id: sPlayerKey, role, substitute: bSubstitute, out: bOut, in: bIn, role_str: roleStr, playing11: bPlaying11, name: sName
        } = player
        const squadParams = {
          iTeamId: iTeamIdA,
          iPlayerId: await getPlayerIdFromKey(sPlayerKey?.toString()),
          iMatchId: _.mongify(match._id),
          sTeamKey: teamKeyA?.toString(),
          sPlayerKey: sPlayerKey?.toString(),
          sMatchKey,
          bSubstitute,
          sName,
          bPlaying11,
          eProvider: 'es',
          bOut: bOut === 'true',
          bIn: bIn === 'true',
          nPriority: i
        }

        if (role) {
          const roleEnum = await getEnumFromKey(role, 'msr', null, roleStr)
          squadParams.iRoleId = roleEnum?._id || null
          squadParams.sRoleStr = roleEnum?.sValue || roleStr
          if (roleStr && roleStr === '(C)') {
            if (role === 'wk') {
              Object.assign(squadParams, { sSplRoleStr: 'wkcap' })
            } else {
              Object.assign(squadParams, { sSplRoleStr: 'cap' })
            }
          }
          if (roleStr && role === 'wk' && (roleStr === '' || roleStr === '(WK)')) Object.assign(squadParams, { sSplRoleStr: 'wk' })
        }

        if (squadParams?.iTeamId && squadParams?.iPlayerId && squadParams?.iMatchId) {
          // await MatchSquadModel.updateOne({ sMatchKey, sPlayerKey: sPlayerKey.toString(), sTeamKey: teamKeyA.toString() }, squadParams, { upsert: true })
          squadAUpdate.push({
            updateOne: {
              filter: { sMatchKey, sPlayerKey: sPlayerKey.toString(), sTeamKey: teamKeyA.toString() },
              update: squadParams,
              upsert: true
            }
          })
        }
      }

      for (const player of mongoTeamSquadA) {
        const index = squadA.findIndex((ele) => ele.player_id === player.sPlayerKey)
        if (index === -1) {
          console.log({ deletePlayer: player.sName }, 'squad a')
          squadAUpdate.push({
            deleteOne: {
              filter: { sMatchKey, sPlayerKey: player.sPlayerKey.toString(), sTeamKey: teamKeyA.toString() }
            }
          })
        }
      }

      for (let i = 0; i < squadB.length; i++) {
        const player = squadB[i]
        const {
          player_id: sPlayerKey, role, substitute: bSubstitute, out: bOut, in: bIn, role_str: roleStr, playing11: bPlaying11, name: sName
        } = player

        const squadParams = {
          iTeamId: iTeamIdB,
          iPlayerId: await getPlayerIdFromKey(sPlayerKey?.toString()),
          iMatchId: _.mongify(match._id),
          sTeamKey: teamKeyB?.toString(),
          sPlayerKey: sPlayerKey?.toString(),
          sMatchKey,
          bSubstitute,
          sName,
          bPlaying11,
          eProvider: 'es',
          bOut: bOut === 'true',
          bIn: bIn === 'true',
          nPriority: i
        }

        if (role) {
          const roleEnum = await getEnumFromKey(role, 'msr', null, roleStr)
          squadParams.iRoleId = roleEnum?._id || null
          squadParams.sRoleStr = roleEnum?.sValue || roleStr
          if (roleStr && roleStr === '(C)') {
            if (role === 'wk') {
              Object.assign(squadParams, { sSplRoleStr: 'wkcap' })
            } else {
              Object.assign(squadParams, { sSplRoleStr: 'cap' })
            }
          }
          if (roleStr && role === 'wk' && (roleStr === '' || roleStr === '(WK)')) Object.assign(squadParams, { sSplRoleStr: 'wk' })
        }
        if (squadParams?.iTeamId && squadParams?.iPlayerId && squadParams?.iMatchId) {
          // await MatchSquadModel.updateOne({ sMatchKey, sPlayerKey: sPlayerKey.toString(), sTeamKey: teamKeyB.toString() }, squadParams, { upsert: true })
          squadBUpdate.push({
            updateOne: {
              filter: { sMatchKey, sPlayerKey: sPlayerKey.toString(), sTeamKey: teamKeyB.toString() },
              update: squadParams,
              upsert: true

            }
          })
        }
      }

      for (const player of mongoTeamSquadB) {
        const index = squadB.findIndex((ele) => ele.player_id === player.sPlayerKey)
        if (index === -1) {
          console.log({ deletePlayer: player.sName }, 'squad b')
          squadBUpdate.push({
            deleteOne: {
              filter: { sMatchKey, sPlayerKey: player.sPlayerKey.toString(), sTeamKey: teamKeyB.toString() }
            }
          })
        }
      }

      // delete old data so if any data replaced can be added

      await MatchSquadModel.bulkWrite([...squadAUpdate, ...squadBUpdate])

      if (squadA.length && squadB.length && teamKeyA.toString() !== '111066' && teamKeyB.toString() !== '111066') {
        const playerA = await MatchSquadModel.find({ iTeamId: ObjectId(iTeamIdA), bPlaying11: true, iMatchId: _.mongify(match._id) }).populate('oPlayer').lean()
        const playerB = await MatchSquadModel.find({ iTeamId: ObjectId(iTeamIdB), bPlaying11: true, iMatchId: _.mongify(match._id) }).populate('oPlayer').lean()
        if (playerA.length === 11 && playerB.length === 11) {
          const teamA = await TeamsModel.findOne({ _id: iTeamIdA }).lean()
          const teamB = await TeamsModel.findOne({ _id: iTeamIdB }).lean()
          const query = {
            iMatchId: _.mongify(match._id),
            nInningNumber: 0,
            sEventId: '0-1',
            eEvent: 'p11',
            oTeamA: {
              sTeam: teamA.sTitle,
              sPlayers: playerA.map((ele) => ele.oPlayer.sFullName ?? ele.oPlayer.sFirstName).join(', ')
            },
            oTeamB: {
              sTeam: teamB.sTitle,
              sPlayers: playerB.map((ele) => ele.oPlayer.sFullName ?? ele.oPlayer.sFirstName).join(', ')
            }
          }

          await CommentariesModel.findOneAndUpdate({ sEventId: '0-1', eEvent: 'p11', iMatchId: _.mongify(match._id) }, { $set: query }, { upsert: true }).lean()
        }
      }

      // logic for declare overses players
      if (overseaseDeclare) {
        const matchSquad = await MatchSquadModel.find({ sMatchKey }).populate([{ path: 'oPlayer', select: 'sCountryFull' }]).lean()

        const idsOfOversesPlayer = []

        for (const matchSquadRec of matchSquad) {
          console.log(matchSquadRec?.oPlayer?.sCountryFull !== overseaseDeclare?.sHomeCountry)
          if (matchSquadRec?.oPlayer?.sCountryFull !== overseaseDeclare?.sHomeCountry) {
            idsOfOversesPlayer.push(matchSquadRec._id)
          }
        }

        if (idsOfOversesPlayer.length && idsOfOversesPlayer.length !== matchSquad.length) {
          await MatchSquadModel.updateMany({ sMatchKey, _id: { $in: idsOfOversesPlayer } }, { $set: { bIsOverseas: true } })
          await MatchSquadModel.updateMany({ sMatchKey, _id: { $nin: idsOfOversesPlayer } }, { $set: { bIsOverseas: false } })
        }
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const fetchMatchFromApi = async (dStart, dEnd, aMatches, bFetchSeriesMatch = true, bUpdate = false) => {
  try {
    let aData = []
    let sETag = null
    let aSeriesKey = []
    const processMatch = async (aData, sETag) => {
      if (aData?.length) {
        for (const m of aData) {
          const { match_id: sMatchKey, teama: { team_id: sTeamKeyA }, teamb: { team_id: sTeamKeyB } } = m
          if (sMatchKey && sTeamKeyA && sTeamKeyB) {
            const sSeriesKey = m?.competition?.cid?.toString()
            aSeriesKey.push(sSeriesKey)

            const teamData1 = await getTeamIdFromKey(sTeamKeyA.toString(), 'details')
            const teamData2 = await getTeamIdFromKey(sTeamKeyB.toString(), 'details')

            const seriesDetail = await getSeriesIdFromKey(sSeriesKey, 'details')

            const match = await MatchesModel.findOne({ sMatchKey: sMatchKey.toString() }).lean()
            if (!match || match.sSeriesKey.toString() !== sSeriesKey.toString() || bUpdate) {
              const { competition: { category: seriesCategory }, title: sTitle, short_title: sShortTitle, subtitle: sSubtitle, format, format_str: sFormatStr, status, status_str: sStatusStr, status_note: sStatusNote, verified: bVerified, pre_squad: bPreSquad, game_state: sLiveGameStatus, game_state_str: sLiveGameStatusStr, teama, teamb, date_start: startDate, date_end: endDate, timestamp_start: dStartTimestamp, timestamp_end: dEndTimestamp, venue, umpires: sUmpires, referee: sReferee, equation: sEquation, live: sLiveMatchNote, result: sResult, win_margin: sWinMargin, winning_team_id: sWinningTeamKey, commentary, wagon, latest_inning_number: nLatestInningNumber, toss, domestic } = m

              const { scores_full: sScoresFullA, scores: sScoresA, overs: sOversA } = teama

              const oTeamScoreA = {
                iTeamId: teamData1?._id,
                sScoresFull: sScoresFullA,
                sScores: sScoresA,
                sOvers: sOversA
              }

              const { scores_full: sScoresFullB, scores: sScoresB, overs: sOversB } = teamb

              const oTeamScoreB = {
                iTeamId: teamData2?._id,
                sScoresFull: sScoresFullB,
                sScores: sScoresB,
                sOvers: sOversB
              }

              const matchParams = {}

              const seriesDetail = await getSeriesIdFromKey(sSeriesKey, 'details')

              matchParams.iSeriesId = seriesDetail?._id
              matchParams.sSeriesKey = sSeriesKey
              matchParams.sMatchKey = sMatchKey.toString()
              matchParams.iVenueId = await getVenueIdFromVenueObj(venue)
              matchParams.sTitle = sTitle
              matchParams.oTeamScoreA = oTeamScoreA
              matchParams.oTeamScoreB = oTeamScoreB
              matchParams.bIsCommentary = commentary === 1
              matchParams.bIsWagon = wagon === 1
              matchParams.sShortTitle = sShortTitle
              matchParams.sSubtitle = sSubtitle // match no. (33rd Match)
              matchParams.bVerified = bVerified
              matchParams.bPreSquad = bPreSquad
              matchParams.dStartDate = moment.utc(startDate, 'YYYY-MM-DD hh:mm:ss').toDate()
              matchParams.dEndDate = moment.utc(endDate, 'YYYY-MM-DD hh:mm:ss').toDate()
              matchParams.dStartTimestamp = dStartTimestamp
              matchParams.dEndTimestamp = dEndTimestamp
              matchParams.nLatestInningNumber = nLatestInningNumber
              matchParams.eProvider = 'es'
              matchParams.sETag = sETag

              let aCMatches

              if (toss) {
                const oToss = {}
                if (toss?.sText) oToss.sText = toss.text
                if (toss?.decision !== 0) {
                  const decisionEnum = await getEnumFromKey(toss?.decision.toString(), 'mtd')
                  oToss.eDecision = decisionEnum?.sValue
                }
                if (toss?.winner) oToss.iWinnerTeamId = await getTeamIdFromKey(toss?.winner.toString())
                matchParams.oToss = oToss
              }

              if (sLiveGameStatus) {
                const enumData = await getEnumFromKey(sLiveGameStatus.toString(), 'lmsc', null, sLiveGameStatusStr.toString())
                matchParams.iLiveGameStatusId = enumData?._id || null
                matchParams.sLiveGameStatusStr = enumData?.sValue || sLiveGameStatusStr.toString()
              }

              if (format) {
                const formatEnum = await getEnumFromKey(format.toString(), 'mfc', null, sFormatStr.toString())
                matchParams.iFormatId = formatEnum?._id || null
                matchParams.sFormatStr = formatEnum?.sValue || sFormatStr.toString()
                // check series category and match domestic
                if (seriesCategory !== 'women') matchParams.bIsDomestic = seriesCategory !== 'international'
                else {
                  if (domestic) matchParams.bIsDomestic = domestic !== '0'
                  else {
                    // call competition matches
                    aCMatches = await fetchFullSeriesMatchesFun(sSeriesKey)
                    if (aCMatches?.length) {
                      const existMatch = aCMatches.find((ele) => ele?.competition?.match_id?.toString() === sMatchKey.toString())
                      matchParams.bIsDomestic = existMatch?.domestic !== '0'

                      // add all competition matches if it isnt exist
                      const allMatchesCount = await MatchesModel.countDocuments({ sSeriesKey })
                      if (aCMatches?.length !== allMatchesCount) fetchMatchFromApi(null, null, aCMatches, false)
                    }
                  }
                }
              }

              if (status) {
                const statusEnum = await getEnumFromKey(status.toString(), 'msc', null, sStatusStr.toString())
                matchParams.iStatusId = statusEnum?._id || null
                matchParams.sStatusStr = statusEnum?.sValue || sStatusStr.toString()
              }

              if (sStatusNote) matchParams.sStatusNote = sStatusNote.replace(/&amp;/g, '&')
              if (sUmpires) matchParams.sUmpires = sUmpires
              if (sReferee) matchParams.sReferee = sReferee
              if (sEquation) matchParams.sEquation = sEquation
              if (sLiveMatchNote) matchParams.sLiveMatchNote = sLiveMatchNote
              if (sResult) matchParams.sResult = sResult
              if (sWinMargin) matchParams.sWinMargin = sWinMargin
              if (sWinningTeamKey) matchParams.iWinnerId = await getTeamIdFromKey(sWinningTeamKey.toString())

              const newMatch = await MatchesModel.findOneAndUpdate({ sMatchKey: matchParams.sMatchKey }, matchParams, { upsert: true, new: true })
                .populate([{ path: 'oTeamScoreA.oTeam', select: 'sTitle sAbbr' }, { path: 'oTeamScoreB.oTeam', select: 'sTitle sAbbr' }])

              if (!newMatch?.sShortTitle?.includes('TBA') || !newMatch?.sTitle?.includes('TBA')) {
                createPoll(newMatch, teamData1, teamData2)
              }

              if (newMatch?.oToss?.iWinnerTeamId) {
                const query = {
                  iMatchId: newMatch?._id,
                  nInningNumber: 0,
                  sEventId: '0',
                  eEvent: 'to',
                  sCommentary: newMatch?.oToss?.sText
                }

                const tossInfo = await CommentariesModel.findOne({ sEventId: '0', eEvent: 'to', iMatchId: ObjectId(match?._id) }).lean()
                if (!tossInfo) await CommentariesModel.updateOne({ iMatchId: ObjectId(newMatch?._id), sEventId: '0', eEvent: 'to' }, query, { upsert: true })
              }

              // add series teams, venues and matches
              // create seo from stream
              const sMatchInfo = enums?.eMatchFormat?.description[`${newMatch?.sFormatStr}`]
              const seoParams = {
                iId: newMatch._id.toString(),
                eType: 'ma',
                sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score | ${teamData1.sTitle} vs ${teamData2.sTitle} Score & Updates`,
                sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score: Get all the latest ${teamData1.sTitle} vs ${teamData2.sTitle} ${sMatchInfo} Live Score, ball by ball commentary & cricket updates on CricTracker.`
              }
              let formatStr = await MatchesModel.distinct('sFormatStr')

              formatStr.shift()

              formatStr = formatStr.map((ele) => ele?.toLowerCase()?.split(' ')?.join('-'))

              let type

              if (newMatch?.sSubtitle) {
                newMatch.sSubtitle = newMatch?.sSubtitle?.toLowerCase().split(' ').join('-')
                if (formatStr.some((ele) => newMatch?.sSubtitle.includes(ele))) type = newMatch?.sSubtitle
                else type = `${newMatch?.sSubtitle.toLowerCase().split(' ').join('-')}-${newMatch?.sFormatStr}`
              } else type = newMatch?.sFormatStr

              const date = new Date(newMatch.dStartDate).toDateString().toLocaleLowerCase().split(' ')

              seoParams.sSlug = `live-scores/${teamData1.sAbbr}-vs-${teamData2.sAbbr}-${type}-${seriesDetail.sTitle}-${date[2]}-${date[1]}-${date[3]}`
              // queuePush('addSeoData', seoParams)
              await axios.post(`${config.SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })

              // matchSeoBuilder(newMatch, teamData1, teamData2, sMatchInfo, seriesDetail, queuePush)
              addSeriesData(newMatch)
            }

            if (match) {
              // check if match seo exist or not
              if (match?.oToss?.iWinnerTeamId) {
                const query = {
                  iMatchId: match?._id,
                  nInningNumber: 0,
                  sEventId: '0',
                  eEvent: 'to',
                  sCommentary: match?.oToss?.sText
                }

                const tossInfo = await CommentariesModel.findOne({ sEventId: '0', eEvent: 'to', iMatchId: ObjectId(match?._id) }).lean()

                if (!tossInfo) await CommentariesModel.updateOne({ iMatchId: ObjectId(match?._id), sEventId: '0', eEvent: 'to' }, query, { upsert: true })
              }

              const sMatchInfo = enums?.eMatchFormat?.description[`${match?.sFormatStr}`]
              const seoParams = {
                iId: match._id.toString(),
                eType: 'ma',
                sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score | ${teamData1.sTitle} vs ${teamData2.sTitle} Score & Updates`,
                sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Live Score: Get all the latest ${teamData1.sTitle} vs ${teamData2.sTitle} ${sMatchInfo} Live Score, ball by ball commentary & cricket updates on CricTracker.`,
                sServiceType: 'checkMatchSeo'
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

              seoParams.sSlug = `live-scores/${teamData1.sAbbr}-vs-${teamData2.sAbbr}-${type}-${seriesDetail?.sTitle}-${date[2]}-${date[1]}-${date[3]}`
              // queuePush('addSeoData', seoParams)
              await grpcControllers.addSeoData(seoParams)
              // matchSeoBuilder(m, teamData1, teamData2, sMatchInfo, seriesDetail, queuePush)
            }
          }
          // add series wise matches
          if (bFetchSeriesMatch) {
            aSeriesKey = [...new Set(aSeriesKey)]
            fetchSeriesMatches(aSeriesKey)
          }
        }
      }
    }
    if (aMatches) {
      aData = aMatches
      await processMatch(aData, sETag)
    } else {
      const resData = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}matches?date=${dStart}_${dEnd}&paged=1&per_page=100&token=${process.env.ENTITY_SPORT_TOKEN}`)
      aData = resData?.data?.response?.items
      sETag = resData?.data?.etag
      // check if there is more data or not
      if (resData?.data?.response?.total_pages !== 1) {
        for (let i = 2; i <= resData?.data?.response?.total_pages; i++) {
          const aRemainingData = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}matches?date=${dStart}_${dEnd}&paged=${i}&per_page=100&token=${process.env.ENTITY_SPORT_TOKEN}`)
          if (aRemainingData?.data?.response?.items.length) aData.push(...aRemainingData?.data?.response?.items)
        }
      }
    }
    await processMatch(aData, sETag)
  } catch (error) {
    return error
  }
}

const getIdBySlug = async (sSlug, context) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const seoResponse = await axios({
          url: process.env.SEO_SUBGRAPH_URL,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            language: 'english',
            authorization: context?.headers?.authorization
          },
          data: {
            query: `
            query GetCategoryIdBySlug($input: oSlugInput) {
                getCategoryIdBySlug(input: $input) {
                  iId
                }
              }
              `,
            variables: {
              input: {
                sSlug
              }
            }
          }
        })

        const data = seoResponse.data?.data?.getCategoryIdBySlug
        if (!data) resolve({ error: seoResponse.data?.errors, isError: true })
        resolve({ data, isError: false })
      } catch (error) {
        resolve({ error, isError: true })
      }
    })()
  })
}

async function updateSeriesData(iSeriesId, eType, id) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let updateQuery
        if (eType === 't') {
          updateQuery = { $addToSet: { aTeams: id } }
        } else if (eType === 'v') {
          updateQuery = { $addToSet: { aVenues: id } }
        } else {
          updateQuery = { $addToSet: { aMatches: id } }
        }
        await SeriesDataModel.findOneAndUpdate({ iSeriesId }, updateQuery, { upsert: true })

        resolve()
      } catch (error) {
        resolve()
      }
    })()
  })
}

const addSeriesData = async (matchData) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { iSeriesId, _id, iVenueId, oTeamScoreA, oTeamScoreB } = matchData

        const isSeriesExists = await SeriesDataModel.findOne({ iSeriesId }).lean()

        if (!isSeriesExists) {
          await SeriesDataModel.create({ iSeriesId, aMatches: [_id], aVenues: [iVenueId], aTeams: [oTeamScoreA?.iTeamId, oTeamScoreB?.iTeamId] })
        } else {
          await updateSeriesData(iSeriesId, 'm', _id)
          if (iVenueId) {
            await updateSeriesData(iSeriesId, 'v', iVenueId)
          }

          const isTBA = await getTeamIdFromKey('111066', 'details')

          if (oTeamScoreA?.iTeamId && isTBA?._id?.toString() !== oTeamScoreA?.iTeamId?.toString()) {
            await updateSeriesData(iSeriesId, 't', oTeamScoreA?.iTeamId)
          }
          if (oTeamScoreB?.iTeamId && isTBA?._id?.toString() !== oTeamScoreB?.iTeamId?.toString()) {
            await updateSeriesData(iSeriesId, 't', oTeamScoreB?.iTeamId)
          }
        }
        resolve()
      } catch (error) {
        resolve()
      }
    })()
  })
}

const fetchEntityStandings = async (sSeriesKey, iSeriesId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sSeriesKey}/standings/?token=${process.env.ENTITY_SPORT_TOKEN}`)
        const resData = response?.data
        if (resData?.status === 'error') {
          resolve()
        } else {
          const dataResponse = resData?.response
          const standings = dataResponse?.standings
          let standingsType = dataResponse?.standing_type
          if (standingsType) standingsType = standingsType.split('_').join('')
          if (standings.length && (standingsType === 'perround')) {
            for (const standing of standings) {
              const rounds = standing?.round
              const stand = standing?.standings
              const { rid: sKey, order, name, type, datestart, dateend, match_format: sMatchFormat } = rounds
              let iRoundId
              const isRoundExist = await SeriesRoundsModel.findOne({ iSeriesId: ObjectId(iSeriesId), sKey }).lean()
              if (!isRoundExist) {
                const result = await SeriesRoundsModel.create({ iSeriesId: ObjectId(iSeriesId), sKey, nOrder: order, sName: name, sType: type, dStartDate: moment.utc(datestart, 'YYYY-MM-DD hh:mm:ss').toDate(), dEndDate: moment.utc(dateend, 'YYYY-MM-DD hh:mm:ss').toDate(), sMatchFormat, eProvider: 'es', eType: standingsType })
                iRoundId = result._id
              } else iRoundId = isRoundExist._id
              await updateStandings(stand, iSeriesId, iRoundId)
            }
          } else if (standings?.length && (standingsType === 'complete')) {
            await updateStandings(standings, iSeriesId, null)
          }
        }
        await cachegoose.clearCache(`series_standings:${iSeriesId}`)
        resolve()
      } catch (error) {
        resolve()
      }
    })()
  })
}

const updateStandings = async (stand, iSeriesId, iRoundId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (stand?.length) {
          let nPriority = 1
          for (const standing of stand) {
            const { team_id: teamId, played, win, draw, loss, nr, overfor, runfor, overagainst, runagainst, netrr, points, team } = standing
            const iTeamId = await getTeamIdFromKey(teamId.toString(), null, team)

            const updateParams = { iSeriesId: ObjectId(iSeriesId), iRoundId, iTeamId, nPlayed: played, nWin: win, nDraw: draw, nLoss: loss, nNR: nr, nOverFor: overfor, nRunFor: runfor, nOverAgainst: overagainst, nRunAgainst: runagainst, nNetrr: netrr, nPoints: points, nPriority, eProvider: 'es' }

            const query = { iTeamId, iSeriesId: ObjectId(iSeriesId) }
            if (iRoundId) Object.assign(query, { iRoundId })
            await SeriesStandingsModel.updateOne(query, updateParams, { upsert: true })
          }
          if (iSeriesId.toString() === '63f052b9d5e097df610db62d') {
            axios({
              method: 'POST',
              url: `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUD_FLARE_ZONE_ID}/purge_cache`,
              headers: {
                'X-Auth-Email': process.env.CLOUD_FLARE_AUTH_EMAIL,
                'X-Auth-Key': process.env.CLOUD_FLARE_AUTH_KEY,
                'Content-Type': 'application/json'
              },
              data: {
                files: [{ url: 'https://www.crictracker.com/ipl-points-table/' }]
              }
            })
              .then(response => {
                console.log(response.data)
              })
              .catch(error => {
                console.error(error)
              })
            const aKey = await redisclient.keys(`cacheman:cachegoose-cache:series_standings:${iSeriesId.toString()}:*`)
            if (aKey?.length) for (const sKey of aKey) await redisclient.del(sKey)
            nPriority++
          }
          nPriority++
        }
        if (iSeriesId.toString() === '63f052b9d5e097df610db62d') {
          axios({
            method: 'POST',
            url: `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUD_FLARE_ZONE_ID}/purge_cache`,
            headers: {
              'X-Auth-Email': `${process.env.CLOUD_FLARE_AUTH_EMAIL}`,
              'X-Auth-Key': `${process.env.CLOUD_FLARE_AUTH_KEY}`,
              'Content-Type': 'application/json'
            },
            data: {
              files: [{ url: 'https://www.crictracker.com/ipl-points-table/' }]
            }
          })
            .then(response => {
              console.log(response.data)
            })
            .catch(error => {
              console.error(error)
            })
          const aKey = await redisclient.keys(`cacheman:cachegoose-cache:series_standings:${iSeriesId.toString()}:*`)
          if (aKey.length) for (const sKey of aKey) await redisclient.del(sKey)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

const fetchEntityStatsTypes = async (sSeriesKey, _id) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const isExist = await SeriesStatsTypesModel.findOne({ iSeriesId: _id }).lean()
        if (!isExist) {
          const response = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sSeriesKey}/stats/?token=${process.env.ENTITY_SPORT_TOKEN}`)
          const resData = response?.data
          if (typeof resData?.response === 'string') {
            await SeriesModel.findByIdAndUpdate(_id, { bIsStatsAvailable: false, bIsStatsProcessed: true }).lean()
          } else {
            const dataResponse = resData?.response
            const statsTypes = dataResponse?.stat_types
            if (resData && dataResponse && statsTypes.length) {
              const typesData = []
              statsTypes.forEach(async ({ group_title, types }) => {
                let eGroupTitle
                if (group_title === 'Bowling') { eGroupTitle = 'Bwl' } else if (group_title === 'Batting') { eGroupTitle = 'Bat' } else { eGroupTitle = group_title }
                for (const type in types) {
                  typesData.push({ iSeriesId: _id, sType: type, sDescription: types[type], eGroupTitle, eProvider: 'es' })
                }
              })
              if (typesData.length) await SeriesStatsTypesModel.insertMany(typesData)
              await SeriesModel.findByIdAndUpdate(_id, { bIsStatsProcessed: true }).lean()
            }
          }
        }
        resolve()
      } catch (error) {
        if (typeof error?.response?.data.response === 'string') {
          resolve(null)
        }
        resolve(null)
      }
    })()
  })
}

const fetchEntitySeriesStats = async (sSeriesKey, _id, sType, iSeriesId, eTitle, eFormat) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}/competitions/${sSeriesKey}/stats/${sType}?format=${eFormat}&per_page=300&paged=1&token=${process.env.ENTITY_SPORT_TOKEN}`)
        const resData = response?.data
        const dataResponse = resData?.response
        if (typeof dataResponse !== 'string') {
          const stats = dataResponse?.stats
          let nPriority = 1
          const updateQueries = []
          for (const stat of stats) {
            const {
              team,
              player,
              matches,
              innings,
              notout,
              runs,
              balls,
              highest,
              run100,
              run50,
              run4,
              run6,
              average,
              strike,
              catches,
              stumpings,
              overs,
              wickets,
              bestinning,
              bestmatch,
              econ,
              wicket4i,
              wicket5i,
              maidens,
              wicket10m,
              runsconceded,
              updated
            } = stat

            const data = {
              iSeriesId: ObjectId(iSeriesId),
              iSeriesStatsId: ObjectId(_id),
              nPriority,
              eProvider: 'es',
              nAverage: average,
              nRuns: runs,
              nInnings: innings,
              sStrike: strike,
              nRun4: run4,
              nRun6: run6,
              nMatches: matches,
              nNotout: notout,
              nBalls: balls,
              nHighest: highest,
              nRun100: run100,
              nRun50: run50,
              nCatches: catches,
              nStumpings: stumpings,
              nOvers: overs,
              nWickets: wickets,
              sBestInning: bestinning,
              sBestMatch: bestmatch,
              nEcon: econ,
              nWicket4i: wicket4i,
              nWicket5i: wicket5i,
              nMaidens: maidens,
              nWicket10m: wicket10m,
              nRunsConceded: runsconceded,
              dModified: moment(updated).format(),
              eFormat
            }

            if (player) data.iPlayerId = await getPlayerIdFromKey(player?.pid?.toString())

            if (data.sBestInning) {
              const innings = bestinning.split('/')
              data.nInningNumerator = innings && innings.length ? Number(innings[0]) : 0
              data.nInningDenominator = innings && innings.length ? Number(innings[1]) : 0
            }
            const iTeamId = await getTeamIdFromKey(team?.tid?.toString(), null, team)
            data.iTeamId = iTeamId
            updateQueries.push({
              updateOne: {
                filter: { iSeriesId: ObjectId(iSeriesId), iSeriesStatsId: ObjectId(_id), eFormat, nPriority },
                update: { $set: { ...data } },
                upsert: true
              }
            })

            nPriority++
          }

          // Should update in bulk
          await SeriesStatsModel.bulkWrite(updateQueries)
          await SeriesStatsModel.deleteMany({ iSeriesId: ObjectId(iSeriesId), iSeriesStatsId: ObjectId(_id), eFormat, nPriority: { $gte: nPriority } })
        }
        resolve()
      } catch (error) {
        resolve()
      }
    })()
  })
}

// const checkSeriesData = async () => {
//   try {
//     const series = await SeriesModel.find().limit().lean()
//     const seriesTypes = await SeriesStatsTypesModel.find().lean()
//     for await (const serie of series) {
//       console.log({ _id: serie._id })
//       for await (const type of seriesTypes) {
//         await fetchEntitySeriesStats(serie.sSeriesKey, type._id, type.sType, serie._id, type.eGroupTitle, serie.sGameFormat)
//       }
//     }
//   } catch (error) {
//     return error
//   }
// }

const addSeriesTeamData = async (sSeriesKey, sTeamKey) => {
  try {
    const iTeamId = await getTeamIdFromKey(sTeamKey)
    const iSeriesId = await getSeriesIdFromKey(sSeriesKey)
    if (iTeamId && iSeriesId) await SeriesDataModel.updateOne({ iSeriesId }, { $addToSet: { aTeams: iTeamId } }, { upsert: true })
  } catch (error) {
    return error
  }
}

const addSeriesTopPlayers = async (iSeriesId) => {
  try {
    for (const sp of eTopPlayerType.value) {
      const statParams = {}
      const queryStatTypes = {}
      const updateQuery = { iSeriesId }
      let sorting = {}

      if (sp === 'hwt') {
        queryStatTypes.sType = 'bowling_top_wicket_takers'
        statParams.eFullType = 'bowling_top_wicket_takers'
        sorting = { nWickets: -1 }
      }
      if (sp === 'hrs') {
        queryStatTypes.sType = 'batting_most_runs'
        statParams.eFullType = 'batting_most_runs'
        sorting = { nRuns: -1 }
      }
      if (sp === 'hs') {
        queryStatTypes.sType = 'batting_most_runs_innings'
        statParams.eFullType = 'batting_most_runs_innings'
        sorting = { nHighest: -1 }
      }
      if (sp === 'bbf') {
        queryStatTypes.sType = 'bowling_best_bowling_figures'
        statParams.eFullType = 'bowling_best_bowling_figures'
        sorting = { nInningNumerator: -1, nInningDenominator: 1 }
      }

      const statType = await SeriesStatsTypesModel.findOne(queryStatTypes).lean()

      const stats = await SeriesStatsModel.findOne({ iSeriesId, iSeriesStatsId: statType?._id }).sort(sorting).lean()

      if (stats) {
        Object.assign(statParams, {
          iSeriesId,
          iSeriesStatsId: stats?.iSeriesStatsId,
          iPlayerId: stats?.iPlayerId,
          iTeamId: stats?.iTeamId,
          eType: sp,
          iSeriesStatsTypeId: statType?._id
        })

        if (sp === 'hwt') {
          statParams.nWickets = stats.nWickets
          updateQuery.nWickets = { $exists: true }
        }
        if (sp === 'hs') {
          statParams.nHighest = stats?.nHighest
          updateQuery.nHighest = { $exists: true }
        }
        if (sp === 'hrs') {
          statParams.nRuns = stats?.nRuns
          updateQuery.nRuns = { $exists: true }
        }
        if (sp === 'bbf') {
          statParams.sBestInning = stats.sBestInning
          updateQuery.sBestInning = { $exists: true }
        }
        await SeriesTopPlayers.updateOne(updateQuery, statParams, { upsert: true })
      }
    }
  } catch (error) {
    return error
  }
}

const getSeriesStatsTypes = async (sKey, called) => {
  try {
    let aTypes = await SeriesStatsTypesModel.find({}).lean()
    let resObj
    const response = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sKey}/stats/?token=${process.env.ENTITY_SPORT_TOKEN}`)
    const resData = response?.data?.response
    if (typeof resData !== 'string' && resData) {
      if (aTypes?.length !== 26) {
        for (const el of resData?.stat_types) {
          let eGroupTitle
          if (el.group_title === 'Batting') eGroupTitle = 'Bat'
          if (el.group_title === 'Bowling') eGroupTitle = 'Bwl'
          if (el.group_title === 'Team') eGroupTitle = 'Team'

          for (const ty in el.types) {
            const params = {
              eGroupTitle,
              sType: ty,
              sDescription: el.types[ty],
              eProvider: 'es'
            }
            const exist = await SeriesStatsTypesModel.findOne(params).lean()
            if (!exist) await SeriesStatsTypesModel.create(params)
          }
        }
        aTypes = await SeriesStatsTypesModel.find({}).lean()
      }

      // add formats for stats
      let format
      const series = await SeriesModel.findOne({ sSeriesKey: sKey }).lean()

      if (!series?.aFormats?.length) {
        const response = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${series.sSeriesKey}/stats/?token=${process.env.ENTITY_SPORT_TOKEN}`)
        const resData = response?.data?.response

        if (typeof resData !== 'string') format = resData?.formats

        await SeriesModel.updateOne({ _id: series._id }, { aFormats: format })
      } else format = series.aFormats

      resObj = { aTypes, aFormats: format }
    }
    return resObj
  } catch (error) {
  }
}

const updateSeriesStatusFun = async (sSeriesKey) => {
  try {
    const res = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sSeriesKey}?token=${process.env.ENTITY_SPORT_TOKEN}`)

    const { data: { response } } = res
    if (response && typeof response !== 'string') {
      const {
        status: sStatus, total_matches: nTotalMatches, total_rounds: nTotalRounds,
        total_teams: nTotalTeams, table: nTable, title: sTitle
      } = response

      const updateParams = {
        nTotalMatches,
        nTotalRounds,
        nTotalTeams: sTitle.toLocaleLowerCase().includes('tour of') ? 2 : nTotalTeams,
        nTable,
        sStatus
      }

      await SeriesModel.updateOne({ sSeriesKey }, updateParams)
    }
  } catch (error) {
    return error
  }
}

const fetchSeriesMatches = async (aSeriesKey, bUpdate) => {
  try {
    // input aSeriesKey --> [String]
    if (aSeriesKey?.length) {
      for (const s of aSeriesKey) {
        const aCMatches = await fetchFullSeriesMatchesFun(s)
        await fetchMatchFromApi(null, null, aCMatches, false, bUpdate)
      }
    }
  } catch (error) {
    return error
  }
}

const updatePlayersGenderFun = async (iPlayerId = null) => {
  try {
    const query = { sSex: { $exists: false } }
    if (iPlayerId) query._id = iPlayerId

    const genderUpdate = []

    const aPlayer = await PlayersModel.find(query, { _id: 1 }).lean()

    const seriesSquad = await SeriesSquadModel.find({ iPlayerId: { $in: aPlayer.map((ele) => ObjectId(ele?._id)) } }, { iTeamId: 1, _id: 0 }).sort({ dCreated: -1 }).lean()
    if (seriesSquad.length) {
      const teams = await TeamsModel.find({ _id: { $in: seriesSquad.map((ele) => ele?.iTeamId) } }).lean()

      for (const player of aPlayer) {
        const seriesSquadInclude = seriesSquad.findIndex((ele) => ele.iTeamId.toString() === player.toString())
        if (seriesSquadInclude > -1) {
          const teamInclude = teams.findIndex((ele) => ele._id === seriesSquad[seriesSquadInclude])
          genderUpdate.push({
            updateOne: {
              filter: { _id: player },
              update: { sSex: teams[teamInclude]?.sSex || null },
              upsert: true
            }
          })
        }
      }
      PlayersModel.bulkWrite(genderUpdate)
    }
  } catch (error) {
    return error
  }
}

const fetchFullSeriesMatchesFun = async (sSeriesKey) => {
  try {
    const nPerPage = 100
    let nPaged = 1
    let bIsRemaining = true
    let nTotal = null
    const aMatches = []

    while (bIsRemaining) {
      const seriesRes = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}competitions/${sSeriesKey}/matches/?token=${process.env.ENTITY_SPORT_TOKEN}&per_page=${nPerPage}&&paged=${nPaged}`)

      if (typeof seriesRes?.data?.response !== 'string') {
        const { data: { response: { total_pages: nTotalPages, items } } } = seriesRes
        if (!nTotal) {
          nTotal = nTotalPages
        }
        if (items?.length) aMatches.push(...items)
        if ((nTotal !== nPaged) && nTotal) {
          ++nPaged
        } else {
          bIsRemaining = false
        }
      } else bIsRemaining = false
    }
    return aMatches
  } catch (error) {
    return error
  }
}

const pullStandings = async () => {
  try {
    const standings = await redisMatchDb.lpop('standings')
    if (!standings) return setTimeout(() => pullStandings(), 2000)

    const data = JSON.parse(standings)
    if (data) {
      fetchEntityStandings(data?.sSeriesKey, data?._id)
      // if (data?._id === '63f052b9d5e097df610db62d') {
      //   const aMostRunsData = await SeriesStatsModel.find({ iSeriesId: ObjectId('63f052b9d5e097df610db62d'), iSeriesStatsId: ObjectId('62302fc0358523ee1d264d15') })
      //     .populate([
      //       { path: 'oPlayer', select: 'sFullName sMiddleName sLastName sFirstName' },
      //       { path: 'oTeam', select: 'sAbbr' }
      //     ])
      //     .sort({ nRuns: -1 })
      //     .limit(10)
      //     .lean()

      //   redisclient.rpush('orangeCapData', JSON.stringify(aMostRunsData))

      //   const aMostWicketsData = await SeriesStatsModel.find({ iSeriesId: ObjectId('63f052b9d5e097df610db62d'), iSeriesStatsId: ObjectId('6230303b358523ee1d269831') })
      //     .populate([
      //       { path: 'oPlayer', select: 'sFullName sMiddleName sLastName sFirstName' },
      //       { path: 'oTeam', select: 'sAbbr' }
      //     ])
      //     .sort({ nWickets: -1 })
      //     .limit(10)
      //     .lean()

      //   redisclient.rpush('purpleCapData', JSON.stringify(aMostWicketsData))
      // }
    }
    return pullStandings()
  } catch (error) {
    return pullStandings()
  }
}

const pullPlayerStats = async () => {
  try {
    const playerStats = await redisMatchDb.lpop('playerStats')
    if (!playerStats) return setTimeout(() => pullPlayerStats(), 2000)
    const data = JSON.parse(playerStats)
    fetchEntityPlayerStats(data)
  } catch (error) {
    console.log('eer', error)
    return pullPlayerStats()
  }
}

const fetchEntityPlayerStats = async (data) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await MatchesModel.findById(data._id).lean()

        const aTeamAplaying11 = await MatchSquadModel.find({ bPlaying11: true, iTeamId: response?.oTeamScoreA?.iTeamId }, { iPlayerId: 1 }).populate({ path: 'oPlayer' }).lean()
        const aTeamBplaying11 = await MatchSquadModel.find({ bPlaying11: true, iTeamId: response?.oTeamScoreB?.iTeamId }, { iPlayerId: 1 }).populate({ path: 'oPlayer' }).lean()
        if (aTeamAplaying11?.length) updatePlayerStats(aTeamAplaying11)
        if (aTeamBplaying11?.length) updatePlayerStats(aTeamBplaying11)
      } catch (error) {
        resolve()
      }
    })()
  })
}

const updatePlayerStats = async (aTeamPlaying11) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        for (const oTeamPlayer of aTeamPlaying11) {
          const response = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}players/${oTeamPlayer?.oPlayer?.sPlayerKey}/stats?token=${process.env.ENTITY_SPORT_TOKEN}`)
          const resData = response?.data
          if (resData?.status === 'error') {
            resolve()
          } else {
            const oBattingStats = resData?.response?.batting
            const oBowlingStats = resData?.response?.bowling
            const aBattingMatchStats = Object.keys(oBattingStats)
            const aBowlingMatchStats = Object.keys(oBowlingStats)
            const updateQueries = []
            let nTotalBattingAverage = 0; let nTotalBattingStrikeRate = 0; let nTotalBowlingEconomy = 0; let nTotalBowlingAverage = 0; let nTotalBowlingStrikeRate = 0; let nBattingCount = 0; let nBowlingCount = 0
            for (const sStats of aBattingMatchStats) {
              const oStats = oBattingStats[`${sStats}`]
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

              updateQueries.push({
                updateOne: {
                  filter: { iPlayerId: _.mongify(oTeamPlayer?.oPlayer?._id), sPlayerKey: oTeamPlayer?.oPlayer?.sPlayerKey, sMatchStatsTypes: sStats },
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

              updateQueries.push({
                updateOne: {
                  filter: { iPlayerId: _.mongify(oTeamPlayer?.oPlayer?._id), sPlayerKey: oTeamPlayer?.oPlayer?.sPlayerKey, sMatchStatsTypes: sStats },
                  update: { $set: { oBowling } },
                  upsert: true
                }
              })
            }
            const nBattingPerformancePoint = +((nTotalBattingAverage + nTotalBattingStrikeRate) / nBattingCount).toFixed(2) || 0
            const nBowlingPerformancePoint = +((nTotalBowlingEconomy + nTotalBowlingStrikeRate + nTotalBowlingAverage) / nBowlingCount).toFixed(2) || 0

            await PlayersModel.findByIdAndUpdate(oTeamPlayer?.oPlayer?._id, { nBattingPerformancePoint, nBowlingPerformancePoint })
            await PlayerStatsModel.bulkWrite(updateQueries)
          }
        }
      } catch (error) {
        resolve()
      }
    })()
  })
}

const pullStats = async () => {
  try {
    const stats = await redisMatchDb.lpop('stats')

    if (!stats) return setTimeout(() => pullStats(), 2000)

    const data = JSON.parse(stats)
    if (data) {
      await fetchEntitySeriesStats(data?.sSeriesKey, data?.iStatsTypeId, data?.sStatsType, data?.iSeriesId, data?.eGroupTitle, data?.eFormat)

      await addSeriesTopPlayers(data?.iSeriesId)

      if (data?.iSeriesId === '63f052b9d5e097df610db62d') {
        axios({
          method: 'POST',
          url: `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUD_FLARE_ZONE_ID}/purge_cache`,
          headers: {
            'X-Auth-Email': process.env.CLOUD_FLARE_AUTH_EMAIL,
            'X-Auth-Key': process.env.CLOUD_FLARE_AUTH_KEY,
            'Content-Type': 'application/json'
          },
          data: {
            files: [{ url: 'https://www.crictracker.com/ipl-purple-cap/' }, { url: 'https://www.crictracker.com/ipl-orange-cap/' }]
          }
        })
          .then(response => {
            console.log(response.data)
          })
          .catch(error => {
            console.error(error)
          })
      }
    }
    pullStats()
  } catch (error) {
    pullStats()
  }
}

// for adding stats to scheduler
const pullStatsTypes = async () => {
  try {
    const stats = await redisMatchDb.lpop('statTypes')

    if (!stats) return setTimeout(() => pullStatsTypes(), 2000)

    const data = JSON.parse(stats)

    if (data) {
      const oSeriesTypes = await getSeriesStatsTypes(data?.sSeriesKey)
      const series = await SeriesModel.findOne({ sSeriesKey: data?.sSeriesKey }).lean()

      for (const f of oSeriesTypes?.aFormats) {
        if (oSeriesTypes?.aTypes?.length) {
          for (const st of oSeriesTypes.aTypes) {
            scheduleMatchTask({ eType: 'stats', data: { sSeriesKey: series.sSeriesKey, iStatsTypeId: st._id, sStatsType: st.sType, iSeriesId: series._id, eGroupTitle: st.eGroupTitle, eFormat: f } }, moment().unix())
          }
        }
      }
    }
    pullStatsTypes()
  } catch (error) {
    pullStatsTypes()
  }
}

setTimeout(() => {
  pullStandings()
  pullStats()
  pullStatsTypes()
  pullPlayerStats()
  // checkSeriesData()
}, 2000)

module.exports = {
  fetchPlayersByCountry,
  getEnumFromKey,
  getTeamIdFromKey,
  updateTeam,
  getVenueIdFromVenueObj,
  getPlayerIdFromKey,
  getMatchIdFromKey,
  fetchMatchFromApi,
  getCountryFullName,
  getSeriesIdFromKey,
  fetchMatchSquadFun,
  fetchSeriesSquadFun,
  getIdBySlug,
  addSeriesData,
  fetchEntityStandings,
  fetchEntityStatsTypes,
  fetchEntitySeriesStats,
  addSeriesTeamData,
  addSeriesTopPlayers,
  getSeriesStatsTypes,
  updateSeriesStatusFun,
  fetchSeriesMatches,
  updatePlayersGenderFun,
  fetchFullSeriesMatchesFun,
  updatePlayerStats,
  createPoll
}
