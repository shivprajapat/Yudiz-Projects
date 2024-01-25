const MatchModel = require('../model')
const MatchLeagueModel = require('../../matchLeague/model')
const { handleCatchError } = require('../../../helper/utilities.services')

async function findMatch(call, callback) {
  try {
    const match = await MatchModel.findById(call.request._id).lean()
    const data = match || {}
    callback(null, data)
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

async function findMatchLeague(call, callback) {
  try {
    const matchLeague = await MatchLeagueModel.findById(call.request._id).lean()
    const data = matchLeague || {}
    callback(null, data)
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

module.exports = {
  findMatch,
  findMatchLeague
}
