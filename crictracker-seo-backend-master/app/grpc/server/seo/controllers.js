/* eslint-disable no-useless-escape */
const { SeoModel } = require('../../../model')
const { ObjectId } = require('mongoose').Types
const _ = require('../../../../global')
const { fixBrokenLinksWithAmp } = require('../../../modules/Seo/common')
const { addSeoData } = require('../../../modules/Common/controllers')
const { s3, queuePush } = require('../../../utils')

const controllers = {}

controllers.addSeoData = async ({ request: seoParams }, cb) => {
  try {
    console.log(seoParams.iId, seoParams.eType, seoParams.sSlug)
    const isCompleted = await addSeoData(seoParams)
    if (isCompleted) return cb(null, { sMessage: 'Success' })
    else return cb(null, { sMessage: 'Something went wrong!!' })
  } catch (error) {
    queuePush('addSeoData', seoParams)
    return cb(error, null)
  }
}

controllers.updateEntitySeo = async ({ request }, cb) => {
  try {
    if (request.iId) {
      await SeoModel.updateMany({ iId: ObjectId(request.iId), eType: { $ne: 'cu' } }, { eStatus: request.eStatus })
      cb(null, { sMessage: 'success' })
    } else {
      _.throwError('formFieldRequired', { userLanguage: 'english' }, 'iId')
    }
  } catch (error) {
    cb(error, null)
  }
}

controllers.insertSeo = async ({ request }, cb) => {
  try {
    const findSlug = await SeoModel.findOne({ sSlug: request.sSlug, eStatus: { $ne: 'd' } })
    if (findSlug) {
      if (findSlug.iId.toString() !== request.iId.toString()) cb(null, { nStatus: 400, sMessage: 'alreadyExists', sPrefix: 'slug' })
    }
    if (Object.keys(request).length !== 0 && request.constructor === Object) {
      await SeoModel.findOneAndUpdate({ iId: _.mongify(request.iId) }, request, { new: true, upsert: true })
      return cb(null, { nStatus: 200, sMessage: 'success' })
    }

    cb(null, { nStatus: 500, sMessage: 'wentWrong' })
  } catch (error) {
    cb(error, null)
  }
}

controllers.editSeo = async ({ request }, cb) => {
  try {
    const findSeo = await SeoModel.findOne({ sSlug: request.sSlug, eStatus: { $ne: 'd' } })
    if (findSeo) {
      if (findSeo?.iId?.toString() !== request?.iId?.toString()) cb(null, { nStatus: 400, sMessage: 'alreadyExists', sPrefix: 'slug' })
    }

    const updateQuery = {
      iId: _.mongify(request.iId),
      eType: { $ne: 'cu' }
    }

    if (request.eType) Object.assign(updateQuery, { eType: request.eType })
    if (request.eSubType) Object.assign(updateQuery, { eSubType: request.eSubType })
    if (!request.eSubType || request.eSubType === null) Object.assign(updateQuery, { eSubType: null })
    if (request.sContent) {
      const sAmpContent = await fixBrokenLinksWithAmp(request?.sContent)
      Object.assign(request, { sAmpContent })
    }

    if (Object.keys(request).length !== 0 && request.constructor === Object) {
      await SeoModel.findOneAndUpdate(updateQuery, request, { upsert: true, new: true }).lean()

      if (request.oFB?.sUrl) {
        const seo = await SeoModel.findOne({ iId: _.mongify(request.iId) }).lean()
        if (seo?.oFB?.sUrl) if (request.oFB.sUrl !== seo.oFB.sUrl) s3.deleteObject(seo.oFB.sUrl)
      } else {
        const seo = await SeoModel.findOne({ iId: _.mongify(request.iId) }).lean()
        if (seo?.oFB?.sUrl) s3.deleteObject(seo.oFB.sUrl)
      }

      if (request.oTwitter?.sUrl) {
        const seo = await SeoModel.findOne({ iId: _.mongify(request.iId) }).lean()
        if (seo?.oTwitter?.sUrl) if (request.oTwitter.sUrl !== seo?.oTwitter?.sUrl) s3.deleteObject(seo.oTwitter.sUrl)
      } else {
        const seo = await SeoModel.findOne({ iId: _.mongify(request.iId) }).lean()
        if (seo?.oTwitter?.sUrl) s3.deleteObject(seo.oTwitter.sUrl)
      }
      return cb(null, { nStatus: 200, sMessage: 'success' })
    }
    cb(null, { nStatus: 500, sMessage: 'wentWrong' })
  } catch (error) {
    cb(error, null)
  }
}

controllers.getSeoData = async ({ request }, cb) => {
  try {
    const { iId } = request

    const seo = await SeoModel.findOne({ iId: _.mongify(iId), eType: { $ne: 'cu' }, eSubType: null }).lean()
    const aCustomSeo = await SeoModel.find({ iId: _.mongify(iId), $or: [{ eType: 'cu' }, { eTabType: { $exists: true } }] })
    if (aCustomSeo.length) Object.assign(seo, { aCustomSeo })

    cb(null, seo || '')
  } catch (error) {
    cb(error, null)
  }
}

controllers.getSeosData = async ({ request }, cb) => {
  try {
    const { iId } = request

    const seos = await SeoModel.find({ iId: _.mongify(iId), eStatus: 'a' }).lean()

    const findSeo = await SeoModel.findOne({ iId: _.mongify(iId), eStatus: 'a' }).lean()

    if (findSeo?.eType === 'ma' && seos.some((ele) => ele.iSeriesId)) {
      const seriesStandingsSeo = await SeoModel.findOne({ iId: _.mongify(seos[seos.findIndex((ele) => ele.iSeriesId)]?.iSeriesId), eStatus: 'a', eSubType: 's' }).lean()
      if (seriesStandingsSeo) seos.push(seriesStandingsSeo)
    }
    cb(null, { oSeos: seos })
  } catch (error) {
    cb(error, null)
  }
}

controllers.getSeoBySlug = async ({ request }, cb) => {
  try {
    const { sSlug } = request
    if (!sSlug) {
      return cb(null, {})
    }
    const seo = await SeoModel.findOne({ sSlug }).lean()
    if (!seo) cb(null, {})
    cb(null, seo)
  } catch (error) {
    cb(error, null)
  }
}

controllers.getSlugs = async ({ request }, cb) => {
  try {
    const aSlugs = await SeoModel.find({ iId: { $in: request?._id } }, { sSlug: 1, iId: 1, _id: 0, eType: 1, eSubType: 1 }).lean()
    if (!aSlugs.length) cb(null, {})
    cb(null, { oSlugsData: aSlugs })
  } catch (error) {
    cb(error, null)
  }
}

controllers.addSeosData = async ({ request }, cb) => {
  try {
    const { arr } = request
    console.log({ arr })
    for (const seo of arr) {
      try {
        await controllers.addSeoData({ request: seo }, cb)
      } catch (err) {
        console.log(err, 'error in seo tab creation')
      }
    }

    cb(null, { sMessage: 'Success', nStatus: 200 })
  } catch (error) {
    cb(error, null)
  }
}

module.exports = controllers
