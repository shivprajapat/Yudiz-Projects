const { SeoModel, SeoRedirectModel } = require('../../model')
const { addSeoData } = require('../../modules/Common/controllers')
const _ = require('../../../global')

const controllers = {}

controllers.getSeo = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).jsonp({
        status: 400,
        messages: 'Bad Route'
      })
    }
    const seo = await SeoModel.findOne({ iId: _.mongify(id) }).lean()
    return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'Data'), data: seo })
  } catch (error) {
    return res.status(500).jsonp({ status: 500, message: 'Something went wrong', data: {} })
  }
}

controllers.getSeoBySlug = async (req, res) => {
  try {
    const { sSlug } = req.query
    if (!sSlug) {
      return res.status(400).jsonp({
        status: 400,
        messages: 'Bad Route'
      })
    }
    const seo = await SeoModel.findOne({ sSlug }).lean()
    return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'Data'), data: seo })
  } catch (error) {
    return res.status(500).jsonp({ status: 500, message: 'Something went wrong', data: {} })
  }
}

controllers.addStaticPageSeo = async (req, res) => {
  // static pages
  // - /about-us
  // - /authors
  // - /careers
  // - /contact-us
  // - /cricket-schedule
  // - /cricket-series
  // - /cricket-series-archive
  // - /cricket-videos
  // - /fantasy-cricket-tips
  // - /icc-rankings
  // - /live-scores
  // - /live-scores/recent
  // - /live-scores/upcoming
  // - /playlist

  const slugs = ['authors', 'careers', 'about-us', 'contact-us', 'cricket-schedule', 'cricket-series', 'cricket-series-archive', 'cricket-videos', 'fantasy-cricket-tips', 'icc-rankings', 'live-scores', 'live-scores/recent', 'live-scores/upcoming', 'playlist']

  for (const s of slugs) {
    const seoParams = {
      sSlug: s,
      eStatus: 'a',
      eType: 'st',
      bIsDeletable: false
    }

    await SeoModel.updateOne({ sSlug: s }, seoParams, { upsert: true })
  }
  return res.status(messages.english.statusOk).jsonp({ sStatus: messages.english.statusOk, sMessage: messages.english.addSuccess.replace('##', 'static page seo') })
}

controllers.getPing = async (req, res) => {
  return res.status(messages.english.statusOk).jsonp({ sStatus: messages.english.statusOk, sMessage: 'ping' })
}

// controllers.updateSitemap = async (req, res) => {
//   try {

//   } catch (error) {
//     return error
//   }
// }

controllers.seriesRedirection = async (req, res) => {
  try {
    const { eType } = req.body
    if (!eType) return res.status(400).jsonp({ status: 400, message: 'eType required' })

    if (eType === 'a') {
      const { iSeriesId, iId } = req.body
      const sOldSubUrls = await SeoModel.find({ iId: _.mongify(iSeriesId), eSubType: { $ne: null } }).lean()
      const sOldUrl = await SeoModel.findOne({ iId: _.mongify(iSeriesId), eSubType: null })

      const sNewUrl = await SeoModel.findOne({ iId: _.mongify(iId), eSubType: null, eTabType: { $exists: false } }).lean()

      await SeoModel.updateMany({ iId: _.mongify(iSeriesId), eType: { $ne: 'cu' }, eTabType: { $exists: false } }, { eStatus: 'd' })
      for await (const sOldSubUrl of sOldSubUrls) {
        const body = {
          iId,
          sOldUrl: sOldSubUrl?.sSlug,
          sNewUrl: `${sNewUrl.sSlug}/${sOldSubUrl?.sSlug?.replaceAll(`${sOldUrl?.sSlug}/`, '')}`,
          eCode: 307,
          eSeoType: 'se',
          eSubType: sOldSubUrl.eSubType
        }

        await SeoRedirectModel.updateOne({ iId: _.mongify(iSeriesId), eSubType: sOldSubUrl.eSubType }, body, { upsert: true })
      }

      const body = {
        iId,
        sOldUrl: sOldUrl?.sSlug,
        sNewUrl: sNewUrl?.sSlug,
        eCode: 307,
        eSeoType: 'se'
      }

      await SeoRedirectModel.updateOne({ iId: _.mongify(iSeriesId), eSubType: null }, body, { upsert: true })
      return res.status(200).jsonp({ status: 200, message: 'Seo Redirection added succesfully' })
    }

    if (eType === 'e') {
      const { iSeriesId, iNewSeriesId, iId } = req.body

      await SeoModel.updateMany({ iId: _.mongify(iSeriesId), eType: { $ne: 'cu' } }, { eStatus: 'a' })
      await SeoModel.updateMany({ iId: _.mongify(iNewSeriesId), eType: { $ne: 'cu' } }, { eStatus: 'd' })
      await SeoRedirectModel.updateMany({ iId: _.mongify(iId) }, { eStatus: 'd' })

      const sSubUrls = await SeoModel.find({ iId: _.mongify(iNewSeriesId), eSubType: { $ne: null } })
      const sNewUrl = await SeoModel.findOne({ iId: _.mongify(iId), eSubType: null })
      const sNewSeriesUrl = await SeoModel.findOne({ iId: _.mongify(iNewSeriesId), eSubType: null })

      for await (const sSubUrl of sSubUrls) {
        const body = {
          iId,
          sOldUrl: sSubUrl?.sSlug,
          sNewUrl: `${sNewUrl.sSlug}/${sSubUrl?.sSlug?.replaceAll(`${sNewSeriesUrl?.sSlug}/`, '')}`,
          eCode: 307,
          eSeoType: 'se',
          eSubType: sSubUrl.eSubType
        }

        await SeoRedirectModel.updateOne({ iId: _.mongify(iId), eSubType: sNewSeriesUrl.eSubType }, body, { upsert: true })
      }

      const body = {
        iId,
        sOldUrl: sNewSeriesUrl?.sSlug,
        sNewUrl: sNewUrl?.sSlug,
        eCode: 307,
        eSeoType: 'se'
      }
      await SeoRedirectModel.updateOne({ iId: _.mongify(iId), eSubType: null }, body, { upsert: true })
      return res.status(200).jsonp({ status: 200, message: 'Seo Redirection added succesfully' })
    }

    if (eType === 'd') {
      const { iSeriesId, iId } = req.body

      await SeoRedirectModel.updateMany({ iId: _.mongify(iSeriesId) }, { eStatus: 'd' })

      await SeoModel.updateMany({ iId: _.mongify(iSeriesId), eType: { $ne: 'cu' } }, { eStatus: 'a' })
      await SeoModel.updateMany({ iId: _.mongify(iId), eType: { $ne: 'cu' } }, { eStatus: 'd' })
      return res.status(200).jsonp({ status: 200, message: 'Seo Redirection added succesfully' })
    }
    return res.status(500).jsonp({ status: 500, message: 'Something went wrong' })
  } catch (error) {
    return res.status(500).jsonp({ status: 500, message: 'Something went wrong', data: {} })
  }
}

controllers.addSeosData = async (req, res) => {
  try {
    console.log({ arr: req.body?.seos })
    for (const seo of req.body?.seos) {
      try {
        await addSeoData(seo)
      } catch (err) {
        return res.status(500).jsonp({ status: 500, message: 'Something went wrong', data: {} })
      }
    }
    return res.status(200).jsonp({ status: 200, message: 'Seo Tabs Created Successfully', data: {} })
  } catch (error) {
    return res.status(500).jsonp({ status: 500, message: 'Something went wrong', data: {} })
  }
}

module.exports = controllers
