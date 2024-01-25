/* eslint-disable no-useless-escape */
const { SeoRedirectModel, SeoModel } = require('../../model')
const { getPaginationValues } = require('../../utils/index')
const { eSeoRedirectType } = require('../../model/enums')
const _ = require('../../../global')

const controllers = {}

controllers.addSeoRedirect = async (parent, { input }, context) => {
  try {
    const { oInput } = input
    const body = _.pick(oInput, ['sOldUrl', 'sNewUrl', 'eCode', 'eSeoType'])
    const { sOldUrl, sNewUrl, eCode, eSeoType } = body

    if ((!sNewUrl && (eCode !== 410 || eCode !== 451)) || !sOldUrl || !eCode) _.throwError('requiredField', context)

    if (!eSeoRedirectType.value.includes(eCode)) _.throwError('invalid', context, 'statusCode')
    if (eCode !== 410 && _.isSlug(sNewUrl)) _.throwError('invalid', context, 'newUrl')

    const findQuery = { sSlug: sOldUrl, eStatus: 'a' }
    if (eSeoType) findQuery.eSeoType = eSeoType

    const seo = await SeoModel.findOne(findQuery, { iId: 1, eType: 1, eSubType: 1 }).lean()
    if (!seo) _.throwError('notFound', context, 'seo')

    if (sOldUrl === sNewUrl) _.throwError('cantSameUrl', context)

    if (!eSeoType) oInput.eSeoType = seo.eType
    if (seo?.eType !== 'cu') oInput.iId = seo.iId
    else oInput.iId = seo._id

    if (seo.eSubType) oInput.eSubType = seo.eSubType
    else oInput.eSubType = null

    const seoRedirect = await SeoRedirectModel.create(oInput)
    const aSeoRIds = [seoRedirect._id]

    const updateQuery = { sSlug: sNewUrl, aSeoRIds, sCUrl: sNewUrl }

    if (eCode === 410 || eCode === 451) Object.assign(updateQuery, { bGone: true })
    await SeoModel.updateOne({ _id: seo._id }, updateQuery, { readPreference: 'primary' })

    return _.resolve('addSuccess', { oData: {} }, 'redirect', context)
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.editSeoRedirect = async (parent, { input }, context) => {
  try {
    const { _id, oInput } = input
    const body = _.pick(oInput, ['sOldUrl', 'sNewUrl', 'eCode', 'eSeoType', 'eStatus'])

    if (body?.eCode && !eSeoRedirectType.value.includes(body.eCode)) _.throwError('invalid', context, 'statusCode')
    if (body?.sNewUrl && _.isSlug(body.sNewUrl)) _.throwError('invalid', context, 'newUrl')

    if (body?.sOldUrl && body?.sNewUrl && (body.sOldUrl === body.sNewUrl)) _.throwError('cantSameUrl', context)

    /*
    if (body?.sNewUrl) {
      const findQuery = { sSlug: body?.sNewUrl, eStatus: 'a' }
      if (body?.eSeoType) findQuery.eSeoType = body.eSeoType

      const seo = await SeoModel.findOne(findQuery, { iId: 1, eType: 1 }).lean()
      if (!seo) _.throwError('notFound', context, 'seo')

      if (!body.eSeoType) body.eSeoType = seo.eType
    }
    */

    const redirect = await SeoRedirectModel.findOne({ _id }, { sNewUrl: 1, _id: 1 }, { readPreference: 'primary' }).lean()
    if (!redirect) _.throwError('notFound', context, 'redirect')

    body.iId = redirect.iId
    const newRedirect = await SeoRedirectModel.findOneAndUpdate({ _id }, { ...body }, { new: true, readPreference: 'primary' }).lean()
    if (redirect?.sNewUrl !== newRedirect?.sNewUrl || body?.eCode === 410 || body?.eCode === 451) {
      const updateObj = { sSlug: newRedirect?.sNewUrl }
      if (body?.eCode === 410 || body?.eCode === 451) Object.assign(updateObj, { bGone: true })
      await SeoModel.updateOne({ iId: newRedirect?.iId }, updateObj, { readPreference: 'primary' })
    }

    return _.resolve('updateSuccess', { oData: newRedirect }, 'redirect', context)
  } catch (error) {
    return error
  }
}

controllers.getSeoRedirect = async (parent, { input }, context) => {
  try {
    let { aCode } = input
    const { nSkip, nLimit, oSorting, sSearch } = getPaginationValues(input)
    aCode = !aCode.length ? eSeoRedirectType.value : aCode

    const nTotal = await SeoRedirectModel.countDocuments({
      $or: [
        { sOldUrl: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sNewUrl: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $ne: 'd' },
      eCode: { $in: aCode }
    })
    const data = await SeoRedirectModel.find({
      $or: [
        { sOldUrl: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sNewUrl: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $ne: 'd' },
      eCode: { $in: aCode }
    }).sort(oSorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults: data }
  } catch (error) {
    return error
  }
}

controllers.getSeoRedirectById = async (parent, { input }, context) => {
  try {
    if (!input || !input?._id) _.throwError('requiredField', context)

    const seoRedirect = await SeoRedirectModel.findById(input._id, {}, { readPreference: 'primary' }).lean()
    if (!seoRedirect) _.throwError('notFound', context, 'redirect')

    return seoRedirect
  } catch (error) {
    return error
  }
}

controllers.bulkSeoRedirectUpdate = async (parent, { input }, context) => {
  try {
    const { aId, eStatus } = input
    const ids = aId.map(id => _.mongify(id))

    const redirect = await SeoRedirectModel.updateMany({ _id: { $in: ids } }, { eStatus }, { readPreference: 'primary' })
    if (!redirect.modifiedCount) _.throwError('notFound', context, 'redirect')

    return _.resolve('updateSuccess', null, 'redirect', context)
  } catch (error) {
    return error
  }
}

controllers.bulkSeoRedirectUpdateV2 = async (parent, { input }, context) => {
  try {
    const { aId, eStatus } = input
    const ids = aId.map(id => _.mongify(id))

    const redirect = await SeoRedirectModel.updateMany({ _id: { $in: ids } }, { eStatus }, { new: true, readPreference: 'primary' })
    if (!redirect.modifiedCount) _.throwError('notFound', context, 'redirect')

    if (eStatus === 'd') {
      const currentRedirect = await SeoRedirectModel.find({ _id: { $in: ids } }, { _id: 1, sNewUrl: 1, iId: 1, eSeoType: 1 }, { readPreference: 'primary' }).lean()

      for (const rd of currentRedirect) {
        const { _id, iId, eSeoType, sNewUrl } = rd
        const updateObj = { sSlug: sNewUrl, $pull: { aSeoRIds: [_id] } }
        if (eSeoType !== 'cu') updateObj.iId = iId

        await SeoModel.updateOne({ sSlug: sNewUrl, eType: eSeoType }, updateObj, { readPreference: 'primary' }).lean()
      }
    }

    return _.resolve('updateSuccess', null, 'redirect', context)
  } catch (error) {
    return error
  }
}

module.exports = controllers
