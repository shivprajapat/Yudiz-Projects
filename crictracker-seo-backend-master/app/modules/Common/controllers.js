/* eslint-disable no-useless-escape */
const _ = require('../../../global')
const { redis } = require('../../utils')
const { generateSlugFun } = require('../../modules/Seo/common')
const { SeoModel, SeoRedirectModel } = require('../../model')
const controllers = {}

controllers.getPermissions = async (context) => {
  try {
    const { authorization, decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken.iAdminId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    if (await redis.redisAuthDb.get(`at:${authorization}`)) _.throwError('authorizationError', context)
    return { data: decodedToken }
  } catch (error) {
    return { error, isError: true }
  }
}

controllers.addSeoData = async (seoParams) => {
  if (seoParams.iId && seoParams.eType && seoParams.sSlug) {
    seoParams.sSlug = seoParams.sSlug?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-\\/]+/g, '')
      .replace(/\-\\-+/g, '-')
      .replace(/_/g, '-')
      .replace(/\_\_+/g, '-')
      .replace(/^-+/, '')
    // check if seo already exist
    const query = { iId: _.mongify(seoParams.iId) }
    if (seoParams.eSubType) {
      const seo = await SeoModel.findOne({ ...query, eSubType: null, eType: { $ne: 'cu' } }).lean()
      seoParams.sSlug = `${seo.sSlug}/${seoParams.sSlug}`
      Object.assign(query, { eSubType: seoParams.eSubType })
    } else Object.assign(query, { eSubType: null })

    if (!seoParams.eSubType) seoParams.eSubType = null

    const seo = await SeoModel.findOne(query)
    const dupSeo = await SeoModel.findOne({ sSlug: seoParams.sSlug, iId: { $ne: _.mongify(seoParams.iId) } })
    if (dupSeo) seoParams.sSlug = await generateSlugFun(seoParams.sSlug)
    if (seoParams.sSlug !== seoParams.sCUrl) seoParams.sCUrl = seoParams.sSlug

    if (seo) {
      if (seo?.sSlug !== seoParams?.sSlug) {
        const body = {
          iId: seoParams.iId,
          sOldUrl: seo?.sSlug,
          sNewUrl: seoParams?.sSlug,
          eCode: 308,
          eSeoType: seoParams.eType,
          eSubType: seoParams.eSubType
        }

        await SeoRedirectModel.updateOne(query, body, { upsert: true })
      }
    }
    // console.log({ seoParams })
    await SeoModel.updateOne(query, seoParams, { upsert: true })
    return true
  } else return false
}

module.exports = controllers
