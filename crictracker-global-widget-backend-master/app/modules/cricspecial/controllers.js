/* eslint-disable no-useless-escape */
const { cricspecials } = require('../../model')
const { getPaginationValues } = require('../../utils/index')
const { CACHE_7 } = require('../../../config')

const controllers = {}

controllers.getCricSpecial = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit } = getPaginationValues(input)

    const query = {}

    const nTotal = await cricspecials.countDocuments(query)

    const aResults = await cricspecials.find(query).sort({ dPublishDate: -1 }).skip(nSkip).limit(nLimit).lean().cache(CACHE_7, 'cricspecial')
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

module.exports = controllers
