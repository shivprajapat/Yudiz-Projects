const axios = require('axios')
const moment = require('moment')
const { players: PlayersModel, matches: MatchesModel, enums: EnumsModel, venues: VenuesModel, teams: TeamsModel, series: SeriesModel, seo: SeoModel, roles: RoleModel, articles: ArticlesModel, fantasyarticles: FantasyArticlesModel, seoredirects: SeoRedirectModel, categories: CategoryModel } = require('./models')
const { ePlatformType } = require('./enums')
const enums = require('./enums')
const { queuePush } = require('../app/utils')
const _ = require('../global')

const getPlayerIdFromKey = (sPlayerKey, playerData) => {
  console.log({ getPlayerIdFromKey: { sPlayerKey, playerData } })
  return new Promise((resolve, reject) => {
    PlayersModel.findOne({ sPlayerKey }).lean().then(async (player) => {
      if (player) {
        resolve(player._id)
      } else {
        const {
          pid: sPlayerKey, short_name: sShortName, first_name: sFirstName, last_name: sLastName, middle_name: sMiddleName, title: sFullName, birthdate: dBirthDate, birthplace: sBirthPlace, country: sCountry, thumb_url: sThumbUrl, logo_url: sLogoUrl, playing_role: sPlayingRole, batting_style: sBattingStyle, bowling_style: sBowlingStyle, fielding_position: sFieldingPosition, recent_match: sRecentMatchKey, recent_appearance: nRecentAppearance, fantasy_player_rating: nFantasyPlayerRating
        } = playerData

        const playerObj = {
          sPlayerKey,
          sShortName,
          sFirstName,
          sLastName,
          sMiddleName,
          sFullName,
          sBirthPlace,
          sCountry,
          sThumbUrl,
          sLogoUrl,
          sPlayingRole,
          sBattingStyle,
          sBowlingStyle,
          sFieldingPosition
        }
        if (sRecentMatchKey !== 0) {
          playerObj.iRecentMatchId = await getMatchIdFromKey(sRecentMatchKey)
          playerObj.nRecentAppearance = nRecentAppearance
        }

        if (dBirthDate !== '0000-00-00') playerObj.dBirthDate = dBirthDate
        playerObj.aFantasyPlayerRating = []
        ePlatformType.value.forEach(e => {
          playerObj.aFantasyPlayerRating.push({
            ePlatformType: e,
            nRating: nFantasyPlayerRating
          })
        })

        const newPlayer = await PlayersModel.create(playerObj)
        const seoParams = {}
        seoParams.iId = newPlayer._id
        const playerSlug = newPlayer.sFullName.toLocaleLowerCase().replace(' ', '-')
        seoParams.sSlug = `${process.env.CRICTRACKER_BASE_URL}/cricket-players/${playerSlug}`
        await SeoModel.create(seoParams)
        resolve(newPlayer._id)
      }
    }).catch((error) => {
      console.log({ error })
      reject(error)
    })
  })
}

const getVenueIdFromVenueObj = (oVenue = {}) => {
  return new Promise((resolve, reject) => {
    VenuesModel.findOne({ sVenueKey: oVenue.venue_id }).lean().then(async (venue) => {
      if (!venue) {
        const { venue_id: sVenueKey, name: sName, location: sLocation, timezone: sTimezone } = oVenue
        venue = await VenuesModel.create({ sVenueKey, sName, sLocation, sTimezone })
      }
      resolve(venue._id)
    }).catch(error => {
      console.log({ error })
      reject(error)
    })
  })
}

const getTeamIdFromKey = (sTeamKey) => {
  return new Promise((resolve, reject) => {
    TeamsModel.findOne({ sTeamKey }).lean().then((team) => {
      if (team) {
        resolve(team._id)
      } else {
        axios.get(`https://rest.entitysport.com/v2/teams/${sTeamKey}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then(async (res) => {
          const { tid: sTeamKey1, title: sTitle, abbr: sAbbr, thumb_url: sThumbUrl, logo_url: sLogoUrl, type: sTeamType, country: sCountry, alt_name: sAltName, sex: sSex } = res.data.response

          const newTeam = await TeamsModel.create({ sTeamKey1, sTitle, sAbbr, sThumbUrl, sLogoUrl, sTeamType, sCountry, sAltName, sSex })
          resolve(newTeam._id)
        }).catch((error) => {
          console.log({ error, sTeamKey })
          reject(error)
        })
      }
    }).catch((error) => {
      console.log({ error })
      reject(error)
    })
  })
}

const getMatchIdFromKey = (sMatchKey) => {
  return new Promise((resolve, reject) => {
    MatchesModel.findOne({ sMatchKey }).lean().then((match) => {
      console.log({ sMatchKey, match })
      if (match) {
        resolve(match._id)
      } else {
        axios.get(`https://rest.entitysport.com/v2/matches/${sMatchKey}/info`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then(async (matchRes) => {
          console.log({ matchRes: matchRes.data.response })

          const { competition: oCompetition, match_id: sMatchKey, title: sTitle, subtitle: sSubtitle, format_str: sFormatStr, status_note: sStatusNote, status: iStatusId, game_state: iLiveGameStatusId, teama: oTeamScoreA, teamb: oTeamScoreB, verified: bVerified, pre_squad: bPreSquad, domestic: bIsDomestic, date_start: dStartDate, date_end: dEndDate, timestamp_start: dStartTimestamp, timestamp_end: dEndTimestamp, venue: oVenue, equation: sEquation, umpires: sUmpires, referee: sReferee, win_margin: sWinMargin, commentary: bIsCommentary, latest_inning_number: nLatestInningNumber, toss: oToss, live: sLiveMatchNote, result: sResult, wagon: bIsWagon, etag: sETag, format: nFormatKey, winning_team_id: sWinnerKey } = matchRes.data.response

          const obj = {
            iSeriesId: await getSeriesIdFromKey(oCompetition.cid),
            sSeriesKey: oCompetition.cid,
            sMatchKey,
            sTitle,
            sSubtitle,
            sFormatStr,
            sStatusNote,
            bVerified,
            bPreSquad,
            bIsDomestic,
            dStartDate: moment.utc(dStartDate),
            dEndDate: moment.utc(dEndDate),
            dStartTimestamp,
            dEndTimestamp,
            iVenueId: await getVenueIdFromVenueObj(oVenue),
            sEquation,
            sUmpires,
            sReferee,
            sWinMargin,
            iWinnerId: await getTeamIdFromKey(sWinnerKey),
            bIsCommentary,
            nLatestInningNumber,
            oToss,
            sLiveMatchNote,
            sResult,
            bIsWagon,
            eProvider: 'es',
            sETag
          }

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

          if (oTeamScoreA.team_id) {
            obj.oTeamScoreA = {
              iTeamId: await getTeamIdFromKey(oTeamScoreA.team_id),
              sScoresFull: oTeamScoreA.scores_full,
              sScores: oTeamScoreA.scores,
              sOvers: oTeamScoreA.overs
            }
          }
          if (oTeamScoreB.team_id) {
            obj.oTeamScoreB = {
              iTeamId: await getTeamIdFromKey(oTeamScoreB.team_id),
              sScoresFull: oTeamScoreB.scores_full,
              sScores: oTeamScoreB.scores,
              sOvers: oTeamScoreB.overs
            }
          }

          obj.sETag = matchRes.data.etag
          const iFormatId = await EnumsModel.findOne({ sKey: nFormatKey.toString(), eType: 'mfc' }, { _id: 1 }).lean()
          console.log({ nFormatKey, iFormatId })
          obj.iFormatId = iFormatId._id

          const newMatch = await MatchesModel.create(obj)

          resolve(newMatch._id)
        }).catch(error => {
          console.log({ error })
          reject(error)
        })
      }
    }).catch((error) => {
      console.log({ error })
      reject(error)
    })
  })
}

const getSeriesIdFromKey = (sSeriesKey) => {
  return new Promise((resolve, reject) => {
    SeriesModel.findOne({ sSeriesKey }).lean().then((series) => {
      if (series) {
        resolve(series._id)
      } else {
        axios.get(`https://rest.entitysport.com/v2/competitions/${sSeriesKey}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then(async (res) => {
          console.log('2', res.data, sSeriesKey)
          const {
            title: sTitle, abbr: sAbbr, type: sSeriesType, category: sCategory, game_format: sGameFormat, status: sStatus, season: sSeason, datestart: dStartDate, dateend: dEndDate, total_matches: nTotalMatches, total_rounds: nTotalRounds,
            total_teams: nTotalTeams, squad_type: sSquadType, country: sCountry, table: nTable, rounds = null
          } = res.data.response

          const obj = {
            sSeriesKey,
            sTitle,
            sAbbr,
            sSeason,
            dStartDate: moment(dStartDate).format(),
            dEndDate: moment(dEndDate).format(),
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
          if (rounds) {
            obj.aRound = rounds.map(r => {
              const { rid: sRoundKey, order: nOrder, name: sName, match_format: sMatchFormat, datestart: dStartDate, dateend: dEndDate, type: sRoundType, matches_url: sMatchesUrl, teams_url: sTeamsUrl } = r

              return {
                sRoundKey: sRoundKey.toString(),
                nOrder,
                sName,
                sMatchFormat,
                dStartDate: moment.utc(dStartDate).format(),
                dEndDate: moment.utc(dEndDate).format(),
                sRoundType,
                sMatchesUrl,
                sTeamsUrl
              }
            })
          }

          const newSeries = await SeriesModel.create(obj)
          resolve(newSeries._id)
        }).catch((error) => {
          console.log({ error })
          reject(error)
        })
      }
    }).catch((error) => {
      console.log({ error })
      reject(error)
    })
  })
}

const getAuthorRole = async (roleName) => {
  try {
    const response = { success: false, data: '' }
    let oRole = {}
    RoleModel.findOne({ sName: { $regex: roleName, $options: 'i' } }).lean().then(async (role) => {
      if (role) {
        const aPermissions = []
        role.aPermissions.forEach(e => {
          aPermissions.push({
            aRoles: [role._id],
            iPermissionId: e
          })
        })
        oRole = { aRoleId: role._id, aPermissions }
        response.data = oRole
      }
    })
    return response
  } catch (error) {
    return error
  }
}

const getAuthorArticle = async (author) => {
  try {
    const query = { eState: 'pub', eVisibility: 'pb', iAuthorDId: _.mongify(author._id) }
    const [response] = await ArticlesModel.aggregate([
      { $match: query },
      { $group: { _id: null, totalArticle: { $sum: 1 }, totalViewCount: { $sum: '$nViewCount' } } },
      { $project: { _id: 0 } }
    ])
    console.log({ response })
    return response
  } catch (error) {
    console.log({ error })
    return error
  }
}

const getAuthorFantasyArticle = async (author) => {
  try {
    const query = { eStatus: 'a', eState: 'pub', eVisibility: 'pb', iAuthorDId: _.mongify(author._id) }
    const [response] = await FantasyArticlesModel.aggregate([
      { $match: query },
      { $group: { _id: null, totalArticle: { $sum: 1 }, totalViewCount: { $sum: '$viewCount' } } },
      { $project: { _id: 0 } }
    ])
    return response
  } catch (error) {
    console.log({ error })
    return error
  }
}

const updateSeries = async (req, res) => {
  try {
    const allSeries = await SeriesModel.find({ _id: '622dcc3609a36f4f3cc35d8c' }).lean()
    for await (const series of allSeries) {
      const seoParams = {
        iId: _.mongify(series._id),
        eType: 'se'
      }

      const category = await CategoryModel.findOne({ _id: series?.iCategoryId }).lean()

      const newSlug = series.sTitle.toString().toLowerCase().split(' ')

      if (!isNaN(newSlug[newSlug.length - 1])) {
        newSlug.pop()
      }

      seriesSeoBuilder(seoParams, series)
      if (series?.iCategoryId) categorySeoBuilder(series, { ...category, ...{ sSrtTitle: series?.sSrtTitle } })
    }
    res.send({ message: 'done' })
  } catch (error) {
    console.log(error)
    return error
  }
}

const updateRedirection = async (req, res) => {
  try {
    const allSeries = await SeriesModel.find({ iCategoryId: { $ne: null }, _id: '622dcc3609a36f4f3cc35d8c' }).lean()

    for await (const series of allSeries) {
      const category = await SeoModel.findOne({ iId: _.mongify(series?.iCategoryId), eSubType: null, eType: { $ne: 'cu' } })
      console.log({ category: category?.iId, series: series?._id })
      const seriesSeo = await SeoModel.findOne({ iId: _.mongify(series?._id), eSubType: null, eType: { $ne: 'cu' } })
      const seos = await SeoModel.find({ iId: _.mongify(series._id), eSubType: { $ne: null }, eType: { $ne: 'cu' } })

      const seo = await SeoModel.findOne({ iId: _.mongify(series._id), eSubType: null, eType: { $ne: 'cu' } })
      if (seriesSeo?.sSlug) {
        for await (const seo of seos) {
          const body = {
            iId: _.mongify(series?.iCategoryId),
            sOldUrl: seo.sSlug,
            sNewUrl: `${category.sSlug}/${seo?.sSlug?.replaceAll(`${seriesSeo.sSlug}/`, '')}`,
            eCode: 308,
            eSeoType: 'se',
            eSubType: seo.eSubType
          }

          await SeoRedirectModel.updateOne({ iId: _.mongify(series?.iCategoryId), eSubType: seo.eSubType }, body, { upsert: true })
          await SeoModel.updateOne({ iId: _.mongify(series._id), sSlug: seo.sSlug }, { eStatus: 'd' }, { upsert: true })
        }
      } else console.log({ seriesSeo })

      if (seo?.sSlug) {
        const body = {
          iId: _.mongify(series?.iCategoryId),
          sOldUrl: seo?.sSlug,
          sNewUrl: category?.sSlug,
          eCode: 307,
          eSeoType: 'se'
        }

        await SeoRedirectModel.updateOne({ iId: _.mongify(series?.iCategoryId), eSubType: null }, body, { upsert: true })
        await SeoModel.updateOne({ iId: _.mongify(series._id), sSlug: seo.sSlug }, { eStatus: 'd' }, { upsert: true })
      }
    }
    res.send({ message: 'done' })
  } catch (error) {
    console.log(error)
  }
}

const updateMatchesSeo = async (req, res) => {
  try {
    const allMatches = await MatchesModel.find({ iSeriesId: _.mongify('622c94e6dfe0f98ed5f8a314') }).lean()
    for await (const match of allMatches) {
      const teamData1 = await TeamsModel.findOne({ _id: match?.oTeamScoreA?.iTeamId }).lean()
      const teamData2 = await TeamsModel.findOne({ _id: match?.oTeamScoreB?.iTeamId }).lean()
      const sMatchInfo = enums?.eMatchFormat?.description[`${match?.sFormatStr}`]
      const seriesDetail = await SeriesModel.findOne({ sSeriesKey: match.sSeriesKey })

      let formatStr = await MatchesModel.distinct('sFormatStr')

      formatStr.shift()

      formatStr = formatStr.map((ele) => ele?.toLowerCase()?.split(' ')?.join('-'))

      matchSeoBuilder(match, teamData1, teamData2, sMatchInfo, seriesDetail)
    }
    res.send('Done')
  } catch (error) {
    console.log(error)
  }
}

const matchesWithoutSlug = async (req, res) => {
  try {
    const arr = []
    const matchesWithoutSlug = await MatchesModel.find().limit(1000).sort({ dCreated: -1 }).lean()
    for (const matches of matchesWithoutSlug) {
      const seo = await SeoModel.findOne({ iId: _.mongify(matches._id) }).lean()
      console.log(!!seo)
      if (!seo) arr.push(matches._id)
    }
    console.log(arr)
    res.send('done')
  } catch (error) {
    console.log(error)
  }
}

const seriesSeos = [
  'n',
  'v',
  'f',
  's',
  'st',
  't',
  'sq',
  'ar',
  'ft',
  'sc',
  'o',
  'far',
  'r',
  'c',
  'u',
  'p',
  'stBhsi',
  'stBha',
  'stBhs',
  'stBmc',
  'stBmr6i',
  'stBm4',
  'stBmr4i',
  'stBmr',
  'stBmri',
  'stBmr50',
  'stBms',
  'stBtwt',
  'stBberi',
  'stBba',
  'stBber',
  'stBbsr',
  'stBbsri',
  'stBfiw',
  'stBbbf',
  'stBmrci',
  'stBfow',
  'stBm',
  'stTtr',
  'stTtr100',
  'stTtw',
  'stBmf'
]

const categorySeos = [
  'n',
  'v',
  'f',
  's',
  'st',
  't',
  'sq',
  'ar',
  'ft',
  'sc',
  'o',
  'far',
  'r',
  'c',
  'u',
  'p',
  'stBhsi',
  'stBha',
  'stBhs',
  'stBmc',
  'stBmr6i',
  'stBm4',
  'stBmr4i',
  'stBmr',
  'stBmri',
  'stBmr50',
  'stBms',
  'stBtwt',
  'stBberi',
  'stBba',
  'stBber',
  'stBbsr',
  'stBbsri',
  'stBfiw',
  'stBbbf',
  'stBmrci',
  'stBfow',
  'stBm',
  'stTtr',
  'stTtr100',
  'stTtw',
  'stBmf'
]

const matchSeos = [
  'n',
  'sc',
  'o',
  'u',
  'r',
  'far',
  's'
]

const matchSeoBuilder = (newMatch, teamData1, teamData2, sMatchInfo, seriesDetail) => {
  const seoParams = {
    iId: newMatch._id.toString(),
    eType: 'ma',
    iSeriesId: seriesDetail?.iCategoryId ?? seriesDetail?._id
  }

  if (matchSeos.includes('sc')) {
    Object.assign(seoParams, {
      eSubType: 'sc',
      sTitle: `${teamData1.sTitle} vs ${teamData2.sTitle} ${sMatchInfo} ${new Date(newMatch.dStartDate).getFullYear()} Full Scorecard & Updates`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${sMatchInfo} ${new Date(newMatch.dStartDate).getFullYear()} Full Scorecard: Get the live & detailed ${teamData1.sAbbr} vs ${teamData2.sAbbr} ${sMatchInfo} ${new Date(newMatch.dStartDate).getFullYear()} scorecard, players score & fall of wickets information on CricTracker.`,
      sSlug: 'full-scorecard',
      sCUrl: 'full-scorecard'
    })
    queuePush('addSeoData', seoParams)
  }

  if (matchSeos.includes('o')) {
    Object.assign(seoParams, {
      eSubType: 'o',
      sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Overs | ${teamData1.sTitle} vs ${teamData2.sTitle} Full over & Ball by Ball updates`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Overs: Get the detailed ${teamData1.sAbbr} vs $${teamData2.sAbbr} ${sMatchInfo} Live Over updates, Ball  by Ball, & Match updates only on CricTracker.`,
      sSlug: 'overs',
      sCUrl: 'overs'
    })
    queuePush('addSeoData', seoParams)
  }

  if (matchSeos.includes('n')) {
    Object.assign(seoParams, {
      eSubType: 'n',
      sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()} Latest news | Live Match Updates, Match previews, Predictions & Match results.`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()}: Check out the ${teamData1.sAbbr} vs ${teamData2.sAbbr} Latest news, Injury updates, fantasy tips, Match predictions & More on CricTracker.`,
      sSlug: 'news',
      sCUrl: 'news',
      sRobots: 'follow, no index'
    })
    queuePush('addSeoData', seoParams)
  }

  if (matchSeos.includes('u')) {
    Object.assign(seoParams, {
      eSubType: 'u',
      sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()} Schedule | Fixtures, Upcoming schedule & Match Details.`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()}: Check out the ${teamData1.sAbbr} vs ${teamData2.sAbbr} Latest schedule, Fixtures, Teams, Date, Timings, Upcoming schedule & more on CricTracker.`,
      sSlug: 'fixtures-and-results',
      sCUrl: 'fixtures-and-results'
    })
    queuePush('addSeoData', seoParams)
  }

  if (matchSeos.includes('r')) {
    Object.assign(seoParams, {
      eSubType: 'r',
      sTitle: `${seriesDetail.sSrtTitle ?? seriesDetail.sTitle} ${new Date(seriesDetail.dStartDate).getFullYear()} Results After ${sMatchInfo} | ${seriesDetail.sSrtTitle ?? seriesDetail.sTitle} Match Results.`,
      sDescription: `${seriesDetail.sSrtTitle ?? seriesDetail.sTitle} ${new Date(seriesDetail.dStartDate).getFullYear()} Results: Check out the latest ${seriesDetail.sSrtTitle ?? seriesDetail.sTitle} ${new Date(seriesDetail.dStartDate).getFullYear()} match results After ${sMatchInfo} with scorecard, stats and other match details on CricTracker.`,
      sSlug: 'results',
      sCUrl: 'results'
    })

    queuePush('addSeoData', seoParams)
  }

  if (matchSeos.includes('far')) {
    Object.assign(seoParams, {
      eSubType: 'far',
      sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()} ${sMatchInfo} Fantasy Tips Prediction.`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()} Fantasy Tips: Find out the best XI for the major cricket matches daily as Fantasy Cricket Tips & Probable XI for Dream11 Prediction on CricTracker.`,
      sSlug: 'fantasy-tips',
      sCUrl: 'fantasy-tips',
      sRobots: 'follow, no index'
    })
    queuePush('addSeoData', seoParams)
  }
}

const seriesSeoBuilder = (seoParams, series) => {
  if (seriesSeos.length) {
    if (series?.iCategoryId) Object.assign(seoParams, { eStatus: 'd' })
    if (seriesSeos.includes('n')) {
      Object.assign(seoParams, {
        eSubType: 'n',
        sTitle: `${series.sAbbr} News | ${series.sTitle} ${new Date(series.dStartDate).getFullYear()} Latest News & Updates.`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Check out the ${series.sTitle} Latest news, Live updates, Match previews, Post match analysis & more on CricTracker.`,
        sSlug: 'news',
        sCUrl: 'news'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('v')) {
      Object.assign(seoParams, {
        eSubType: 'v',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | Latest Videos, Match Highlights, Pre & Post match Analysis.`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Get all the ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} latest videos, Breaking news, Match Highlights, Analysis, Trending videos and more on CricTracker.`,
        sSlug: 'videos',
        sCUrl: 'videos'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('p')) {
      Object.assign(seoParams, {
        eSubType: 'p',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Photo Gallery, Images, News & Pictures.`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Here's the latest pictures of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Get the best photos of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Cricket series during practice sessions, live matches, & more on CricTracker`,
        sSlug: 'photos',
        sCUrl: 'photos'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('f')) {
      Object.assign(seoParams, {
        eSubType: 'f',
        sTitle: `${series.sAbbr} Schedule ${new Date(series.dStartDate).getFullYear()} | ${series.sAbbr} Fixtures, Time Table, Timings & Venue.`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Fixtures: Check out the latest ${series.sAbbr} schedule with updated timings, Date, Time table, Teams, venue, & match details on CricTracker.`,
        sSlug: 'fixtures',
        sCUrl: 'fixtures'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('r')) {
      Object.assign(seoParams, {
        eSubType: 'r',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Results | ${series.sAbbr} Match Results.`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Results: Check out the latest ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} match results with scorecard, stats and other match details on CricTracker.`,
        sSlug: 'results',
        sCUrl: 'results'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('s') && series?.nTotalTeams > 2) {
      Object.assign(seoParams, {
        eSubType: 's',
        sTitle: `${series.sAbbr} Points Table ${new Date(series.dStartDate).getFullYear()} | ${series.sAbbr} Standings & Team Rankings.`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Points Table - Check out the latest ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} points table with team rankings, points, matches won, net run rate, wins, & updated team standings on CricTracker.`,
        sSlug: 'standings',
        sCUrl: 'standings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('st')) {
      Object.assign(seoParams, {
        eSubType: 'st',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats',
        sCUrl: 'stats'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('t')) {
      Object.assign(seoParams, {
        eSubType: 't',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | Teams, News, Squads, Playing XI`,
        sDescription: `Check out the ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Latest Teams, Squads, Playing XI. Get the latest updates and news of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} only on CricTracker.`,
        sSlug: 'teams',
        sCUrl: 'teams'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('sq')) {
      Object.assign(seoParams, {
        eSubType: 'sq',
        sTitle: `${series.sTitle} ${new Date(series.dStartDate).getFullYear()} | Squads and Full Players List of all Team`,
        sDescription: `${series.sTitle} Teams List and Squads: Check out the list of all teams that will compete in the ${series.sTitle} ${new Date(series.dStartDate).getFullYear()}. Here's the full squad list of each team, including reserves and substitutes.`,
        sSlug: 'squads',
        sCUrl: 'squads'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('ar')) {
      Object.assign(seoParams, {
        eSubType: 'ar',
        sTitle: `${series.sAbbr} Archives`,
        sDescription: `${series.sAbbr} Archives: Read about all the ${series.sTitle} Records, Results, Archives, Stats & more on CricTracker.`,
        sSlug: 'archives',
        sCUrl: 'archives'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('ft')) {
      Object.assign(seoParams, {
        eSubType: 'ft',
        sTitle: `${series.sAbbr} Fantasy ${new Date(series.dStartDate).getFullYear()} | ${series.sAbbr} Fantasy League Tips.`,
        sDescription: 'How to win fantasy cricket games big? Find out the best XI for the major cricket matches daily as Fantasy Cricket Tips & Probable XI for Dream11 Prediction.',
        sSlug: 'fantasy-tips',
        sCUrl: 'fantasy-tips'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBhsi')) {
      Object.assign(seoParams, {
        eSubType: 'stBhsi',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-strikerate-innings',
        sCUrl: 'stats/batting-highest-strikerate-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBha')) {
      Object.assign(seoParams, {
        eSubType: 'stBha',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-average',
        sCUrl: 'stats/batting-highest-average'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBhs')) {
      Object.assign(seoParams, {
        eSubType: 'stBhs',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-strikerate',
        sCUrl: 'stats/batting-highest-strikerate'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBmc')) {
      Object.assign(seoParams, {
        eSubType: 'stBmc',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-centuries',
        sCUrl: 'stats/batting-most-centuries'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBmr6i')) {
      Object.assign(seoParams, {
        eSubType: 'stBmr6i',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run6-innings',
        sCUrl: 'stats/batting-most-run6-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBm4')) {
      Object.assign(seoParams, {
        eSubType: 'stBm4',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-fours',
        sCUrl: 'stats/batting-most-fours'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBmr4i')) {
      Object.assign(seoParams, {
        eSubType: 'stBmr4i',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run4-innings',
        sCUrl: 'stats/batting-most-run4-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBmr')) {
      Object.assign(seoParams, {
        eSubType: 'stBmr',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-runs',
        sCUrl: 'stats/batting-most-runs'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBmri')) {
      Object.assign(seoParams, {
        eSubType: 'stBmri',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-runs-innings',
        sCUrl: 'stats/batting-most-runs-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBmr50')) {
      Object.assign(seoParams, {
        eSubType: 'stBmr50',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run50',
        sCUrl: 'stats/batting-most-run50'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBms')) {
      Object.assign(seoParams, {
        eSubType: 'stBms',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-sixes',
        sCUrl: 'stats/batting-most-sixes'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBtwt')) {
      Object.assign(seoParams, {
        eSubType: 'stBtwt',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-top-wicket-takers',
        sCUrl: 'stats/bowling-top-wicket-takers'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBtwt')) {
      Object.assign(seoParams, {
        eSubType: 'stBtwt',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-top-wicket-takers',
        sCUrl: 'stats/bowling-top-wicket-takers'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBba')) {
      Object.assign(seoParams, {
        eSubType: 'stBba',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-averages',
        sCUrl: 'stats/bowling-best-averages'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBber')) {
      Object.assign(seoParams, {
        eSubType: 'stBber',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-economy-rates',
        sCUrl: 'stats/bowling-best-economy-rates'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBbsr')) {
      Object.assign(seoParams, {
        eSubType: 'stBbsr',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-strike-rates',
        sCUrl: 'stats/bowling-best-strike-rates'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBbsri')) {
      Object.assign(seoParams, {
        eSubType: 'stBbsri',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-strike-rates-innings',
        sCUrl: 'stats/bowling-best-strike-rates-innings'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBfiw')) {
      Object.assign(seoParams, {
        eSubType: 'stBfiw',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-five-wickets',
        sCUrl: 'stats/bowling-five-wickets'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBbbf')) {
      Object.assign(seoParams, {
        eSubType: 'stBbbf',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-bowling-figures',
        sCUrl: 'stats/bowling-best-bowling-figures'
      })

      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBmrci')) {
      Object.assign(seoParams, {
        eSubType: 'stBmrci',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-most-runs-conceded-innings',
        sCUrl: 'stats/bowling-most-runs-conceded-innings'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBfow')) {
      Object.assign(seoParams, {
        eSubType: 'stBfow',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-four-wickets',
        sCUrl: 'stats/bowling-four-wickets'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBm')) {
      Object.assign(seoParams, {
        eSubType: 'stBm',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-maidens',
        sCUrl: 'stats/bowling-maidens'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stTtr')) {
      Object.assign(seoParams, {
        eSubType: 'stTtr',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-runs',
        sCUrl: 'stats/team-total-runs'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stTtr100')) {
      Object.assign(seoParams, {
        eSubType: 'stTtr100',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-run100',
        sCUrl: 'stats/team-total-run100'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stTtwv')) {
      Object.assign(seoParams, {
        eSubType: 'stTtw',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-wickets',
        sCUrl: 'stats/team-total-wickets'
      })
      queuePush('addSeoData', seoParams)
    }

    if (seriesSeos.includes('stBmf')) {
      Object.assign(seoParams, {
        eSubType: 'stBmf',
        sTitle: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-fifties',
        sCUrl: 'stats/batting-most-fifties'
      })
      queuePush('addSeoData', seoParams)
    }
  }
}

const categorySeoBuilder = async (series, category) => {
  if (categorySeos.length) {
    const seoParams = {
      iId: category._id,
      eType: 'ct'
    }

    if (categorySeos.includes('n')) {
      Object.assign(seoParams, {
        eSubType: 'n',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} News | ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Latest News & Updates`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Check out the ${category.sName} Latest news, Live updates, Match previews, Post match analysis & more on CricTracker.`,
        sSlug: 'news',
        sCUrl: 'news'
      })
      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('v')) {
      Object.assign(seoParams, {
        eSubType: 'v',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | Latest Videos, Match Highlights, Pre & Post match Analysis.`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Get all the ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} latest videos, Breaking news, Match Highlights, Analysis, Trending videos and more on CricTracker.`,
        sSlug: 'videos',
        sCUrl: 'videos'
      })
      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('p')) {
      Object.assign(seoParams, {
        eSubType: 'p',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Photo Gallery, Images, News & Pictures.`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Here's the latest pictures of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}. Get the best photos of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Cricket series during practice sessions, live matches, & more on CricTracker.`,
        sSlug: 'photos',
        sCUrl: 'photos'
      })
      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('f')) {
      Object.assign(seoParams, {
        eSubType: 'f',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} Schedule ${new Date(series.dStartDate).getFullYear()} | ${category?.sSrtTitle ?? series.sAbbr} Fixtures, Time Table, Timings & Venue.`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}Fixtures: Check out the latest ${category?.sSrtTitle ?? series.sAbbr} schedule ${new Date(series.dStartDate).getFullYear()} with updated timings, Date, Time table, Teams, venue, & match details on CricTracker.`,
        sSlug: 'fixtures',
        sCUrl: 'fixtures'
      })
      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('r')) {
      Object.assign(seoParams, {
        eSubType: 'r',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Results | ${category?.sSrtTitle ?? series.sAbbr} Match Results.`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Results: Check out the latest ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} match results with scorecard, stats and other match details on CricTracker.`,
        sSlug: 'results',
        sCUrl: 'results'
      })
      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('s') && series?.nTotalTeams > 2) {
      Object.assign(seoParams, {
        eSubType: 's',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} Points Table ${new Date(series.dStartDate).getFullYear()} | ${category?.sSrtTitle ?? series.sAbbr} Standings & Team Rankings.`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Points Table - Check out the latest ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} points table with team  rankings, points, matches won, net run rate, wins, & updated team standings on CricTracker.`,
        sSlug: 'standings',
        sCUrl: 'standings'
      })
      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('st')) {
      Object.assign(seoParams, {
        eSubType: 'st',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats',
        sCUrl: 'stats'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('t')) {
      Object.assign(seoParams, {
        eSubType: 't',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | Teams, News, Squads, Playing XI`,
        sDescription: `Check out the ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Latest Teams, Squads, Playing XI. Get the latest updates and news of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} only on CricTracker.`,
        sSlug: 'teams',
        sCUrl: 'teams'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('sq')) {
      Object.assign(seoParams, {
        eSubType: 'sq',
        sTitle: `${category?.sName} ${new Date(series.dStartDate).getFullYear()} | Squads and Full Players List of  all Team`,
        sDescription: `${category?.sName} Teams List and Squads: Check out the list of all teams that will compete in the ${category?.sName} ${new Date(series.dStartDate).getFullYear()}. Here's the full squad list of each team, including reserves and substitutes.`,
        sSlug: 'squads',
        sCUrl: 'squads'
      })
      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('ar')) {
      Object.assign(seoParams, {
        eSubType: 'ar',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} Archives`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} Archives: Read about all the ${category?.sName} Records, Results, Archives, Stats & more on CricTracker.`,
        sSlug: 'archives',
        sCUrl: 'archives'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('ft')) {
      Object.assign(seoParams, {
        eSubType: 'ft',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} Fantasy ${new Date(series.dStartDate).getFullYear()} | ${category?.sSrtTitle ?? series.sAbbr} Fantasy League Tips.`,
        sDescription: 'How to win fantasy cricket games big? Find out the best XI for the major cricket matches daily as Fantasy Cricket Tips & Probable XI for Dream11 Prediction.',
        sSlug: 'fantasy-tips',
        sCUrl: 'fantasy-tips'
      })
      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBhsi')) {
      Object.assign(seoParams, {
        eSubType: 'stBhsi',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-strikerate-innings',
        sCUrl: 'stats/batting-highest-strikerate-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBha')) {
      Object.assign(seoParams, {
        eSubType: 'stBha',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-average',
        sCUrl: 'stats/batting-highest-average'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBhs')) {
      Object.assign(seoParams, {
        eSubType: 'stBhs',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-strikerate',
        sCUrl: 'stats/batting-highest-strikerate'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBmc')) {
      Object.assign(seoParams, {
        eSubType: 'stBmc',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-centuries',
        sCUrl: 'stats/batting-most-centuries'
      })

      queuePush('addSeoData', seoParams)
    }
    if (categorySeos.includes('stBmr6i')) {
      Object.assign(seoParams, {
        eSubType: 'stBmr6i',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run6-innings',
        sCUrl: 'stats/batting-most-run6-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBm4')) {
      Object.assign(seoParams, {
        eSubType: 'stBm4',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-fours',
        sCUrl: 'stats/batting-most-fours'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBmr4i')) {
      Object.assign(seoParams, {
        eSubType: 'stBmr4i',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run4-innings',
        sCUrl: 'stats/batting-most-run4-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBmr')) {
      Object.assign(seoParams, {
        eSubType: 'stBmr',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-runs',
        sCUrl: 'stats/batting-most-runs'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBmri')) {
      Object.assign(seoParams, {
        eSubType: 'stBmri',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-runs-innings',
        sCUrl: 'stats/batting-most-runs-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBmr50')) {
      Object.assign(seoParams, {
        eSubType: 'stBmr50',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run50',
        sCUrl: 'stats/batting-most-run50'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBms')) {
      Object.assign(seoParams, {
        eSubType: 'stBms',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-sixes',
        sCUrl: 'stats/batting-most-sixes'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBtwt')) {
      Object.assign(seoParams, {
        eSubType: 'stBtwt',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-top-wicket-takers',
        sCUrl: 'stats/bowling-top-wicket-takers'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBtwt')) {
      Object.assign(seoParams, {
        eSubType: 'stBtwt',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-top-wicket-takers',
        sCUrl: 'stats/bowling-top-wicket-takers'
      })

      queuePush('addSeoData', seoParams)
    }
    if (categorySeos.includes('stBba')) {
      Object.assign(seoParams, {
        eSubType: 'stBba',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-averages',
        sCUrl: 'stats/bowling-best-averages'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBber')) {
      Object.assign(seoParams, {
        eSubType: 'stBber',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-economy-rates',
        sCUrl: 'stats/bowling-best-economy-rates'
      })

      queuePush('addSeoData', seoParams)
    }
    if (categorySeos.includes('stBbsr')) {
      Object.assign(seoParams, {
        eSubType: 'stBbsr',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-strike-rates',
        sCUrl: 'stats/bowling-best-strike-rates'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBbsri')) {
      Object.assign(seoParams, {
        eSubType: 'stBbsri',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-strike-rates-innings',
        sCUrl: 'stats/bowling-best-strike-rates-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBfiw')) {
      Object.assign(seoParams, {
        eSubType: 'stBfiw',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-five-wickets',
        sCUrl: 'stats/bowling-five-wickets'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBbbf')) {
      Object.assign(seoParams, {
        eSubType: 'stBbbf',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-bowling-figures',
        sCUrl: 'stats/bowling-best-bowling-figures'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBmrci')) {
      Object.assign(seoParams, {
        eSubType: 'stBmrci',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-most-runs-conceded-innings',
        sCUrl: 'stats/bowling-most-runs-conceded-innings'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBfow')) {
      Object.assign(seoParams, {
        eSubType: 'stBfow',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-four-wickets',
        sCUrl: 'stats/bowling-four-wickets'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBm')) {
      Object.assign(seoParams, {
        eSubType: 'stBm',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-maidens',
        sCUrl: 'stats/bowling-maidens'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stTtr')) {
      Object.assign(seoParams, {
        eSubType: 'stTtr',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-runs',
        sCUrl: 'stats/team-total-runs'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stTtr100')) {
      Object.assign(seoParams, {
        eSubType: 'stTtr100',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-run100',
        sCUrl: 'stats/team-total-run100'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stTtw')) {
      Object.assign(seoParams, {
        eSubType: 'stTtw',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-wickets',
        sCUrl: 'stats/team-total-wickets'
      })

      queuePush('addSeoData', seoParams)
    }

    if (categorySeos.includes('stBmf')) {
      Object.assign(seoParams, {
        eSubType: 'stBmf',
        sTitle: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-fifties',
        sCUrl: 'stats/batting-most-fifties'
      })

      queuePush('addSeoData', seoParams)
    }
  }
}

module.exports = {
  getPlayerIdFromKey,
  getVenueIdFromVenueObj,
  getTeamIdFromKey,
  getMatchIdFromKey,
  getSeriesIdFromKey,
  getAuthorRole,
  getAuthorArticle,
  getAuthorFantasyArticle,
  updateSeries,
  updateRedirection,
  updateMatchesSeo,
  matchesWithoutSlug
}
