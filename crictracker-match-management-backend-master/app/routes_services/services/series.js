const { ObjectId } = require('mongoose').Types
const moment = require('moment')
const axios = require('axios')

const { series: SeriesModel } = require('../../model')
const { scheduleMatchTask } = require('../../utils/lib/matchScheduler')
const { categorySeoBuilder } = require('../../utils/lib/seoBuilder')
const { SEO_REST_URL } = require('../../../config')

class Series {
  async seriesCategoryOperations(req, res) {
    try {
      if (req) {
        const { sSrtTitle, iId, bIsLeague, eOpType, isBlockedMini } = req.body
        const query = { sSrtTitle }
        if (typeof isBlockedMini === 'boolean') Object.assign(query, { isBlockedMini: isBlockedMini })

        if (sSrtTitle) await SeriesModel.updateOne({ _id: iId }, query)
        const series = await SeriesModel.findOne({ _id: iId }).lean()

        scheduleMatchTask({ eType: 'standings', data: { sSeriesKey: series.sSeriesKey, _id: series._id } }, moment().add('5', 'minutes').unix())

        if (bIsLeague && typeof bIsLeague === 'boolean') await SeriesModel.updateOne({ _id: iId }, { bIsLeague: bIsLeague })

        if (eOpType === 'seriesIdUpdated') {
          const { oldIId, newIId, iId, category: { _id: iCategoryId }, category } = req.body
          if (oldIId && newIId && iCategoryId) {
            await SeriesModel.updateOne({ _id: new ObjectId(oldIId) }, { eCategoryStatus: 'p', $unset: { iCategoryId: 1 } })
            await SeriesModel.updateOne({ _id: new ObjectId(newIId) }, { eCategoryStatus: 'a', iCategoryId: new ObjectId(iCategoryId) })

            axios.post(`${SEO_REST_URL}api/series-seo-redirection`, { iSeriesId: oldIId, iNewSeriesId: newIId, iId: iCategoryId, eType: 'e' }, { headers: { 'Content-Type': 'application/json' } })
            return res.status(200).jsonp({ status: 200, message: 'Series Category operations managed' })
          } else if (iId && iCategoryId) {
            await SeriesModel.updateOne({ _id: new ObjectId(iId) }, { eCategoryStatus: 'a', iCategoryId: new ObjectId(iCategoryId) })

            await axios.post(`${SEO_REST_URL}api/series-seo-redirection`, { iSeriesId: iId, iId: iCategoryId, eType: 'a' }, { headers: { 'Content-Type': 'application/json' } })
          }

          // SeriesSeoWillBeInitializedHere
          categorySeoBuilder(series, category)
          return res.status(200).jsonp({ status: 200, message: 'Series Category operations managed' })
        }

        if (eOpType === 'seriesDeleted') {
          const { iId, category: { _id: iCategoryId } } = req.body

          if (iId) {
            await SeriesModel.updateOne({ _id: new ObjectId(iId) }, { eCategoryStatus: 'p', $unset: { iCategoryId: 1 } })

            await axios.post(`${SEO_REST_URL}api/series-seo-redirection`, { iSeriesId: iId, iId: iCategoryId, eType: 'd' }, { headers: { 'Content-Type': 'application/json' } })
            return res.status(200).jsonp({ status: 200, message: 'Series Category operations managed' })
          }
        }
      }
    } catch (error) {
      return res.status(500).jsonp({ status: 500, message: 'Something went wrong', data: {} })
    }
  }
}

module.exports = new Series()
