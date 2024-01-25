const FantasyPostModel = require('./fantasyPosts/model')
const axios = require('axios')
const { handleCatchError } = require('../../helper/utilities.services')
const { messages, status } = require('../../helper/api.responses')
const config = require('../../config/config')
const { APP_ENV } = require('../../config/common')

// To store fantasy matches tips
async function storeFantasyTips(postId, eCategory) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const data = await FantasyPostModel.findOne({ iFantasyPostId: postId, eCategory }).lean()
        if (data) {
          resolve({ isSuccess: true })
        } else {
          const tips = await axios.get(`https://crictracker.com/wp-json/wp/v2/posts/${postId}`)
          const { status, data } = tips
          if (status === 200) {
            const { content = '', slug, title = '' } = data
            const { rendered = '' } = title
            const { rendered: contents = '' } = content
            await FantasyPostModel.create({ iFantasyPostId: postId, eCategory, sContent: contents, sTitle: rendered, sSlug: slug })
            resolve({ isSuccess: true })
          } else {
            resolve({ isSuccess: false })
          }
        }
      } catch (error) {
        handleCatchError(error)
        resolve({ isSuccess: false })
      }
    })()
  })
}

/**
 * It'll dump the all required Cricket matches data from Entity sports api to our system.
 * @param {*} date Start Date
 * @param {*} endDate End Date
 * @param {*} userLanguage English or Hindi(In future)
 * @returns It'll dump the all required cricket matches data from Entity sports api to our system.
 */
async function getEntitySportCricketData(date, endDate, userLanguage = 'English') {
  let result
  let page = 1
  let totalPages = 1
  const data = []

  while (page <= totalPages) {
    try {
      result = await axios.get('https://rest.entitysport.com/v2/matches',
        {
          params: {
            token: config.ENTITYSPORT_CRICKET_API_KEY,
            date: date + '_' + endDate,
            paged: page,
            pre_squad: true,
            status: 1
          }
        })
      if (result.data.response && result.data.response.total_pages) {
        totalPages = result.data.response.total_pages
      }

      if (result.data.response && result.data.response.items) {
        data.push(...result.data.response.items)
      }
    } catch (error) {
      return {
        isSuccess: false,
        status: status.OK,
        message: messages[userLanguage].no_match_scheduled,
        data: {}
      }
    }
    page++
  }

  const oStoreData = { eCategory: 'CRICKET', eType: 'MATCHES', eProvider: 'ENTITYSPORT', sUrl: 'https://rest.entitysport.com/v2/matches' }
  const formatMatches = data.map(async (sportEvent) => {
    // eslint-disable-next-line camelcase
    const { match_id, format, teama, teamb, competition, venue, date_start } = sportEvent
    let gender

    if (format && (format == 6 || format == 7)) {
      gender = 'Women'
    } else {
      gender = 'men'
    }

    let oHomeTeam = {}
    let oAwayTeam = {}

    const competitors = [{ ...teama }, { ...teamb }]

    for (const competitor of competitors) {
      if (competitor.team_id === teama.team_id) {
        oHomeTeam = {
          sKey: competitor.team_id,
          sName: (gender === 'women') ? competitor.name.toString().concat(' -Women') : competitor.name,
          sShortName: (gender === 'women') ? competitor.short_name.toString().concat(' -W') : competitor.short_name,
          sLogoUrl: competitor.logo_url
        }
      } else if (competitor.team_id === teamb.team_id) {
        oAwayTeam = {
          sKey: competitor.team_id,
          sName: (gender === 'women') ? competitor.name.toString().concat(' -Women') : competitor.name,
          sShortName: (gender === 'women') ? competitor.short_name.toString().concat(' -W') : competitor.short_name,
          sLogoUrl: competitor.logo_url
        }
      }
    }
    let eFormat
    if ([3, 6, 8, 10].includes(format)) {
      eFormat = 'T20'
    } else if ([17].includes(format)) {
      eFormat = 'T10'
    } else if ([2].includes(format)) {
      eFormat = 'TEST'
    } else if ([1, 7, 9].includes(format)) {
      eFormat = 'ODI'
    } else if ([18, 19].includes(format)) {
      eFormat = '100BALL'
    } else {
      eFormat = 'ODI'
    }

    return {
      sKey: match_id,
      sName: oHomeTeam.sShortName.concat(' vs ', oAwayTeam.sShortName),
      eFormat,
      sSeasonKey: competition ? competition.cid : '',
      sVenue: venue ? venue.name.toString().concat(' ', venue.location) : '',
      dStartDate: new Date(date_start),
      dEntryCloseTime: new Date(date_start),
      oHomeTeam: oHomeTeam,
      oAwayTeam: oAwayTeam,
      eCategory: 'CRICKET',
      sSeasonName: competition ? competition.title.toString().concat(' ', competition.season) : '',
      eProvider: 'ENTITYSPORT',
      seasonData: {
        sName: competition ? competition.title.toString().concat(' ', competition.season) : '',
        sKey: competition.cid,
        eCategory: 'CRICKET',
        // dStartDate: competition.start_date,
        // dEndDate: competition.end_date,
        eProvider: 'ENTITYSPORT'
      }
    }
  })

  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatMatches,
    apiData: { oStoreData, aApiMatches: data }
  }
}

/**
   * It'll dump the all required Soccer matches data from Sports Radar api to our system.
   * @param {*} date Start Date
   * @param {*} endDate End Date
   * @param {*} userLanguage English or Hindi(In future)
   * @returns It'll dump the all required soccer matches data from Sports Radar api to our system.
   */
async function getEntitySportSoccerData(date, endDate, userLanguage = 'English') {
  let result
  let page = 1
  let totalPages = 1
  const data = []
  const params = {
    token: config.ENTITYSPORT_SOCCER_API_KEY,
    date: date + '_' + endDate,
    paged: page,
    pre_squad: true,
    status: 1
  }
  if (APP_ENV && APP_ENV === 'cartolapix') params.pre_squad = false
  while (page <= totalPages) {
    try {
      result = await axios.get('https://soccer.entitysport.com/matches',
        {
          params
        })

      if (result.data.response && result.data.response.total_pages) {
        totalPages = result.data.response.total_pages
      }
      if (result.data.response && result.data.response.items) {
        data.push(...result.data.response.items)
      }
    } catch (error) {
      return {
        isSuccess: false,
        status: status.OK,
        message: messages[userLanguage].no_match_scheduled,
        data: {}
      }
    }
    page++
  }

  const oStoreData = { eCategory: 'FOOTBALL', eType: 'MATCHES', eProvider: 'ENTITYSPORT', sUrl: 'https://soccer.entitysport.com/matches' }

  const formatMatches = data.map(async (sportEvent) => {
    const { mid, competition, venue, teams, datestart } = sportEvent
    const gender = 'men'

    let oHomeTeam = {}
    let oAwayTeam = {}

    for (const competitor in teams) {
      if (competitor === 'home') {
        oHomeTeam = {
          sKey: teams[competitor].tid,
          sName: (gender === 'women') ? teams[competitor].tname.toString().concat(' -Women') : teams[competitor].tname,
          sShortName: (gender === 'women') ? teams[competitor].abbr.toString().concat(' -W') : teams[competitor].abbr,
          sLogoUrl: teams[competitor].logo,
          nScore: 0
        }
      } else if (competitor === 'away') {
        oAwayTeam = {
          sKey: teams[competitor].tid,
          sName: (gender === 'women') ? teams[competitor].tname.toString().concat(' -Women') : teams[competitor].tname,
          sShortName: (gender === 'women') ? teams[competitor].abbr.toString().concat(' -W') : teams[competitor].abbr,
          sLogoUrl: teams[competitor].logo,
          nScore: 0
        }
      }
    }
    return {
      sKey: mid,
      sName: oHomeTeam.sShortName.concat(' vs ', oAwayTeam.sShortName),
      // sName: (gender === 'women') ? teams.home.abbr.concat('-W vs ', teams.away.abbr.concat('-W')) : teams.home.abbr.concat(' vs ', teams.away.abbr),
      eFormat: 'FOOTBALL',
      sSeasonKey: competition ? competition.cid : '',
      sVenue: venue ? venue.name.toString().concat(', ', venue.location) : '',
      dStartDate: new Date(datestart),
      dEntryCloseTime: new Date(datestart),
      oHomeTeam,
      oAwayTeam,
      eCategory: 'FOOTBALL',
      sSeasonName: competition ? competition.cname : '',
      eProvider: 'ENTITYSPORT',
      seasonData: {
        sName: competition.cname,
        sKey: competition.cid,
        eCategory: 'FOOTBALL',
        dStartDate: competition.startdate,
        dEndDate: competition.enddate,
        eProvider: 'ENTITYSPORT'
      }
    }
  })
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatMatches,
    apiData: { oStoreData, aApiMatches: data }
  }
}

/**
   * It'll dump the all required kabaddi matches data from Entity sports api to our system.
   * @param {date, endDate, userLanguage } date, enddate and userLanguage English or Hindi(In future)
   * @returns It'll dump the all required kabaddi matches data from Entity sports api to our system.
   */
async function getEntitySportKabaddiData(userLanguage = 'English') {
  let result
  let page = 1
  let totalPages = 1
  const items = []

  while (page <= totalPages) {
    try {
      result = await axios.get('https://kabaddi.entitysport.com/matches',
        {
          params: {
            token: config.ENTITYSPORT_KABADDI_API_KEY,
            status: 1,
            paged: page,
            pre_squad: true
          }
        })

      if (result.data.response && result.data.response.total_pages) {
        totalPages = result.data.response.total_pages
      }
      if (result.data.response && result.data.response.items) {
        items.push(...result.data.response.items)
      }
    } catch (error) {
      return {
        isSuccess: false,
        status: status.OK,
        message: messages[userLanguage].no_match_scheduled,
        data: {}
      }
    }
    page++
  }
  const oStoreData = { eCategory: 'KABADDI', eType: 'MATCHES', eProvider: 'ENTITYSPORT', sUrl: 'https://kabaddi.entitysport.com/matches' }

  if (!items.length) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_match_scheduled,
      data: {}
    }
  }
  const formatMatches = items.map(async (item) => {
    const { mid, teams, shorttitle, competition, venue, datestart } = item
    const { home, away } = teams

    return {
      sKey: mid,
      eFormat: 'KABADDI',
      sName: shorttitle,
      sSeasonKey: competition ? competition.cid : '',
      sVenue: venue ? venue.name : '',
      dStartDate: datestart ? new Date(datestart) : '',
      dEntryCloseTime: datestart ? new Date(datestart) : '',
      oHomeTeam: {
        sKey: home ? home.tid.toString() : '',
        sName: home ? home.tname : '',
        sShortName: home ? home.shortname : '',
        sLogoUrl: home.logo,
        nScore: 0
      },
      oAwayTeam: {
        sKey: away ? away.tid.toString() : '',
        sName: away ? away.tname : '',
        sShortName: away ? away.shortname : '',
        sLogoUrl: away.logo,
        nScore: 0
      },
      eCategory: 'KABADDI',
      sSeasonName: competition ? competition.cname : '',
      eProvider: 'ENTITYSPORT',
      seasonData: {
        sName: competition ? competition.cname : '',
        sKey: competition.cid,
        eCategory: 'KABADDI',
        dStartDate: competition ? competition.startdate : '',
        dEndDate: competition ? competition.enddate : '',
        eProvider: 'ENTITYSPORT'
      }

    }
  })

  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatMatches,
    apiData: { oStoreData, aApiMatches: items }
  }
}

/**
   * It'll dump the all required basketball matches data from Entity sports api to our system.
   * @param {date, endDate, userLanguage } date, enddate and userLanguage English or Hindi(In future)
   * @returns It'll dump the all required basketball matches data from Entity sports api to our system.
   */
async function getEntitySportBasketballData(userLanguage = 'English') {
  let result
  let page = 1
  let totalPages = 1
  const items = []

  while (page <= totalPages) {
    try {
      result = await axios.get('https://basketball.entitysport.com/matches',
        {
          params: {
            token: config.ENTITYSPORT_BASKETBALL_API_KEY,
            status: 1,
            paged: page,
            per_page: 200
          }
        })
      if (result.data.response && result.data.response.total_pages) {
        totalPages = result.data.response.total_pages
      }
      if (result.data.response && result.data.response.items) {
        items.push(...result.data.response.items)
      }
    } catch (error) {
      return {
        isSuccess: false,
        status: status.OK,
        message: messages[userLanguage].no_match_scheduled,
        data: {}
      }
    }
    page++
  }

  const oStoreData = { eCategory: 'BASKETBALL', eType: 'MATCHES', eProvider: 'ENTITYSPORT', sUrl: 'https://basketball.entitysport.com/matches' }

  if (!items.length) {
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_match_scheduled,
      data: {}
    }
  }

  const formatMatches = items.map(async (item) => {
    const { mid, teams, competition, venue, datestart } = item
    const { home, away } = teams

    return {
      sKey: mid,
      eFormat: 'BASKETBALL',
      sName: teams ? teams.home.abbr.concat(' vs ', teams.away.abbr) : '',
      sSeasonKey: competition ? competition.cid : '',
      sVenue: venue ? venue.name : '',
      dStartDate: datestart ? new Date(datestart) : '',
      dEntryCloseTime: datestart ? new Date(datestart) : '',
      oHomeTeam: {
        sKey: home ? home.tid.toString() : '',
        sName: home ? home.tname : '',
        sShortName: home ? home.abbr : '',
        sLogoUrl: home.logo,
        nScore: 0
      },
      oAwayTeam: {
        sKey: away ? away.tid.toString() : '',
        sName: away ? away.tname : '',
        sShortName: away ? away.abbr : '',
        sLogoUrl: away.logo,
        nScore: 0
      },
      eCategory: 'BASKETBALL',
      sSeasonName: competition ? competition.cname : '',
      eProvider: 'ENTITYSPORT',
      seasonData: {
        sName: competition ? competition.cname : '',
        sKey: competition.cid,
        eCategory: 'BASKETBALL',
        dStartDate: competition ? competition.startdate : '',
        dEndDate: competition ? competition.enddate : '',
        eProvider: 'ENTITYSPORT'
      }

    }
  })

  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: formatMatches,
    apiData: { oStoreData, aApiMatches: items }
  }
}

module.exports = {
  storeFantasyTips,
  getEntitySportCricketData,
  getEntitySportSoccerData,
  getEntitySportKabaddiData,
  getEntitySportBasketballData
}
