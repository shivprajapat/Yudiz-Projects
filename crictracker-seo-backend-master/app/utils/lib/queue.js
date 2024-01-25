/* eslint-disable no-useless-escape */
const { redisclient } = require('../../utils/lib/redis')
const { SeoModel, SeoRedirectModel } = require('../../model')
const { ObjectId } = require('mongoose').Types
const { generateSlugFun } = require('../../modules/Seo/common')

const queuePush = (queueName, data) => {
  return redisclient.rpush(queueName, JSON.stringify(data))
}

const queuePop = (queueName) => {
  return redisclient.lpop(queueName)
}

const convertTags = async () => {
  try {
    let data = await queuePop('tagConvert')

    if (!data) setTimeout(() => convertTags(), 20000)
    else {
      data = JSON.parse(data)
      if (data?.bExists) {
        await SeoModel.deleteOne({ iId: ObjectId(data?.tags?._id) })
      } else {
        await SeoModel.updateOne({ iId: ObjectId(data?.tags?._id) }, { eType: 'ct', iId: ObjectId(data?.category?._id) })
      }
    }
  } catch (error) {
    setTimeout(() => convertTags(), 20000)
    console.log(error)
  }
}

const updateSeriesRedirection = async () => {
  try {
    let data = await queuePop('seriesRedirection')
    data = JSON.parse(data)
    if (!data) {
      setTimeout(() => updateSeriesRedirection(), 20000)
    }

    if (data) {
      if (data.eType === 'a') {
        const { iSeriesId, iId } = data
        const sOldSubUrls = await SeoModel.find({ iId: ObjectId(iSeriesId), eSubType: { $ne: null } }).lean()
        const sOldUrl = await SeoModel.findOne({ iId: ObjectId(iSeriesId), eSubType: null })

        const sNewUrl = await SeoModel.findOne({ iId: ObjectId(iId), eSubType: null, eTabType: { $exists: false } }).lean()

        await SeoModel.updateMany({ iId: ObjectId(iSeriesId), eType: { $ne: 'cu' }, eTabType: { $exists: false } }, { eStatus: 'd' })
        for await (const sOldSubUrl of sOldSubUrls) {
          const body = {
            iId,
            sOldUrl: sOldSubUrl?.sSlug,
            sNewUrl: `${sNewUrl.sSlug}/${sOldSubUrl?.sSlug?.replaceAll(`${sOldUrl?.sSlug}/`, '')}`,
            eCode: 307,
            eSeoType: 'se',
            eSubType: sOldSubUrl.eSubType
          }

          await SeoRedirectModel.updateOne({ iId: ObjectId(iSeriesId), eSubType: sOldSubUrl.eSubType }, body, { upsert: true })
        }

        const body = {
          iId,
          sOldUrl: sOldUrl?.sSlug,
          sNewUrl: sNewUrl?.sSlug,
          eCode: 307,
          eSeoType: 'se'
        }

        await SeoRedirectModel.updateOne({ iId: ObjectId(iSeriesId), eSubType: null }, body, { upsert: true })
      }

      if (data.eType === 'e') {
        const { iSeriesId, iNewSeriesId, iId } = data

        await SeoModel.updateMany({ iId: ObjectId(iSeriesId), eType: { $ne: 'cu' } }, { eStatus: 'a' })
        await SeoModel.updateMany({ iId: ObjectId(iNewSeriesId), eType: { $ne: 'cu' } }, { eStatus: 'd' })
        await SeoRedirectModel.updateMany({ iId: ObjectId(iId) }, { eStatus: 'd' })

        const sSubUrls = await SeoModel.find({ iId: ObjectId(iNewSeriesId), eSubType: { $ne: null } })
        const sNewUrl = await SeoModel.findOne({ iId: ObjectId(iId), eSubType: null })
        const sNewSeriesUrl = await SeoModel.findOne({ iId: ObjectId(iNewSeriesId), eSubType: null })

        for await (const sSubUrl of sSubUrls) {
          const body = {
            iId,
            sOldUrl: sSubUrl?.sSlug,
            sNewUrl: `${sNewUrl.sSlug}/${sSubUrl?.sSlug?.replaceAll(`${sNewSeriesUrl?.sSlug}/`, '')}`,
            eCode: 307,
            eSeoType: 'se',
            eSubType: sSubUrl.eSubType
          }

          await SeoRedirectModel.updateOne({ iId: ObjectId(iId), eSubType: sNewSeriesUrl.eSubType }, body, { upsert: true })
        }

        const body = {
          iId,
          sOldUrl: sNewSeriesUrl?.sSlug,
          sNewUrl: sNewUrl?.sSlug,
          eCode: 307,
          eSeoType: 'se'
        }
        await SeoRedirectModel.updateOne({ iId: ObjectId(iId), eSubType: null }, body, { upsert: true })
      }

      if (data.eType === 'd') {
        const { iSeriesId, iId } = data

        await SeoRedirectModel.updateMany({ iId: ObjectId(iSeriesId) }, { eStatus: 'd' })

        await SeoModel.updateMany({ iId: ObjectId(iSeriesId), eType: { $ne: 'cu' } }, { eStatus: 'a' })
        await SeoModel.updateMany({ iId: ObjectId(iId), eType: { $ne: 'cu' } }, { eStatus: 'd' })
      }
      setTimeout(() => updateSeriesRedirection(), 20000)
    }
  } catch (error) {
    console.log(error)
    setTimeout(() => updateSeriesRedirection(), 20000)
    return error
  }
}

const updateEntitySeo = async () => {
  try {
    let data = await queuePop('updateEntitySeo')

    data = JSON.parse(data)
    if (!data) {
      setTimeout(() => updateEntitySeo(), 20000)
    } else {
      await SeoModel.updateMany({ iId: ObjectId(data.iId), eType: { $ne: 'cu' } }, { eStatus: data.eStatus })
      setTimeout(() => updateEntitySeo(), 20000)
    }
  } catch (error) {
    setTimeout(() => updateEntitySeo(), 20000)
    console.log(error)
  }
}

const addSeoData = async () => {
  try {
    let seoParams = await queuePop('addSeoData')

    if (!seoParams) {
      return setTimeout(() => addSeoData(), 7000)
    }
    seoParams = JSON.parse(seoParams)
    if (seoParams.iId && seoParams.eType && seoParams.sSlug) {
      seoParams.sSlug = seoParams.sSlug?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\/]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/_/g, '-')
        .replace(/\_\_+/g, '-')
        .replace(/^-+/, '')
      // check if seo already exist
      const query = { iId: ObjectId(seoParams.iId) }
      if (seoParams.eSubType) {
        const seo = await SeoModel.findOne({ ...query, eSubType: null, eType: { $ne: 'cu' } }).lean()
        seoParams.sSlug = `${seo.sSlug}/${seoParams.sSlug}`
        Object.assign(query, { eSubType: seoParams.eSubType })
      } else Object.assign(query, { eSubType: null })

      const seo = await SeoModel.findOne(query)
      const dupSeo = await SeoModel.findOne({ sSlug: seoParams.sSlug, iId: { $ne: ObjectId(seoParams.iId) } })
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
      await SeoModel.updateOne(query, seoParams, { upsert: true })
    }
    setTimeout(() => addSeoData(), 7000)
  } catch (error) {
    setTimeout(() => addSeoData(), 7000)
    console.log(error)
  }
}

setTimeout(() => {
  convertTags()
  updateSeriesRedirection()
  updateEntitySeo()
  addSeoData()
}, 2000)

module.exports = { queuePush }
