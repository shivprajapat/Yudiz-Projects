const _ = require('../../../global/lib/helpers')
const { OversModel } = require('../../model/index')
const { getUserPaginationValues } = require('../../utils')

const controllers = {}

controllers.listMatchOvers = async (parent, { input }, context) => {
  try {
    const { iMatchId, nInningNumber, sOver, isFront } = input

    if (!iMatchId) _.throwError('requiredField', context)
    let query = { iMatchId: _.mongify(iMatchId) }
    if (nInningNumber) query.nInningNumber = nInningNumber

    const { nSkip = 0, nLimit } = getUserPaginationValues(input)

    if (sOver) {
      query.sOver = { $lt: sOver }
    }

    const nTotal = await OversModel.countDocuments(query)
    const data = await OversModel.find(query, { iMatchId: 1, nInningNumber: 1, sOver: 1, aBall: 1, oOver: 1, nOverTotal: { $sum: '$aBall.nRuns' }, dUpdated: 1 })
      .populate([
        { path: 'aBall.oBatter' },
        { path: 'aBall.oBowler' },
        { path: 'aBall.oWicketBatter' },
        { path: 'oOver.aBatters.oBatter' },
        { path: 'oOver.aBowlers.oBowler' }
      ]).sort({ nInningNumber: -1, sOver: -1 }).collation({ locale: 'en_US', numericOrdering: true }).skip(nSkip).limit(nLimit).lean()

    let data2 = []
    if (data.length < nLimit && nInningNumber && sOver && !isFront) {
      // query = { iMatchId: _.mongify(iMatchId), nInningNumber: parseInt(nInningNumber) - 1 }
      query = { iMatchId: _.mongify(iMatchId), nInningNumber: parseInt(nInningNumber) - 1 }
      data2 = await OversModel.find(query, { iMatchId: 1, nInningNumber: 1, sOver: 1, aBall: 1, oOver: 1, nOverTotal: { $sum: '$aBall.nRuns' }, dUpdated: 1 })
        .populate([
          { path: 'aBall.oBatter' },
          { path: 'aBall.oBowler' },
          { path: 'aBall.oWicketBatter' },
          { path: 'oOver.aBatters.oBatter' },
          { path: 'oOver.aBowlers.oBowler' }
        ]).sort({ nInningNumber: -1, sOver: -1 }).collation({ locale: 'en_US', numericOrdering: true }).skip(nSkip).limit(nLimit - data.length).lean()
    }

    const aResults = [...data, ...data2]

    return aResults.length ? { aResults, nTotal } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

module.exports = controllers
