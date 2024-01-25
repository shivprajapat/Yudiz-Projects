const _ = require('../../../global/lib/helpers')
const { CommentariesModel, matchsquad: MatchesSquadModel } = require('../../model/index')
const { getUserPaginationValues } = require('../../utils')

const controllers = {}

controllers.listMatchCommentaries = async (parent, { input }, context) => {
  try {
    const { iMatchId, nInningNumber, sEventId, eHighLight } = input
    const { nSkip = 0, nLimit = 15 } = getUserPaginationValues(input)
    let query

    if (!nInningNumber && sEventId) {
      query = { iMatchId: _.mongify(iMatchId), sEventId: { $lt: sEventId } }
    } else if (!nInningNumber) {
      query = { iMatchId: _.mongify(iMatchId) }
    } else {
      if (!nInningNumber || !sEventId) return []
      query = { iMatchId: _.mongify(iMatchId), nInningNumber: parseInt(nInningNumber), sEventId: { $lt: sEventId } }
    }

    if (eHighLight) {
      if (eHighLight === 'f') Object.assign(query, { sScore: '4' })
      if (eHighLight === 's') Object.assign(query, { sScore: '6' })
      if (eHighLight === 'w') Object.assign(query, { eEvent: 'w' })
    }

    const data = await CommentariesModel.find(query).populate([
      { path: 'oMatch', select: 'sTitle sSubtitle sFormatStr' },
      { path: 'oBatter', select: '_id sTitle sShortName sFullName oImg' },
      { path: 'oBowler', select: '_id sTitle sShortName sFullName oImg ' },
      { path: 'oWicketBatter', select: '_id sTitle sShortName sFullName sThumbUrl oImg' },
      { path: 'aBatters.oBatter', select: 'sTitle sShortName sFullName oImg ' },
      { path: 'aBowlers.oBowler', select: 'sTitle sShortName sFullName oImg ' }
    ]).sort({ nInningNumber: -1, sEventId: -1 }).skip(nSkip).limit(nLimit).collation({ locale: 'en_US', numericOrdering: true }).lean()

    let data2 = []
    if (data.length < nLimit && nInningNumber && sEventId) {
      Object.assign(query, { nInningNumber: parseInt(nInningNumber) - 1 })
      delete query.sEventId
      data2 = await CommentariesModel.find(query).populate([
        { path: 'oMatch', select: 'sTitle sSubtitle sFormatStr' },
        { path: 'oBatter', select: '_id sTitle sShortName sFullName oImg' },
        { path: 'oBowler', select: '_id sTitle sShortName sFullName oImg' },
        { path: 'oWicketBatter', select: '_id sTitle sShortName sFullName sThumbUrl oImg ' },
        { path: 'aBatters.oBatter', select: 'sTitle sShortName sFullName oImg' },
        { path: 'aBowlers.oBowler', select: 'sTitle sShortName sFullName oImg' }
      ]).sort({ nInningNumber: -1, sEventId: -1 }).skip(nSkip).limit(nLimit - data.length).collation({ locale: 'en_US', numericOrdering: true }).lean()
    }

    const result = [...data, ...data2]

    const aMatchSquad = await MatchesSquadModel.find({ iMatchId, bPlaying11: true }).populate({ path: 'oTeam', select: 'oJersey' }).lean()

    for (const oCommentary of result) {
      if (oCommentary?.oWicketBatter) Object.assign(oCommentary.oWicketBatter, { oPlayingTeam: aMatchSquad.find(oMatchSquad => _.isEqualId(oMatchSquad?.iPlayerId, oCommentary?.oWicketBatter?._id))?.oTeam })
    }

    return result
  } catch (error) {
    return error
  }
}

module.exports = controllers
