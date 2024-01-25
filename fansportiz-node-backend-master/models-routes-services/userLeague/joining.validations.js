const promocodeServices = require('../promocode/services')
const { handleCatchError } = require('../../helper/utilities.services')
const { messages } = require('../../helper/api.responses')
const LeagueCategoryModel = require('../leagueCategory/model')
const UserLeagueModel = require('./model')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const UserTeamModel = require('../userTeam/model')

// this function validates match promocode while adding a userleague
async function promocodeValidation(sPromo, iMatchLeagueId, nTotalTeam, iUserId, lang) {
  let validationResult = {
    data: {}
  }

  if (sPromo && sPromo.length) {
    try {
      const data = { sPromo, iMatchLeagueId, nTeamCount: nTotalTeam, iUserId, lang }
      validationResult = await promocodeServices.validateMatchPromocode(data)
      return validationResult
    } catch (error) {
      const { status: s = '', message = '' } = error
      if (!s) { handleCatchError(error) }
      return { isSuccess: false, message }
    }
  }
}

async function userValidations(bInternalUserFlag, bPrivateLeague, bInternalLeague, userLanguage, iLeagueCatId) {
  const response = {
    isSuccess: false, message: messages[userLanguage].league_join_err
  }
  if (bInternalUserFlag === true) {
    if (bPrivateLeague === false) {
      const hiddenLeague = await LeagueCategoryModel.findOne({ _id: iLeagueCatId, sKey: 'hiddenLeague' }, { _id: 1, sKey: 1 }).lean()
      if (!hiddenLeague) response.message = messages[userLanguage].public_league_join_err
      response.message = messages[userLanguage].public_league_join_err
      return response
    } else if (bPrivateLeague === true && bInternalLeague === false) {
      return response
    }
  } else {
    if (bInternalLeague === true) {
      return response
    }
  }
}

function matchLeagueValidations(upcomingMatch, matchLeague, multiTeam, nTotalTeam, userLanguage) {
  const response = { isSuccess: false }
  if (!upcomingMatch) {
    response.message = messages[userLanguage].match_started
    return response
  }
  if (!matchLeague.bMultipleEntry && (nTotalTeam > matchLeague.nTeamJoinLimit || multiTeam > 0)) {
    response.message = messages[userLanguage].multiple_join_err
    return response
  }
  if ((matchLeague.nTeamJoinLimit <= multiTeam || nTotalTeam > matchLeague.nTeamJoinLimit || (nTotalTeam + multiTeam) > matchLeague.nTeamJoinLimit) && !matchLeague.bPrivateLeague) {
    response.message = messages[userLanguage].team_join_limit_err
    return response
  }
}

async function validateUserTeamForLeague(data) {
  let teams = []
  let remainTeams = []
  const { aUserTeamId, nTotalTeam, matchLeague, iUserId, aErrors, userLanguage } = data
  if (Array.isArray(aUserTeamId)) {
    teams = aUserTeamId.filter(team => !teams.includes(team))
    teams = teams.map(team => ObjectId(team))

    if (nTotalTeam > teams) {
      aErrors.push(messages[userLanguage].not_exist.replace('##', messages[userLanguage].cteam))
    }
    const [teamAlreadyJoin, team] = await Promise.all([
      UserLeagueModel.find({ iMatchLeagueId: matchLeague._id, iUserId, iUserTeamId: { $in: teams } }, {}, { readPreference: 'primaryPreferred' }).lean(), // check for multi join
      UserTeamModel.find({ iMatchId: matchLeague.iMatchId, _id: { $in: teams }, iUserId }, {}, { readPreference: 'primaryPreferred' }).lean()
    ])
    remainTeams = teams.filter(team => {
      return !(teamAlreadyJoin.some(joinedTeam => joinedTeam.iUserTeamId.toString() === team.toString()))
    })
    if (nTotalTeam > remainTeams.length) {
      aErrors.push(messages[userLanguage].user_already_joined)
    }

    if (remainTeams.length > team) {
      aErrors.push(messages[userLanguage].not_exist.replace('##', messages[userLanguage].cteam))
    }
    remainTeams = team.map(({ _id, sName }) => ({ iUserTeamId: _id, sName }))
  }
  return remainTeams
}
module.exports = {
  promocodeValidation,
  userValidations,
  matchLeagueValidations,
  validateUserTeamForLeague
}
