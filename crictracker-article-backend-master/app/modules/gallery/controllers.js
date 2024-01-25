/* eslint-disable no-case-declarations */
const { gallery: GalleryModel } = require('../../model')
const _ = require('../../../global')
const { getPaginationValues } = require('../../utils')

const controllers = {}

controllers.getImages = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)
    const { oFilter } = input
    const query = { eStatus: 'a' }

    const [minimumDate] = await GalleryModel.find(query).hint({ dCreated: -1 }).limit(1).select('dCreated')
    const [maximumDate] = await GalleryModel.find(query).hint({ dCreated: 1 }).limit(1).select('dCreated')

    if (sSearch) Object.assign(query, { $or: [{ sUrl: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sText: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sCaption: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sAttribute: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }] })

    if (oFilter?.dDate) Object.assign(query, { $expr: { $and: [{ $eq: [{ $year: '$dCreated' }, new Date(oFilter.dDate).getFullYear()] }, { $eq: [{ $month: '$dCreated' }, new Date(oFilter.dDate).getMonth() + 1] }] } })

    const nTotal = await GalleryModel.countDocuments(query)
    const aResults = await GalleryModel.find(query).hint({ dCreated: -1 }).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults, oRange: { dMin: minimumDate?.dCreated, dMax: maximumDate?.dCreated } }
  } catch (error) {
    return error
  }
}

controllers.getImage = async (parent, { input }, context) => {
  try {
    const { _id } = input

    const oImageData = await GalleryModel.findById(_id).lean()

    return oImageData
  } catch (error) {
    return error
  }
}

controllers.editImage = async (parent, { input }, context) => {
  try {
    const body = Object.assign({}, input)
    delete body._id
    const image = await GalleryModel.findOne({ _id: input._id })
    const sUrl = await GalleryModel.findOne({ sUrl: input.sUrl })
    if (sUrl) {
      if (sUrl?._id.toString() !== input?._id.toString()) _.throwError('alreadyExists', context, 'image')
    }

    const { decodedToken } = context
    Object.assign(body, { iAuthorId: decodedToken.iAdminId })

    if (!image) _.throwError('notFound', context, 'image')
    await GalleryModel.updateOne({ _id: input._id }, body, { upsert: true })
    return _.resolve('updateSuccess', null, 'image', context)
  } catch (error) {
    return error
  }
}

controllers.deleteImage = async (parent, { input }, context) => {
  try {
    await GalleryModel.updateMany({ _id: { $in: input.aId } }, { eStatus: 'd' })
    return _.resolve('deleteSuccess', null, 'images', context)
  } catch (error) {
    return error
  }
}

controllers.insertImage = async (parent, { input }, context) => {
  try {
    await GalleryModel.insertMany(input)
    return _.resolve('addSuccess', null, 'image', context)
  } catch (error) {
    return error
  }
}

module.exports = controllers
