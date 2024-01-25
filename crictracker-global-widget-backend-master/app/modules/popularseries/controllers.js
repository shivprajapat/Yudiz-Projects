const { PopularSeriesModel } = require('../../model/index')
const { getPaginationValues } = require('../../utils/index')
const _ = require('../../../global')
const { CACHE_7 } = require('../../../config')
// const { redis } = require('../../utils/index')
// const { addCurrentSeriesStream } = redis
const cachegoose = require('cachegoose')
const controllers = {}

// updated by Bipin - 21/4/2022
controllers.addCurrentSeries = async (parent, { input }, context) => {
  try {
    const { oInput } = input

    await PopularSeriesModel.updateMany({}, { eStatus: 'd' })
    for (const ele of oInput) {
      await PopularSeriesModel.updateOne({ iSeriesId: _.mongify(ele?.iSeriesId) }, { ...ele, eStatus: 'a' }, { upsert: true })
    }
    cachegoose.clearCache('currentSeries')
    const aData = await PopularSeriesModel.find({ eStatus: 'a' }).sort({ dUpdated: -1 }).limit(5).lean()

    return _.resolveV2('addSuccess', { aData }, 'currentSeries', context)
  } catch (error) {
    return error
  }
}

controllers.updateCurrentSeries = async (parent, { input }, context) => {
  try {
    const { eStatus, _id } = input

    const oData = await PopularSeriesModel.findByIdAndUpdate(_id, { eStatus }, { new: true }).lean()
    if (!oData) _.throwError('notFound', context, 'currentSeries')
    cachegoose.clearCache('currentSeries')

    return _.resolveV2('updateSuccess', { oData }, 'currentSeries', context)
  } catch (error) {
    return error
  }
}

// updated by Bipin - 21/4/2022
controllers.listCurrentSeries = async (parent, { input }, context) => {
  try {
    let { eStatus } = input
    const { nSkip, nLimit, sorting: oSorting } = getPaginationValues(input)

    eStatus = !eStatus ? ['a', 'i'] : [eStatus]

    const query = { eStatus: { $in: eStatus } }

    const nTotal = await PopularSeriesModel.countDocuments(query)
    const aResults = await PopularSeriesModel.find(query).sort(oSorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

// Front service
controllers.getCurrentPopularSeries = async (parent, { input }, context) => {
  try {
    const aResults = await PopularSeriesModel.find({ eStatus: 'a', nPriority: { $exists: true } }).sort({ nPriority: 1 }).limit(5).lean().cache(CACHE_7, 'currentSeries')

    return { aResults }
  } catch (error) {
    return error
  }
}

module.exports = controllers
