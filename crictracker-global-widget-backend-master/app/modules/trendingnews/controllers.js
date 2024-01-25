/* eslint-disable no-useless-escape */
const { trendingnews } = require('../../model')
const { getPaginationValues } = require('../../utils/index')
const { CACHE_2, CACHE_10 } = require('../../../config')
const controllers = {}

// deprecated
controllers.getTrendingNews = async (parent, { input }, context) => {
  try {
    const { nLimit: limit = 3 } = input
    input.nLimit = limit
    const { nSkip, nLimit } = getPaginationValues(input)
    const query = {}

    const nTotal = await trendingnews.countDocuments(query)
    const aResults = await trendingnews.find(query).sort({ dCreated: 1 }).skip(nSkip).limit(nLimit).lean().cache(CACHE_10, `trendingNews${nLimit}`)
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getTrendingNewsV2 = async (parent, { input }, context) => {
  try {
    const aResults = await trendingnews.find({}).sort({ dCreated: 1 }).lean().cache(CACHE_2, 'getTrendingNews')
    return { aResults }
  } catch (error) {
    return error
  }
}

module.exports = controllers
