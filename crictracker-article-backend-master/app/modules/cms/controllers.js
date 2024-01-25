const { CMSModel } = require('../../model/index')
const { getPaginationValues } = require('../../utils')
const _ = require('../../../global')
const controllers = {}
const { CACHE_2 } = require('../../../config')
const { fixBrokenLinksWithAmp } = require('../Common/controllers')
const cachegoose = require('cachegoose')
const grpcControllers = require('../../grpc/client')

controllers.addCMSPage = async (parent, { input }, context) => {
  try {
    const { oInput } = input
    const body = _.pick(oInput, ['sTitle', 'sContent'])

    if (!body.sTitle || !body.sContent) _.throwError('requiredField', context)

    // if (body?.sContent) body.sAmpContent = await convertAmp(body?.sContent)
    if (body?.sContent?.trim()) {
      body.sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)
    } else {
      body.sAmpContent = ''
    }

    const oData = await CMSModel.create(body)

    return _.resolve('addSuccess', { oData }, 'cmsPage', context)
  } catch (error) {
    return error
  }
}

controllers.editCMSPage = async (parent, { input }, context) => {
  try {
    const { _id, oInput } = input
    const body = _.pick(oInput, ['sTitle', 'sContent'])

    // if (body?.sContent) body.sAmpContent = await convertAmp(body?.sContent)
    if (body?.sContent?.trim()) {
      body.sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)
    } else {
      body.sAmpContent = ''
    }

    const oData = await CMSModel.findByIdAndUpdate(_id, body, { new: true, runValidators: true }).lean()
    if (!oData) _.throwError('notFound', context, 'cmsPage')
    cachegoose.clearCache(`cms:${_id}`)

    return _.resolve('updateSuccess', { oData }, 'cmsPage', context)
  } catch (error) {
    return error
  }
}

controllers.bulkUpdateCMSPage = async (parent, { input }, context) => {
  try {
    const { eStatus } = input
    let { aId } = input
    aId = aId.map(id => _.mongify(id))

    const oData = await CMSModel.updateMany({ _id: aId }, { eStatus })
    if (!oData.modifiedCount) _.throwError('notFound', context, 'cmsPage')
    for (const id of aId) {
      await grpcControllers.updateEntitySeo({ iId: id, eStatus })
      // queuePush('updateEntitySeo', { iId: id, eStatus })
      cachegoose.clearCache(`cms:${id}`)
    }

    return _.resolve('updateSuccess', null, 'cmsPage', context)
  } catch (error) {
    return error
  }
}

controllers.listCMSPage = async (parent, { input }, context) => {
  try {
    let { eStatus } = input
    const { nSkip, nLimit, sorting: oSorting, sSearch } = getPaginationValues(input)

    eStatus = !eStatus ? ['a', 'i'] : [eStatus]

    const nTotal = await CMSModel.countDocuments({
      $or: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $in: eStatus }
    })
    const aResults = await CMSModel.find({
      $or: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $in: eStatus }
    }).sort(oSorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getCMSPageById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)

    const data = await CMSModel.findById(input._id).lean()
    if (!data) _.throwError('notFound', context, 'cmsPage')

    return data
  } catch (error) {
    return error
  }
}

controllers.getUserCMSPage = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)

    const data = await CMSModel.findOne({ _id: input._id, eStatus: 'a' }, { eStatus: 0 }).lean().cache(CACHE_2, `cms:${input._id}`)
    if (!data) _.throwError('notFound', context, 'cmsPage')

    return data
  } catch (error) {
    return error
  }
}

controllers.listUserCMSPage = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting: oSorting, sSearch } = getPaginationValues(input)

    const aResults = await CMSModel.find({
      $or: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: 'a'
    }).sort(oSorting).skip(nSkip).limit(nLimit).lean()

    return aResults
  } catch (error) {
    return error
  }
}

module.exports = controllers
