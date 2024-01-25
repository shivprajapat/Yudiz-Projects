const { messages, status } = require('../../helper/api.responses')
const { handleCatchError } = require('../../helper/utilities.services')
const axios = require('axios')
const config = require('../../config/config')
const { oCricketEntityRole, oCricketSportsRadarRole, oFootballEntityRole, oFootballSportsRadarRole, oKabaddiEntityRole } = require('../../data')
const ApiLogModel = require('../apiLog/ApiLog.model')

// To reset single Cricket MatchPlayer by _id

async function resetMatchPlayerCricket(oMatchPlayer, userLanguage = 'English') {
  const playerKey = oMatchPlayer.sKey
  const { eProvider, sSeasonKey, sKey, oHomeTeam, oAwayTeam } = oMatchPlayer.iMatchId
  let result = {}

  switch (eProvider) {
    case 'ENTITYSPORT':
      try {
        const resetPlayer = await axios.get(`https://rest.entitysport.com/v2/competitions/${sSeasonKey}/squads/${sKey}`,
          { params: { token: config.ENTITYSPORT_CRICKET_API_KEY } })

        if (!resetPlayer.data || !resetPlayer.data.response.squads) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const allPlayers = resetPlayer.data.response.squads
        const mergePlayers = []
        for (const squadRes of allPlayers) {
          const squad = squadRes
          const playersData = squad.players
          let iTeamId
          let sTeamName

          if (oHomeTeam.sKey === squad.team_id) {
            iTeamId = oHomeTeam.iTeamId
            sTeamName = oHomeTeam.sName
          } else if (oAwayTeam.sKey === squad.team_id) {
            iTeamId = oAwayTeam.iTeamId
            sTeamName = oAwayTeam.sName
          }

          playersData.forEach(p => {
            p.iTeamId = iTeamId
            p.sTeamName = sTeamName
          })
          mergePlayers.push(...playersData)
        }

        let output = mergePlayers.findIndex((p) => p.pid.toString() === playerKey)
        output = mergePlayers[output]

        if (!output) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }
        const { playing_role: role, fantasy_player_rating: nFantasyCredit, iTeamId, sTeamName } = output

        result = { eRole: oCricketEntityRole[role] || 'BATS', nFantasyCredit: nFantasyCredit || undefined, iTeamId, sTeamName }
      } catch (error) {
        handleCatchError(error)
        return {
          isSuccess: false,
          status: status.OK,
          message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
          result: {}
        }
      }
      break

    case 'SPORTSRADAR':
      try {
        let aHomeTeam
        let aAwayTeam
        const homeTeamKey = oMatchPlayer.iMatchId.oHomeTeam.sKey
        const awayTeamKey = oMatchPlayer.iMatchId.oAwayTeam.sKey

        try {
          [aHomeTeam, aAwayTeam] = await Promise.all([
            axios.get(`https://api.sportradar.com/cricket-p2/en/tournaments/${sSeasonKey}/teams/${homeTeamKey}/squads.json`,
              { params: { api_key: config.SPORTSRADAR_API_KEY } }),
            axios.get(`https://api.sportradar.com/cricket-p2/en/tournaments/${sSeasonKey}/teams/${awayTeamKey}/squads.json`,
              { params: { api_key: config.SPORTSRADAR_API_KEY } })
          ])
        } catch (error) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].no_matchplayer),
            result: {}
          }
        }

        if (!aHomeTeam.data || !aAwayTeam.data) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const homeTeamPlayers = aHomeTeam.data.players || []
        const awayTeamPlayers = aAwayTeam.data.players || []

        const mergePlayers = []
        homeTeamPlayers.forEach(p => mergePlayers.push({ ...p, iTeamId: oHomeTeam.iTeamId, sTeamName: oHomeTeam.sName }))
        awayTeamPlayers.forEach(p => mergePlayers.push({ ...p, iTeamId: oAwayTeam.iTeamId, sTeamName: oAwayTeam.sName }))

        let output = mergePlayers.findIndex((p) => p.id === playerKey)
        output = mergePlayers[output]

        if (!output) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const { type, iTeamId, sTeamName } = output
        result = { eRole: oCricketSportsRadarRole[type] || 'BATS', iTeamId, sTeamName }
      } catch (error) {
        handleCatchError(error)
        return {
          isSuccess: false,
          status: status.OK,
          message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
          result: {}
        }
      }
      break
  }

  return {
    isSuccess: true,
    status: status.OK,
    message: messages[userLanguage].success.replace('##', messages[userLanguage].matchPlayer),
    result
  }
}

// To reset single Football MatchPlayer by _id

async function resetMatchPlayerFootball(oMatchPlayer, userLanguage = 'English') {
  const playerKey = oMatchPlayer.sKey
  const { eProvider, sKey, oHomeTeam, oAwayTeam } = oMatchPlayer.iMatchId
  let result = {}

  switch (eProvider) {
    case 'ENTITYSPORT':
      try {
        const resetPlayer = await axios.get(`https://soccer.entitysport.com/matches/${sKey}/fantasy`,
          { params: { token: config.ENTITYSPORT_SOCCER_API_KEY } })

        if (!resetPlayer.data || !resetPlayer.data.response.items) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const homeTeamPlayers = resetPlayer.data.response.items.teams.home || []
        const awayTeamPlayers = resetPlayer.data.response.items.teams.away || []
        const allPlayers = []

        homeTeamPlayers.forEach(p => allPlayers.push({ ...p, iTeamId: oHomeTeam.iTeamId, sTeamName: oHomeTeam.sName }))
        awayTeamPlayers.forEach(p => allPlayers.push({ ...p, iTeamId: oAwayTeam.iTeamId, sTeamName: oAwayTeam.sName }))

        let output = allPlayers.findIndex((p) => p.pid.toString() === playerKey)
        output = allPlayers[output]

        if (!output) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const { positionname: type, fantasy_player_rating: nFantasyCredit, iTeamId, sTeamName } = output

        result = { eRole: oFootballEntityRole[type] || 'MID', nFantasyCredit: nFantasyCredit || undefined, iTeamId, sTeamName }
      } catch (error) {
        handleCatchError(error)
        return {
          isSuccess: false,
          status: status.OK,
          message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
          result: {}
        }
      }
      break

    case 'SPORTSRADAR':
      try {
        let aHomeTeam
        let aAwayTeam
        const homeTeamKey = oMatchPlayer.iMatchId.oHomeTeam.sKey
        const awayTeamKey = oMatchPlayer.iMatchId.oAwayTeam.sKey
        try {
          [aHomeTeam, aAwayTeam] = await Promise.all([
            axios.get(`https://api.sportradar.us/soccer-x3/global/en/teams/${homeTeamKey}/profile.json`,
              { params: { api_key: config.FOOTBALL_API_KEY } }),
            axios.get(`https://api.sportradar.us/soccer-x3/global/en/teams/${awayTeamKey}/profile.json`,
              { params: { api_key: config.FOOTBALL_API_KEY } })
          ])
        } catch (error) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].no_matchplayer),
            result: {}
          }
        }

        if (!aHomeTeam.data || !aAwayTeam.data) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const homeTeamPlayers = aHomeTeam.data.players || []
        const awayTeamPlayers = aAwayTeam.data.players || []

        const mergePlayers = []

        homeTeamPlayers.forEach(p => mergePlayers.push({ ...p, iTeamId: oHomeTeam.iTeamId, sTeamName: oHomeTeam.sName }))
        awayTeamPlayers.forEach(p => mergePlayers.push({ ...p, iTeamId: oAwayTeam.iTeamId, sTeamName: oAwayTeam.sName }))

        let output = mergePlayers.findIndex((p) => p.id === playerKey)
        output = mergePlayers[output]

        if (!output) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const { type, iTeamId, sTeamName } = output
        result = { eRole: oFootballSportsRadarRole[type] || 'MID', iTeamId, sTeamName }
      } catch (error) {
        handleCatchError(error)
        return {
          isSuccess: false,
          status: status.OK,
          message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
          result: {}
        }
      }
      break
  }

  return {
    isSuccess: true,
    status: status.OK,
    message: messages[userLanguage].success.replace('##', messages[userLanguage].matchPlayer),
    result
  }
}

// To reset Single Basketball MatchPlayer by _id

async function resetMatchPlayerBasketball(oMatchPlayer, userLanguage = 'English') {
  const playerKey = oMatchPlayer.sKey
  const { eProvider, oHomeTeam, oAwayTeam } = oMatchPlayer.iMatchId
  const homeTeamKey = oMatchPlayer.iMatchId.oHomeTeam.sKey
  const awayTeamKey = oMatchPlayer.iMatchId.oAwayTeam.sKey
  let aHomeTeam
  let aAwayTeam
  let result = {}

  switch (eProvider) {
    case 'ENTITYSPORT':
      try {
        try {
          [aHomeTeam, aAwayTeam] = await Promise.all([
            axios.get(`https://basketball.entitysport.com/team/${homeTeamKey}/info`, { params: { token: config.ENTITYSPORT_BASKETBALL_API_KEY } }),
            axios.get(`https://basketball.entitysport.com/team/${awayTeamKey}/info`, { params: { token: config.ENTITYSPORT_BASKETBALL_API_KEY } })
          ])
        } catch (error) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].no_matchplayer),
            result: {}
          }
        }

        if (!aHomeTeam.data || !aHomeTeam.data.response.items || !aAwayTeam.data || !aAwayTeam.data.response.items) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const [homeTeamData] = aHomeTeam.data.response.items
        const [awayTeamData] = aAwayTeam.data.response.items

        const homeTeamPlayers = homeTeamData.squads || []
        const awayTeamPlayers = awayTeamData.squads || []
        const allPlayers = []

        homeTeamPlayers.forEach(p => allPlayers.push({ ...p, iTeamId: oHomeTeam.iTeamId, sTeamName: oHomeTeam.sName }))
        awayTeamPlayers.forEach(p => allPlayers.push({ ...p, iTeamId: oAwayTeam.iTeamId, sTeamName: oAwayTeam.sName }))

        let output = allPlayers.findIndex((p) => p.pid.toString() === playerKey)
        output = allPlayers[output]

        if (!output) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }
        const { primaryposition: role, fantasyplayerrating: nFantasyCredit, iTeamId, sTeamName } = output

        result = { eRole: role, nFantasyCredit: nFantasyCredit || undefined, iTeamId, sTeamName }
      } catch (error) {
        handleCatchError(error)
        return {
          isSuccess: false,
          status: status.OK,
          message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
          result: {}
        }
      }
      break

    case 'SPORTSRADAR':
      try {
        try {
          [aHomeTeam, aAwayTeam] = await Promise.all([
            axios.get(`https://api.sportradar.com/nba/production/v5/en/teams/${homeTeamKey}/profile.json`,
              { params: { api_key: config.NBA_API_KEY } }),
            axios.get(`https://api.sportradar.com/nba/production/v5/en/teams/${awayTeamKey}/profile.json`,
              { params: { api_key: config.NBA_API_KEY } })
          ])
        } catch (error) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].no_matchplayer),
            result: {}
          }
        }

        if (!aHomeTeam.data || !aAwayTeam.data) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const homeTeamPlayers = aHomeTeam.data.players || []
        const awayTeamPlayers = aAwayTeam.data.players || []
        const allPlayers = []

        homeTeamPlayers.forEach(p => allPlayers.push({ ...p, iTeamId: oHomeTeam.iTeamId, sTeamName: oHomeTeam.sName }))
        awayTeamPlayers.forEach(p => allPlayers.push({ ...p, iTeamId: oAwayTeam.iTeamId, sTeamName: oAwayTeam.sName }))

        let output = allPlayers.find((p) => p.sr_id === playerKey)
        output = allPlayers[output]

        if (!output) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const { primary_position: role, iTeamId, sTeamName } = output

        result = { eRole: role, iTeamId, sTeamName }
      } catch (error) {
        handleCatchError(error)
        return {
          isSuccess: false,
          status: status.OK,
          message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
          result: {}
        }
      }
      break
  }

  return {
    isSuccess: true,
    status: status.OK,
    message: messages[userLanguage].success.replace('##', messages[userLanguage].matchPlayer),
    result
  }
}

// To reset Single Kabaddi MatchPlayer by _id

async function resetMatchPlayerKabaddi(oMatchPlayer, userLanguage = 'English') {
  const playerKey = oMatchPlayer.sKey
  const { eProvider, sKey, oHomeTeam, oAwayTeam } = oMatchPlayer.iMatchId
  let result = {}

  switch (eProvider) {
    case 'ENTITYSPORT':
      try {
        const resetPlayer = await axios.get(`https://kabaddi.entitysport.com/matches/${sKey}/info`,
          { params: { token: config.ENTITYSPORT_KABADDI_API_KEY } })

        if (!resetPlayer.data || !resetPlayer.data.response.items) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const homeTeamData = resetPlayer.data.response.items.squad.home
        const awayTeamData = resetPlayer.data.response.items.squad.away

        const homeTeamPlayers = homeTeamData || []
        const awayTeamPlayers = awayTeamData || []
        const allPlayers = []

        homeTeamPlayers.forEach(p => allPlayers.push({ ...p, iTeamId: oHomeTeam.iTeamId, sTeamName: oHomeTeam.sName }))
        awayTeamPlayers.forEach(p => allPlayers.push({ ...p, iTeamId: oAwayTeam.iTeamId, sTeamName: oAwayTeam.sName }))

        let output = allPlayers.findIndex((p) => p.pid.toString() === playerKey)
        output = allPlayers[output]

        if (!output) {
          return {
            isSuccess: false,
            status: status.OK,
            message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
            result: {}
          }
        }

        const { role, fantasy_credit: nFantasyCredit, iTeamId, sTeamName } = output

        result = { eRole: oKabaddiEntityRole[role] || 'DEF', nFantasyCredit: nFantasyCredit || undefined, iTeamId, sTeamName }
      } catch (error) {
        handleCatchError(error)
        return {
          isSuccess: false,
          status: status.OK,
          message: messages[userLanguage].not_found.replace('##', messages[userLanguage].matchPlayer),
          result: {}
        }
      }
      break
  }
  return {
    isSuccess: true,
    status: status.OK,
    message: messages[userLanguage].success.replace('##', messages[userLanguage].matchPlayer),
    result
  }
}

/**
 * It'll dump particular cricket match's lineUpsOut match player details from Entity sports api to our system.
 * @param {object} match details
 * @param {*} userLanguage English or Hindi(In future)
 * @returns It'll dump particular cricket match's lineUpsOut match player details from Entity sports api to our system.
 */
async function fetchPlaying11FromEntitySport(match, userLanguage = 'English') {
  const { sKey } = match
  let response
  try {
    response = await axios.get(`https://rest.entitysport.com/v2/matches/${sKey}/squads`,
      {
        params: {
          token: config.ENTITYSPORT_CRICKET_API_KEY
        }
      })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: `https://rest.entitysport.com/v2/matches/${sKey}/squads` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_lineups,
      data: {}
    }
  }
  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data.response, sUrl: `https://rest.entitysport.com/v2/matches/${sKey}/squads` })
  }

  const data = response.data ? response.data.response : null
  const teamA = (data && data.teama) ? data.teama.squads : ''
  const teamB = (data && data.teamb) ? data.teamb.squads : ''
  const teamData = [...teamA, ...teamB]
  const playerKey = []
  for (const data of teamData) {
    const team = data
    if (team.playing11 !== undefined && team.playing11 === 'true') {
      playerKey.push(team.player_id)
    }
  }

  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: playerKey,
    match,
    matchId: match._id,
    eCategory: 'CRICKET'
  }
}

async function fetchPlaying11FromSportradar(match, userLanguage = 'English') {
  let response
  try {
    response = await axios.get(`https://api.sportradar.us/cricket-t2/en/matches/${match.sKey}/lineups.json`, { params: { api_key: config.SPORTSRADAR_API_KEY } })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data?.response?.data, sUrl: `https://api.sportradar.us/cricket-p2/en/matches/${match.sKey}/lineups.json` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_lineups,
      data: {}
    }
  }

  const data = response.data ? response.data.lineups : []
  const playerKey = []
  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data, sUrl: `https://api.sportradar.us/cricket-p2/en/matches/${match.sKey}/lineups.json` })
  }
  for (const val of data) {
    val.starting_lineup.map((player) => {
      playerKey.push(player.id)
    })
  }
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: playerKey,
    match
  }
}

async function fetchPlaying11FromSoccerEntitySport(match, userLanguage = 'English') {
  const { sKey } = match
  let response
  try {
    response = await axios.get(`https://soccer.entitysport.com/matches/${sKey}/info`, { params: { token: config.ENTITYSPORT_SOCCER_API_KEY } })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: `https://soccer.entitysport.com/matches/${sKey}/info` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_lineups,
      data: []
    }
  }
  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data.response.items, sUrl: `https://soccer.entitysport.com/matches/${sKey}/info` })
  }

  const isLineupAvailable = response.data.response.items.match_info[0].lineupavailable
  if (isLineupAvailable === 'false') return { isSuccess: false, status: status.OK, message: messages[userLanguage].no_lineups, data: [] }
  const data = response.data ? response.data.response.items : null
  const teamA = (data && data.lineup) ? data.lineup.home : null
  const teamB = (data && data.lineup) ? data.lineup.away : null
  const teamALineUpsPlayers = (teamA && teamA.lineup) ? teamA.lineup.player : ''
  const teamBLineUpsPlayers = (teamB && teamB.lineup) ? teamB.lineup.player : ''
  const finalPlayersData = [...teamALineUpsPlayers, ...teamBLineUpsPlayers]
  const playerKey = []
  for (const data of finalPlayersData) {
    playerKey.push(data.pid)
  }
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: playerKey,
    match,
    matchId: match._id,
    eCategory: 'FOOTBALL'
  }
}

async function fetchPlaying11FromSoccerSportradar(match, userLanguage = 'English') {
  let response
  try {
    response = await axios.get(`https://api.sportradar.com/soccer-extended/trial/v4/en/sport_events/${match.sKey}/lineups.json`, { params: { api_key: config.FOOTBALL_API_KEY } })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: error?.response?.data, sUrl: `https://api.sportradar.com/soccer-extended/trial/v4/en/sport_events/${match.sKey}/lineups.json` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_lineups,
      data: {}
    }
  }
  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'LINEUP', eProvider: match.eProvider, oData: response.data, sUrl: `https://api.sportradar.com/soccer-extended/trial/v4/en/sport_events/${match.sKey}/lineups.json` })
  }
  const data = response.data ? response.data.lineups : []
  const playerKey = []
  for (const val of data) {
    val.starting_lineup.map((player) => {
      playerKey.push(player.id)
    })
  }
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    data: playerKey,
    match
  }
}

// using for updating toss details of match
async function fetchMatchTossFromEntitySport(match, userLanguage = 'English') {
  const { sKey, oHomeTeam, oAwayTeam } = match
  let response
  console.log('656', sKey)
  try {
    response = await axios.get(`https://rest.entitysport.com/v2/matches/${sKey}/info`,
      {
        params: {
          token: config.ENTITYSPORT_CRICKET_API_KEY
        }
      })
  } catch (error) {
    if (config.API_LOGS) {
      await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'TOSS', eProvider: match.eProvider, oData: error?.error, sUrl: `https://rest.entitysport.com/v2/matches/${sKey}/info` })
    }
    return {
      isSuccess: false,
      status: status.OK,
      message: messages[userLanguage].no_lineups,
      data: {}
    }
  }
  if (config.API_LOGS) {
    await ApiLogModel.create({ sKey: match.sKey, iMatchId: match._id, eCategory: match.eCategory, eType: 'TOSS', eProvider: match.eProvider, oData: response.data.response, sUrl: `https://rest.entitysport.com/v2/matches/${sKey}/info` })
  }
  const data = response.data ? response.data.response : null
  console.log('678', data)
  if (!data) return { isSuccess: false, status: status.OK, message: messages[userLanguage].match_not_started, data: {} }

  const { toss = {} } = data

  let eTossWinnerAction
  let tossWinnerTeam
  if (toss) {
    const { winner = '', decision = '' } = toss
    tossWinnerTeam = oHomeTeam.sKey === winner.toString() ? oHomeTeam : oAwayTeam.sKey === winner.toString() ? oAwayTeam : {}
    eTossWinnerAction = decision.toString() === '2' ? 'BOWLING' : 'BAT'
  }
  return {
    isSuccess: true,
    status: status.OK,
    message: null,
    tossWinnerTeam,
    eTossWinnerAction,
    matchId: match._id,
    eCategory: 'CRICKET'
  }
}

module.exports = {
  resetMatchPlayerCricket,
  resetMatchPlayerFootball,
  resetMatchPlayerBasketball,
  resetMatchPlayerKabaddi,
  fetchPlaying11FromEntitySport,
  fetchPlaying11FromSoccerEntitySport,
  fetchPlaying11FromSportradar,
  fetchPlaying11FromSoccerSportradar,
  fetchMatchTossFromEntitySport
}
