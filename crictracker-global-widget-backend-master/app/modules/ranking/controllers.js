/* eslint-disable no-useless-escape */
const { iccrankings } = require('../../model')
const { getPaginationValues, redis } = require('../../utils/index')
const { CACHE_10 } = require('../../../config')
const _ = require('../../../global')

const controllers = {}

controllers.getRankings = async (parent, { input }, context) => {
  try {
    const { eRankType, eGender = 'M' } = input
    let { eMatchType } = input

    const { nSkip, nLimit } = getPaginationValues(input)

    if (eMatchType === 'League') eMatchType = 'T20s'

    const query = {
      eRankType,
      eMatchType,
      eGender
    }

    const nTotal = await iccrankings.countDocuments(query).lean()
    if (!nTotal) return { nTotal, aResults: [] }
    const aResults = await iccrankings.find(query).sort('nRank').skip(nSkip).limit(nLimit).cache(CACHE_10, `getRankings:${eRankType}:${eMatchType}:${eGender}:${nLimit}`).lean()
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getPlayerRanking = async (parent, { input }, context) => {
  try {
    const { iPlayerId } = input
    const aRanking = await iccrankings.find({ 'oPlayer.iPlayerId': _.mongify(iPlayerId) }).lean()
    return aRanking
  } catch (error) {
    return error
  }
}

controllers.getTeamRanking = async (parent, { input }, context) => {
  try {
    const { iTeamId } = input
    const aRanking = await iccrankings.find({ 'oTeams.iTeamId': _.mongify(iTeamId) }).lean()
    return aRanking
  } catch (error) {
    return error
  }
}

controllers.getRankingsOverview = async (parent, { input }, context) => {
  try {
    const { eGender, nLimit = 5, eMatchType, eRankType } = input
    const oMatchQuery = {
      eGender,
      nRank: { $lte: nLimit }
    }
    if (eMatchType) Object.assign(oMatchQuery, { eMatchType })
    if (eRankType) Object.assign(oMatchQuery, { eRankType })

    let aResult = await redis.redisclient.get(`getRankingsOverview:${eMatchType}:${eRankType}:${eGender}:${nLimit}`)
    if (aResult) return JSON.parse(aResult)
    aResult = await iccrankings.aggregate([
      {
        $match: oMatchQuery
      }, {
        $group: {
          _id: '$eRankType',
          aRanking: {
            $push: '$$ROOT'
          }
        }
      }, {
        $project: {
          eRank: '$_id',
          aRanking: 1,
          oJersey: 1
        }
      }
    ])

    await redis.redisclient.setex(`getRankingsOverview:${eMatchType}:${eRankType}:${eGender}:${nLimit}`, CACHE_10, JSON.stringify(aResult))
    return aResult
  } catch (error) {
    return error
  }
}

module.exports = controllers
