const { findUpcomingMatch } = require('../match/common')
const { messages, status } = require('../../helper/api.responses')
const sportServices = require('../sports/services')
const matchPlayerServices = require('../matchPlayer/services')
const UserTeamModel = require('./model')
const MyMatchesModel = require('../myMatches/model')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
/**
* It validates match, its matchplayers and team so that appropriate team can be added
* @param   {object}    data
* @param   {ObjectId}  iUserId
* @param   {string}    userLanguage English
* @returns {object}    { isSuccess:false, status, message }if any validation is failed
* @returns {object}    { isSuccess:true, nTotalCredit, matchPlayerMap, match } for further use
*/
async function validateMatch(data, iUserId, userLanguage = 'English') {
  const { iMatchId, aPlayers, iCaptainId, iViceCaptainId, sName, bIsUpdate = false } = data
  const match = await findUpcomingMatch(iMatchId)
  if (!match) return { isSuccess: false, status: status.OK, message: messages[userLanguage].match_started, type: 'match_started' }

  const roles = match.aPlayerRole || []
  if (!roles.length) return { isSuccess: false, status: status.NotFound, message: messages[userLanguage].not_exist.replace('##', messages[userLanguage].croles) }

  // check all players are unique
  const playerId = []
  let hasCaptain
  let hasViceCaptain
  for (let iMatchPlayerId of aPlayers) {
    if (typeof iMatchPlayerId === 'object' && iMatchPlayerId.iMatchPlayerId) {
      iMatchPlayerId = iMatchPlayerId.iMatchPlayerId
    }

    if (!playerId.includes(iMatchPlayerId)) {
      playerId.push(iMatchPlayerId)
    }
    if (iMatchPlayerId === iCaptainId) {
      hasCaptain = true
    } else if (iMatchPlayerId === iViceCaptainId) {
      hasViceCaptain = true
    }
  }

  if (playerId.length !== aPlayers.length) return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].unique_team_player_err }

  // check captain and vice captain are only 1 and both are not same
  if (!hasCaptain) return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].required.replace('##', messages[userLanguage].ccaptain) }

  if (!hasViceCaptain) return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].required.replace('##', messages[userLanguage].cviceCaptain) }

  if (iCaptainId === iViceCaptainId) return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].same_value_err.replace('##', messages[userLanguage].ccaptain).replace('#', messages[userLanguage].cviceCaptain) }
  // finding sport rules
  const sportsValidation = await sportServices.findSport(match.eCategory)
  if (!sportsValidation) return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].sports_err }

  const { nMaxPlayerOneTeam, nTotalPlayers } = sportsValidation.oRule

  // check team have only nTotalPlayers players
  const matchPlayers = await matchPlayerServices.getMatchPlayers(iMatchId)
  const playerRoles = matchPlayers.filter(({ _id }) => playerId.includes(_id.toString()))

  if (playerRoles.length !== nTotalPlayers) return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].fixed_size_err.replace('##', messages[userLanguage].cplayers).replace('#', nTotalPlayers.toString()) }

  // check teams
  const [homeTeamPlayer, awayTeamPlayer, nTotalCredit] = playerRoles.reduce((acc, p) => {
    if (match.oHomeTeam.iTeamId.toString() === p.iTeamId.toString()) acc[0]++
    else if (match.oAwayTeam.iTeamId.toString() === p.iTeamId.toString()) acc[1]++

    acc[2] = acc[2] + p.nFantasyCredit // find total credit point of team
    return acc
  }, [0, 0, 0])

  if ((homeTeamPlayer > nMaxPlayerOneTeam) || (awayTeamPlayer > nMaxPlayerOneTeam) || (homeTeamPlayer + awayTeamPlayer) !== nTotalPlayers) {
    return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].max_team_player_err.replace('##', nMaxPlayerOneTeam.toString()) }
  }

  if (nTotalCredit > 100) {
    return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].invalid.replace('##', messages[userLanguage].cCredit) }
  }

  const teamName = await UserTeamModel.countDocuments({ iMatchId: ObjectId(iMatchId), iUserId: ObjectId(iUserId), sName })
  // check maxTeam limit of team in match
  let nTotalTeam = await MyMatchesModel.findOne({ iMatchId: ObjectId(iMatchId), iUserId }, { nTeams: 1 }, { readPreference: 'primary' }).lean()
  if (!nTotalTeam) {
    nTotalTeam = { nTeams: 0 }
  } else if (nTotalTeam && !nTotalTeam.nTeams) {
    nTotalTeam.nTeams = 0
  }

  if (!match.nMaxTeamLimit) {
    match.nMaxTeamLimit = 0
  }
  if (match.nMaxTeamLimit && nTotalTeam && ((nTotalTeam.nTeams + 1) > match.nMaxTeamLimit) && !(teamName) && !bIsUpdate) {
    return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].team_join_limit_err }
  }

  // role wise count and check player role is valid
  const playerRoleValid = {}
  const matchPlayerMap = []
  for (const playerRole of playerRoles) {
    const { eRole, _id: iMatchPlayerId, iTeamId } = playerRole
    playerRoleValid[eRole] ? playerRoleValid[eRole]++ : playerRoleValid[eRole] = 1
    matchPlayerMap.push({ iMatchPlayerId, iTeamId })
  }

  const err = roles.find(({ sName, nMax, nMin }) => {
    return (!playerRoleValid[sName] || (playerRoleValid[sName] < nMin) || (playerRoleValid[sName] > nMax))
  })
  if (err) return { isSuccess: false, status: status.BadRequest, message: messages[userLanguage].invalid.replace('##', `${err.sName}`) }
  return { isSuccess: true, nTotalCredit, matchPlayerMap, match }
}

module.exports = validateMatch
