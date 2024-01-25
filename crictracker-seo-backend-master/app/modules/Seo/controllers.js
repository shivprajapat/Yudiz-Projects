/* eslint-disable no-useless-escape */
const _ = require('../../../global')
const { SeoModel, SeoRedirectModel } = require('../../model')
const { s3 } = require('../../utils')
const controllers = {}
const { getPaginationValues } = require('../../utils/index')
const { generateSlugFun, fixBrokenLinksWithAmp } = require('./common')

controllers.generateSlugs = async (parent, { input }, context, info) => {
  try {
    const body = _.pick(input, ['sSlug'])
    if (!body.sSlug) return _.throwError('requiredField', context)

    const generatedSlug = await generateSlugFun(body.sSlug)

    if (!generatedSlug) _.throwError('somethingWentWrong', context)
    if (generatedSlug && body.sSlug === generatedSlug) return _.resolve('slugGenerateSuccess', { oData: { bIsExists: false } }, null, context)
    else return _.resolve('slugGenerateSuccess', { oData: { sSlug: generatedSlug, bIsExists: true } }, null, context)
  } catch (error) {
    return error
  }
}

controllers.insertSeo = async (parent, { input }, context) => {
  try {
    //   eType = ['ar', 'ad', 'ct', 'gt','mo]
    //   gt = Tags, ct = Category, ar = Article, ad = admin , mo = match overview
    const body = _.pick(input, ['iId', 'sTitle', 'sDescription', 'sSlug', 'aKeywords', 'oFB', 'oTwitter', 'sCUrl', 'sRobots', 'eType'])
    if (!body.iId) _.throwError('formFieldInvalid', context, 'id')
    let seoData
    const findSlug = await SeoModel.findOne({ sSlug: body.sSlug, eStatus: { $ne: 'd' } })
    if (findSlug) {
      if (findSlug.iId.toString() !== body.iId.toString()) _.throwError('alreadyExists', context, 'slug')
    }
    if (Object.keys(body).length !== 0 && body.constructor === Object) {
      seoData = await SeoModel.findOneAndUpdate({ iId: _.mongify(body.iId) }, body, { new: true, upsert: true })
      return _.resolve('addSuccess', { oData: seoData }, 'seo', context)
    }
  } catch (error) {
    return error
  }
}

controllers.editSeo = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iId', 'sTitle', 'sDescription', 'aKeywords', 'oFB', 'oTwitter', 'sCUrl', 'sRobots', 'sSlug', 'eType', 'eStatus', 'eSchemaType', 'bIsDeletable', 'eSubType', 'sContent', 'sDTitle'])
    if (!body.iId) _.throwError('formFieldInvalid', context, 'id')
    const findSeo = await SeoModel.findOne({ sSlug: body.sSlug, eStatus: { $ne: 'd' } })
    if (findSeo) {
      if (findSeo?.iId?.toString() !== body?.iId?.toString()) _.throwError('alreadyExists', context, 'slug')
    }

    const updateQuery = {
      iId: _.mongify(body.iId),
      eType: { $ne: 'cu' }
    }

    if (body.eType) Object.assign(updateQuery, { eType: body.eType })
    if (body.eSubType) Object.assign(updateQuery, { eSubType: body.eSubType })
    if (!body.eSubType || body.eSubType === null) Object.assign(updateQuery, { eSubType: null })
    if (body.sContent) {
      const sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)
      Object.assign(body, { sAmpContent })
    }

    let seo
    if (Object.keys(body).length !== 0 && body.constructor === Object) {
      seo = await SeoModel.findOneAndUpdate(updateQuery, body, { upsert: true, new: true }).lean()
      return _.resolve('updateSuccess', { oData: seo }, 'seo', context)
    }
    if (body.oFB?.sUrl) {
      const seo = await SeoModel.findOne({ iId: _.mongify(body.iId) }).lean()
      if (seo?.oFB?.sUrl) if (body.oFB.sUrl !== seo.oFB.sUrl) s3.deleteObject(seo.oFB.sUrl)
    } else {
      const seo = await SeoModel.findOne({ iId: _.mongify(body.iId) }).lean()
      if (seo?.oFB?.sUrl) s3.deleteObject(seo.oFB.sUrl)
    }

    if (body.oTwitter?.sUrl) {
      const seo = await SeoModel.findOne({ iId: _.mongify(body.iId) }).lean()
      if (seo?.oTwitter?.sUrl) if (body.oTwitter.sUrl !== seo?.oTwitter?.sUrl) s3.deleteObject(seo.oTwitter.sUrl)
    } else {
      const seo = await SeoModel.findOne({ iId: _.mongify(body.iId) }).lean()
      if (seo?.oTwitter?.sUrl) s3.deleteObject(seo.oTwitter.sUrl)
    }
  } catch (error) {
    return error
  }
}

controllers.getSeo = async (iId, eSubType) => {
  try {
    const seo = await SeoModel.findOne({ iId: _.mongify(iId), eType: { $ne: 'cu' }, eSubType }).lean()
    const aCustomSeo = await SeoModel.find({ iId: _.mongify(iId), $or: [{ eType: 'cu' }, { eTabType: { $exists: true } }] })
    if (aCustomSeo.length) Object.assign(seo, { aCustomSeo })
    return seo
  } catch (error) {
    return error
  }
}

controllers.getSeos = async (iId) => {
  try {
    const seos = await SeoModel.find({ iId: _.mongify(iId), eStatus: 'a' }).lean()

    const findSeo = await SeoModel.findOne({ iId: _.mongify(iId), eStatus: 'a' }).lean()

    if (findSeo?.eType === 'ma' && seos.some((ele) => ele.iSeriesId)) {
      const seriesStandingsSeo = await SeoModel.findOne({ iId: _.mongify(seos[seos.findIndex((ele) => ele.iSeriesId)]?.iSeriesId), eStatus: 'a', eSubType: 's' }).lean()
      if (seriesStandingsSeo) seos.push(seriesStandingsSeo)
    }
    return { iId, oSeo: seos }
  } catch (error) {
    return error
  }
}

controllers.changeSeoPicture = async (parent, { input }, context) => {
  try {
    const { eType, eSeoType, sUrl, _id } = input
    let query = {}
    let updateQuery = {}
    query = {
      iId: _.mongify(_id),
      eStatus: { $ne: 'd' },
      eType: eSeoType
    }
    if (eType === 'fb') {
      updateQuery = {
        'oFb.sUrl': sUrl
      }
    } else {
      updateQuery = {
        'oTwitter.sUrl': sUrl
      }
    }
    const update = await SeoModel.findOneAndUpdate(query, updateQuery)
    if (update) return _.resolve('updateSuccess', null, eType === 'fb' ? 'fb' : 'tw', context)
    return _.throwError('notFound', context, 'seo')
  } catch (error) {
    return error
  }
}

// SEO management ...
controllers.addSeo = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sTitle', 'sDescription', 'sSlug', 'aKeywords', 'oFB', 'oTwitter', 'sCUrl', 'sRobots'])

    body.eType = 'cu'
    const seoData = await SeoModel.create(body)

    return _.resolve('addSuccess', { oData: seoData }, 'seo', context)
  } catch (error) {
    return error
  }
}

controllers.updateSeo = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sTitle', 'sDescription', 'aKeywords', 'oFB', 'oTwitter', 'sCUrl', 'sRobots', 'sSlug', 'eSchemaType', 'bIsDeletable'])
    const { decodedToken } = context

    let seo
    if (Object.keys(body).length !== 0 && body.constructor === Object) {
      body.iUpdatedBy = _.mongify(decodedToken.iAdminId)
      seo = await SeoModel.findOneAndUpdate({ sSlug: body?.sSlug, eType: { $in: ['cu', 'st'] }, eStatus: { $ne: 'd' } }, body, { upsert: true, new: true }).lean()
      return _.resolve('updateSuccess', { oData: seo }, 'seo', context)
    }
    return _.resolve('updateSuccess', { oData: {} }, 'seo', context)
  } catch (error) {
    return error
  }
}

controllers.getSeoBySlug = async (parent, { input }, context) => {
  try {
    const { sSlug } = input

    const seo = await SeoModel.findOne({ sSlug, eStatus: { $ne: 'd' } }).lean()
    if (!seo) _.throwError('notFound', context, 'seo')

    return seo
  } catch (error) {
    return error
  }
}

controllers.getSeosBySlug = async (parent, { input }, context) => {
  try {
    const { sSlug, iId } = input

    const query = sSlug ? { sSlug, eStatus: 'a' } : { iId: _.mongify(iId), eStatus: 'a' }

    let findSeo = await SeoModel.findOne(query).lean()

    if (!findSeo || findSeo?.isGone) {
      const getSlug = await SeoRedirectModel.findOne({ sOldUrl: sSlug, eStatus: 'a' }).lean()
      if (!getSlug) return _.throwError('notFound', context, 'slug')
      const query = { eStatus: 'a' }
      if (getSlug.eSeoType === 'cu') findSeo = await SeoModel.findOne({ _id: _.mongify(getSlug.iId), ...query }).lean()
      else findSeo = await SeoModel.findOne({ iId: _.mongify(getSlug.iId), ...query }).lean()
    }

    if (!findSeo) _.throwError('notFound', context, 'Seo')

    const seos = await SeoModel.find({ iId: _.mongify(findSeo.iId), eStatus: 'a' }).lean()

    if (!seos.length) return []

    if (findSeo.eType === 'ma' && seos.some((ele) => ele.iSeriesId)) {
      const seriesStandingsSeo = await SeoModel.findOne({ iId: _.mongify(seos[seos.findIndex((ele) => ele.iSeriesId)]?.iSeriesId), eStatus: 'a', eSubType: 's' }).lean()
      if (seriesStandingsSeo) seos.push(seriesStandingsSeo)
    }
    return seos
  } catch (error) {
    return error
  }
}

controllers.listSeo = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, oSorting, sSearch } = getPaginationValues(input)

    const nTotal = await SeoModel.countDocuments({
      $or: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eType: 'cu',
      eStatus: { $ne: 'd' }
    })
    const aResults = await SeoModel.find({
      $or: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eType: 'cu',
      eStatus: { $ne: 'd' }
    }).sort(oSorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.bulkSeoUpdate = async (parent, { input }, context) => {
  try {
    let { aId, eStatus } = input
    const { decodedToken } = context

    const iUpdatedBy = _.mongify(decodedToken.iAdminId)
    aId = aId.map(id => _.mongify(id))

    const seo = await SeoModel.updateMany({ _id: { $in: aId }, eType: 'cu' }, { eStatus, iUpdatedBy })
    if (!seo.modifiedCount) _.throwError('notFound', context, 'seo')

    return _.resolve('updateSuccess', null, 'seo', context)
  } catch (error) {
    return error
  }
}

controllers.getSeoData = async (parent, { input }, context) => {
  try {
    const { sSlug } = input
    if (!sSlug) return _.throwError('requiredFormField', context, 'slug')
    const getSlug = await SeoModel.findOne({ sSlug, eStatus: 'a' }).lean()
    if (!getSlug || getSlug?.isGone) {
      const getSlug = await SeoRedirectModel.findOne({ sOldUrl: sSlug, eStatus: 'a' }).lean()
      if (!getSlug) return _.throwError('notFound', context, 'slug')
      const query = { eStatus: 'a' }
      if (getSlug?.eSubType) query.eSubType = getSlug.eSubType
      else query.eSubType = null
      let getSeo
      if (getSlug.eSeoType === 'cu') getSeo = await SeoModel.findOne({ _id: _.mongify(getSlug.iId), ...query }).lean()
      else getSeo = await SeoModel.findOne({ iId: _.mongify(getSlug.iId), ...query }).lean()
      if (!getSeo) return _.throwError('notFound', context, 'slug')
      Object.assign(getSeo, { eCode: getSlug?.eCode })
      return getSeo
    }
    return getSlug
  } catch (error) {
    return error
  }
}

controllers.getSeoById = async (parent, { input }, context) => {
  try {
    const seoData = await SeoModel.findOne({ _id: input._id, eStatus: { $ne: 'd' }, eType: 'cu' }).lean()
    if (!seoData) _.throwError('notFound', context, 'seo')

    return seoData
  } catch (error) {
    return error
  }
}

controllers.oSeoById = async (parent, { input }, context) => {
  try {
    const { iId } = input
    if (!iId) _.throwError('requiredField', context)
    const seoData = await SeoModel.findOne({ iId: _.mongify(iId), eStatus: { $ne: 'd' } }).lean()

    return seoData
  } catch (error) {
    return error
  }
}

controllers.getCategoryIdBySlug = async (parent, { input }, context) => {
  try {
    const { sSlug } = input
    const seo = await SeoModel.findOne({ sSlug, eStatus: 'a', eType: 'ct' })
    if (!seo) _.throwError('notFound', context, 'seo')
    return seo
  } catch (error) {
    return error
  }
}

controllers.getSeoByIdAdmin = async (parent, { input }, context) => {
  try {
    const { iId } = input
    if (!iId) return _.throwError('requiredFormField', context, 'iId')

    const seoData = await SeoModel.findOne({ iId: _.mongify(iId), eStatus: 'a' })
    if (!seoData) _.throwError('notFound', context, 'seo')
    return seoData
  } catch (error) {
    return error
  }
}

controllers.deleteSocialImage = async (parent, { input }, context) => {
  try {
    const { iId, eType } = input

    const findSeo = await SeoModel.findOne({ iId: _.mongify(iId), eStatus: 'a' })
    if (!findSeo) _.throwError('notFound', context, 'seo')

    s3.deleteObject(findSeo[eType].sUrl)

    findSeo[eType].sUrl = null
    delete findSeo[eType].oMeta
    await SeoModel.updateOne({ iId: _.mongify(iId) }, findSeo)
    return _.resolve('removeSuccess', null, 'image', context)
  } catch (error) {
    return error
  }
}

controllers.getSeriesCustomPages = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const seo = await SeoModel.find({ iId: _.mongify(_id), $or: [{ eType: 'cu' }, { eTabType: { $exists: true } }] })
    if (!seo.length) return []
    return seo
  } catch (error) {
    return error
  }
}

controllers.oSeo = async (parent, input, context) => {
  try {
    const { iId } = input
    if (!iId) _.throwError('requiredField', context)
    const seoData = await SeoModel.findOne({ iId: _.mongify(iId), eStatus: { $ne: 'd' } }).lean()

    return seoData
  } catch (error) {
    return error
  }
}

controllers.getSeosById = async (parent, { input }, context) => {
  const seos = await SeoModel.find({ iId: _.mongify(input.iId), eStatus: 'a' }).lean()

  const findSeo = await SeoModel.findOne({ iId: _.mongify(input.iId), eStatus: 'a' }).lean()

  if (findSeo?.eType === 'ma' && seos.some((ele) => ele.iSeriesId)) {
    const seriesStandingsSeo = await SeoModel.findOne({ iId: _.mongify(seos[seos.findIndex((ele) => ele.iSeriesId)]?.iSeriesId), eStatus: 'a', eSubType: 's' }).lean()
    if (seriesStandingsSeo) seos.push(seriesStandingsSeo)
  }

  return seos
}

module.exports = controllers
