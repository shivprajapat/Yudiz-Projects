const { SliderModel } = require('../../model')
const { getPaginationValues } = require('../../utils/index')
const _ = require('../../../global')
const cachegoose = require('cachegoose')
const { CACHE_8 } = require('../../../config')
const controllers = {}

controllers.addSlider = async (parent, { input }, context) => {
  try {
    await SliderModel.deleteMany({})
    cachegoose.clearCache('sliderMenu')

    await SliderModel.insertMany(input)
    await SliderModel.find({ eStatus: 'a' }).sort({ nPriority: 1 }).lean().cache(CACHE_8, 'sliderMenu')
    return 'Slider menu updated successfully'
  } catch (error) {
    return error
  }
}

controllers.getSlider = async (parent, { input }, context) => {
  try {
    let { eStatus } = input

    const { nSkip, nLimit, oSorting, sSearch } = getPaginationValues(input)

    if (eStatus && eStatus === 'd') _.throwError('invalid', context, 'status')
    eStatus = !eStatus ? ['a', 'i'] : [eStatus]

    const nTotal = await SliderModel.countDocuments({
      $or: [
        { sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sSlug: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $in: eStatus }
    })

    const aResults = await SliderModel.find({
      $or: [
        { sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sSlug: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $in: eStatus }
    }).sort(oSorting).skip(nSkip).limit(nLimit).lean().cache(CACHE_8, 'sliderMenu')

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getSliderById = async (parent, { input }, context) => {
  try {
    const oData = await SliderModel.findById(input._id).lean()
    if (!oData) _.throwError('notFound', context, 'slider')

    return oData
  } catch (error) {
    return error
  }
}

controllers.bulkSliderUpdate = async (parent, { input }, context) => {
  try {
    const { eStatus } = input
    let { aId } = input
    aId = aId.map(id => _.mongify(id))

    const oData = await SliderModel.updateMany({ _id: aId }, { eStatus })
    if (!oData.modifiedCount) _.throwError('notFound', context, 'slider')
    cachegoose.clearCache('sliderMenu')

    return _.resolveV2('updateSuccess', null, 'slider', context)
  } catch (error) {
    return error
  }
}

controllers.getFrontSlider = async (parent, { input }, context) => {
  try {
    const data = await SliderModel.find({ eStatus: 'a' }, { eStatus: 0, dCreated: 0, dUpdated: 0 }).sort({ nPriority: 1 }).lean().cache(CACHE_8, 'sliderMenu')

    return data
  } catch (error) {
    return error
  }
}

module.exports = controllers
