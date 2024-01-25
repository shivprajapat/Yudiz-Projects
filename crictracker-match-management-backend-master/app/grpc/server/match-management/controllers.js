const controllers = {}
const moment = require('moment')
const { series: SeriesModel, matches: MatchModel, fantasyarticles: FantasyArticleModel } = require('../../../model')
const { scheduleMatchTask } = require('../../../utils/lib/matchScheduler')
const { queuePush } = require('../../../utils')
const _ = require('../../../../global/lib/helpers')
const { categorySeoBuilder } = require('../../../utils/lib/seoBuilder')
const { getPlayerIdFromKey, getTeamIdFromKey } = require('../../../modules/match/common')

controllers.seriesCategoryOperations = async ({ request }, cb) => {
  try {
    if (request) {
      const seriesParams = JSON.parse(request.seriesParams)
      if (seriesParams.sSrtTitle) await SeriesModel.updateOne({ _id: seriesParams.iId }, { sSrtTitle: seriesParams.sSrtTitle })
      const series = await SeriesModel.findOne({ _id: seriesParams.iId }).lean()

      scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: series.sSeriesKey, _id: series._id } }, moment().add('5', 'minutes').unix())

      if (seriesParams?.bIsLeague && typeof seriesParams?.bIsLeague === 'boolean') await SeriesModel.updateOne({ _id: seriesParams.iId }, { bIsLeague: seriesParams?.bIsLeague })

      if (seriesParams?.eOpType === 'seriesIdUpdated') {
        const { oldIId, newIId, iId, category: { _id: iCategoryId }, category } = seriesParams
        if (oldIId && newIId && iCategoryId) {
          await SeriesModel.updateOne({ _id: _.mongify(oldIId) }, { eCategoryStatus: 'p', $unset: { iCategoryId: 1 } })
          await SeriesModel.updateOne({ _id: _.mongify(newIId) }, { eCategoryStatus: 'a', iCategoryId: _.mongify(iCategoryId) })
          queuePush('seriesRedirection', { iSeriesId: oldIId, iNewSeriesId: newIId, iId: iCategoryId, eType: 'e' })
        } else if (iId && iCategoryId) {
          await SeriesModel.updateOne({ _id: _.mongify(iId) }, { eCategoryStatus: 'a', iCategoryId: _.mongify(iCategoryId) })
          queuePush('seriesRedirection', { iSeriesId: iId, iId: iCategoryId, eType: 'a' })
        }

        // SeriesSeoWillBeInitializedHere
        await categorySeoBuilder(series, category)
      }

      if (seriesParams?.eOpType === 'seriesDeleted') {
        const { iId, category: { _id: iCategoryId } } = seriesParams

        if (iId) {
          await SeriesModel.updateOne({ _id: _.mongify(iId) }, { eCategoryStatus: 'p', $unset: { iCategoryId: 1 } })
          queuePush('seriesRedirection', { iSeriesId: iId, iId: iCategoryId, eType: 'd' })
        }
      }
      cb(null, { nStatus: 200, sMessage: 'success' })
    }
  } catch (error) {
    console.log(error)
    cb(null, { nStatus: 500, sMessage: 'wentWrong' })
  }
}

controllers.assignLiveEventId = async ({ request }, cb) => {
  try {
    if (!request?.iMatchId) {
      const res = await MatchModel.findOneAndUpdate({ iEventId: request?.iEventId }, { $unset: { iEventId: 1 } }).lean()
      if (!res) return cb(null, { nStatus: 404, sMessage: 'notFound' })
    } else {
      const res = await MatchModel.findByIdAndUpdate(request?.iMatchId, { $set: { iEventId: request?.iEventId } }).lean()
      if (!res) return cb(null, { nStatus: 404, sMessage: 'notFound' })
    }
    cb(null, { nStatus: 200, sMessage: 'OK' })
  } catch (error) {
    console.log(error)
    cb(null, { nStatus: 500, sMessage: 'wentWrong' })
  }
}

controllers.fantasyArticleValidation = async ({ request }, cb) => {
  try {
    const existingFantasyArticle = await FantasyArticleModel.findOne({ _id: request?.iArticleId, eState: 'pub' }).lean()
    if (!existingFantasyArticle) return cb(null, { nStatus: 404, sMessage: 'notFound' })
    cb(null, { nStatus: 200, sMessage: 'OK' })
  } catch (error) {
    cb(null, { nStatus: 500, sMessage: 'wentWrong' })
  }
}

controllers.getPlayerByKey = async ({ request }, cb) => {
  try {
    const oPlayer = await getPlayerIdFromKey(request?.sPlayerKey, null, 'details')
    if (!oPlayer) return cb(null, {})
    Object.assign(oPlayer, { iPlayerId: oPlayer?._id })
    Object.assign(oPlayer, { oJersey: oPlayer?.oPrimaryTeam?.oJersey })
    delete oPlayer._id
    delete oPlayer?.oPrimaryTeam
    return cb(null, oPlayer)
  } catch (error) {
    console.log({ error })
    return cb(null, {})
  }
}

controllers.getTeamByKey = async ({ request }, cb) => {
  try {
    const oTeam = await getTeamIdFromKey(request?.sTeamKey, 'details')
    if (!oTeam?._id) return cb(null, {})

    Object.assign(oTeam, { iTeamId: oTeam?._id })
    return cb(null, oTeam)
  } catch (error) {
    console.log({ error })
    return cb(null, {})
  }
}

module.exports = controllers
