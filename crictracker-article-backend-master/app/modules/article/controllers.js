const { readTime } = require('../../../global/lib/read-time-estimate')
const { articleViews } = require('../../../global/lib/article-view')
const { redis, s3, queuePush } = require('../../utils')
const { redisclient } = require('../../utils/lib/redis')
/* eslint-disable no-case-declarations */
const { articles: ArticlesModel, counts, comments, articlecomments: ArticleCommentsModel, categories: CategoriesModel, homepages: HomePagesModel, tags: TagsModel, VideosModel, gallery, PlayListsModel, rss: RssModel, StickyModel } = require('../../model')
const { getPaginationValues, scheduleArticleTask, getArticleVideoLimit } = require('../../utils/index')
const Rss = require('rss-generator')
const { parse } = require('node-html-parser')
const _ = require('../../../global')
const config = require('../../../config')
const moment = require('moment-timezone')
const { default: axios } = require('axios')
const etag = require('etag')
const { fixBrokenLinksWithAmp } = require('../Common/controllers')
const { CACHE_7 } = config
const cachegoose = require('cachegoose')
const size = require('s3-image-size')
const xmlParser = require('xml-js')
const grpcControllers = require('../../grpc/client')

const controllers = {}

const updateArticleCount = async (iAdminId) => {
  try {
    const oData = {}
    oData.nAll = await ArticlesModel.countDocuments({}).lean()
    oData.nPending = await ArticlesModel.countDocuments({ eState: 'p' }).lean()
    oData.nDraft = await ArticlesModel.countDocuments({ eState: 'd' }).lean()
    oData.nPublished = await ArticlesModel.countDocuments({ eState: 'pub' }).lean()
    oData.nTrash = await ArticlesModel.countDocuments({ eState: 't' }).lean()
    oData.nRejected = await ArticlesModel.countDocuments({ eState: 'r' }).lean()
    oData.nChangeRequested = await ArticlesModel.countDocuments({ eState: 'cr' }).lean()
    oData.nChangeSubmitted = await ArticlesModel.countDocuments({ eState: 'cs' }).lean()
    oData.nScheduled = await ArticlesModel.countDocuments({ eState: 's' }).lean()
    oData.nMine = await ArticlesModel.countDocuments({ $or: [{ iAuthorId: _.mongify(iAdminId) }, { iAuthorDId: _.mongify(iAdminId) }] }).lean()

    await counts.updateOne({ eType: 'a' }, oData, { upsert: true })
    return
  } catch (error) {
    return error
  }
}

const updateArticleReadTime = async (id) => {
  try {
    const article = await ArticlesModel.findOne({ _id: id }).cache(CACHE_7, `articleData:${id}`)

    if (article) {
      const string = article.sContent
      let imageCount = 0
      if (article.oImg) {
        imageCount = 1
      }
      // string: content, customWordTime : 275, customImageTime: 12, imageNumberCount: 5, customTableRowTime: 10, chineseKoreanReadTime: 500
      const {
        duration // 0.23272727272727273
      } = readTime(string, 275, 12, imageCount, 10, 500)
      await ArticlesModel.updateOne({ _id: id }, { nDuration: duration })
    }
    return
  } catch (error) {
    return error
  }
}

controllers.createArticle = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sTitle', 'sSubtitle', 'sSrtTitle', 'sContent', 'oImg', 'oTImg', 'oCategories', 'aTags', 'sEditorNotes', 'oAdvanceFeature', 'dPublishDate', 'aComments', 'eState', 'eVisibility', 'bPriority', 'iAuthorDId', 'iCategoryId', 'aPlayer', 'aSeries', 'aSecCategories', 'aPlayer', 'aTeam', 'aVenue', 'sInsContent', 'iEventId', 'oSeo', 'aPollId'])

    const { decodedToken } = context
    if (!body.sTitle || !body.sSubtitle || !body.sSrtTitle || !body.sContent || !body.oImg || !body.oImg) _.throwError('requiredField', context)
    if (body.sTitle?.trim().length > 200 || body.sTitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'title')
    if (body.sSubtitle?.trim().length >= 200 || body.sSubtitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'subtitle')
    if (body.sSrtTitle?.trim().length > 60 || body.sSrtTitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'shortTitle')

    Object.assign(body, { iAuthorId: decodedToken.iAdminId })
    if (body.eState) Object.assign(body, { eState: body.eState })
    if (body.iAuthorDId) {
      Object.assign(body, { iAuthorDId: _.mongify(body.iAuthorDId) })
    }
    if (body.sEditorNotes) Object.assign(body, { sEditorNotes: body.sEditorNotes })
    body.sDescription = _.stripHtml(body.sContent).replace(/\r\n|\n|\r/gm, '').substr(0, 200)

    // This is for amp generation.
    // if (body?.oAdvanceFeature?.bAmp) body.sAmpContent = await convertAmp(body?.sContent)
    if (body?.oAdvanceFeature?.bAmp && body?.sContent?.trim()) {
      body.sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)
    } else {
      body.sAmpContent = ''
    }

    if (body.sContent.includes('<!-- pagebreak -->')) {
      const figure = body.sContent.split(/<!-- pagebreak -->/i)
      const ampFigure = body.sAmpContent.split(/<!-- pagebreak -->/i)
      const pagingCount = figure.length
      // figure.shift()
      const articlePaging = {
        nTotal: pagingCount,
        oAmpPageContent: ampFigure,
        oPageContent: figure
      }
      Object.assign(body, { oListicleArticle: articlePaging, bIsListicleArticle: true })
    } else body.bIsListicleArticle = false

    const newArticle = await ArticlesModel.create(body)

    Object.assign(body?.oSeo, { iId: newArticle?._id })
    const akg = await grpcControllers.insertSeo(body?.oSeo)
    if (akg.nStatus !== 200) {
      await ArticlesModel.findByIdAndDelete(newArticle?._id).lean()
      _.throwError(akg.sMessage, context, akg?.sPrefix)
    }

    const content = parse(body.sContent)

    const oData = await ArticlesModel.findOne({ _id: body._id })
      .populate(
        [{ path: 'oCategory' }, { path: 'aTags' }, { path: 'aSeries' }, { path: 'aTeam' }, { path: 'aPlayer' }, { path: 'aVenue' }
        ]).lean().cache(CACHE_7, `article:${body._id}`)

    const postAttachments = []

    const imagesInGallery = await gallery.find({ sUrl: { $in: content.querySelectorAll('img').map((ele) => ele.getAttribute('src').replace(config.S3_CDN_URL, '')) } }).lean()

    const imagesNotIngallery = content.querySelectorAll('img').map((ele) => {
      ele.setAttribute('src', ele.getAttribute('src').replace(config.S3_CDN_URL, ''))
      return ele
    }).filter((ele) => !imagesInGallery.find((elem) => ele.getAttribute('src') === elem.sUrl))

    for (const ele of imagesNotIngallery) {
      const obj = {
        sUrl: ele?.getAttribute('src'),
        sCaption: ele?.getAttribute('alt')
      }
      size(s3.s3, config.S3_BUCKET_NAME, ele?.getAttribute('src'), (err, dimensions, bytesRead) => {
        if (err) console.log(err)
        obj.oMeta = {
          nWidth: dimensions?.width,
          nHeight: dimensions?.height,
          nSize: bytesRead
        }
      })
      postAttachments.push(obj)
    }

    const featImgNotInGallery = await gallery.findOne({ sUrl: body?.oImg?.sUrl }).lean()

    if (!featImgNotInGallery) postAttachments.push({ sUrl: body?.oImg?.sUrl, sCaption: body?.oImg?.sCaption, sTitle: body?.oImg?.sText, sAttribute: body?.oImg?.sAttribute, oMeta: body?.oImg?.oMeta })

    if (body.oTImg) {
      const featImgNotInGallery = await gallery.findOne({ sUrl: body?.oTImg?.sUrl }).lean()
      if (!featImgNotInGallery) postAttachments.push({ sUrl: body?.oTImg?.sUrl, sCaption: body?.oTImg?.sCaption, sTitle: body?.oTImg?.sText, sAttribute: body?.oTImg?.sAttribute, oMeta: body?.oTImg?.oMeta })
    }

    const updateArr = []

    for (const photos of postAttachments) {
      Object.assign(photos, { iAuthorId: decodedToken.iAdminId })
      const updateObj = {
        updateOne: {
          filter: { sUrl: photos.sUrl },
          update: { $set: photos }
        }
      }
      updateArr.push(updateObj)
      // if (!image?.aArticleIds?.includes(_.mongify(oData._id))) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: oData._id } })
    }

    if (updateArr.length) await gallery.bulkWrite(updateArr)

    const images = await gallery.find({ sUrl: { $in: content.querySelectorAll('img').map((ele) => ele.getAttribute('src').replace(config.S3_CDN_URL, '')) } }).lean()

    const updateIdsArray = []

    for (const image of images) {
      if (!image.aArticleIds.map((ele) => ele.toString()).includes(oData._id.toString())) {
        image.aArticleIds.push(_.mongify(oData._id))
        updateIdsArray.push({
          updateOne: {
            filter: { sUrl: image.sUrl },
            update: { $set: { aArticleIds: image.aArticleIds } }
          }
        })
      }
    }

    if (updateIdsArray.length) await gallery.bulkWrite(updateIdsArray)
    body.dModifiedDate = moment().utc()
    // update article rearation update
    updateArticleReadTime(newArticle._id)
    const article = await ArticlesModel.findOne({ _id: newArticle._id }).lean().cache(CACHE_7, `article:${newArticle._id}`)
      .populate([
        { path: 'oCategory' },
        { path: 'aTags' },
        { path: 'aSeries' },
        { path: 'aTeam' },
        { path: 'aPlayer' },
        { path: 'aVenue' }
      ])
    updateArticleCount()
    return _.resolve('addSuccess', { oData: article }, 'article', context)
  } catch (error) {
    return error
  }
}

controllers.createArticleComment = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['iArticleId', 'iReceiverId', 'sMessage', 'dSentDate', 'aPic'])
    const { decodedToken } = context
    const { iArticleId, iReceiverId, sMessage, aPic } = input
    if (!iReceiverId || !iArticleId) _.throwError('requiredField', context)
    if ((sMessage && aPic?.length) || (!sMessage && !aPic?.length)) _.throwError('textOrImage', context)

    const article = await ArticlesModel.findOne({ _id: iArticleId }).lean().cache(CACHE_7, `articleData:${iArticleId}`)
    if (!article) _.throwError('notFound', context, 'article')

    const commentParams = {}

    if (sMessage) commentParams.sMessage = sMessage
    if (aPic?.length) commentParams.aPic = aPic
    commentParams.iReceiverId = iReceiverId
    commentParams.iSenderId = decodedToken.iAdminId
    commentParams.dSentDate = Date.now()
    commentParams.iArticleId = _.mongify(iArticleId)

    const oData = await ArticleCommentsModel.create(commentParams)

    return _.resolve('addSuccess', { oData }, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.editArticle = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sTitle', 'sSubtitle', 'sSrtTitle', 'sContent', 'oImg', 'oTImg', 'oCategories', 'aTags', 'sEditorNotes', 'oAdvanceFeature', 'eState', 'eVisibility', 'bPriority', 'dPublishDate', 'dPublishDisplayDate', 'iCategoryId', 'aPlayer', 'aSeries', 'aSecCategories', 'aTeam', 'aVenue', 'sInsContent', 'nViewCount', 'oSticky', 'iEventId', 'oSeo', 'aPollId'])

    const { decodedToken } = context
    if (!body._id) _.throwError('requiredField', context)
    if (body.eState === 's' && !body.dPublishDate) _.throwError('scheduledDateMissing', context)

    if (body.sTitle?.trim().length > 200 || body.sTitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'title')
    if (body.sSubtitle?.trim().length > 200 || body.sSubtitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'subtitle')
    if (body.sSrtTitle?.trim().length > 60 || body.sSrtTitle?.trim().length < 10) _.throwError('formFieldInvalid', context, 'shortTitle')
    if (body.eState) Object.assign(body, { eState: body.eState })

    const article = await ArticlesModel.findOne({ _id: body._id }).lean().cache(CACHE_7, `articleData:${body._id}`)

    const { iAdminId } = decodedToken
    if (body.sContent) body.sDescription = _.stripHtml(body.sContent).replace(/\r\n|\n|\r/gm, '').substr(0, 200)

    if (article.eState === 'p' && article.iReviewerId && article?.iReviewerId?.toString() !== iAdminId) _.throwError('articleUnderReview', context)

    if ((article?.eState === 't' && body.eState === 'd') || (body.eState === 't')) body.iReviewerId = null
    if (article?.eState === 's' && body.eState !== 'p') _.throwError('cantEditScheduledArticle', context)
    if (body.eState === 'pub' && ['p', 'cs'].includes(article.eState)) {
      body.dPublishDate = new Date()
      if (!body.dPublishDisplayDate) body.dPublishDisplayDate = body.dPublishDate
    }
    if (body.eState === 'pub' && article.dPublishDate && article.eState === 'pub') {
      delete body?.dPublishDate
      if (body?.dPublishDisplayDate) {
        if (!moment(body.dPublishDisplayDate).isValid()) _.throwError('invalid', context, 'date')
        body.dPublishDisplayDate = moment(body.dPublishDisplayDate).toISOString()
      } else body.dPublishDisplayDate = article.dPublishDate
    }

    body.dModifiedDate = moment().utc()

    if (!['pub', 's'].includes(body.eState)) {
      body.dPublishDate = null
      body.dPublishDisplayDate = null
    }
    if (body.eState === 's') {
      body.dPublishDate = moment(body.dPublishDate).toISOString()
      body.dPublishDisplayDate = body.dPublishDate
    }

    if (['d', 'r', 'cr', 't'].includes(article.eState) && ['pub', 's'].includes(body.eState)) _.throwError('invalidArticleOperation', context)

    if (article.eState === 'r') _.throwError('cantEditRejectedArticle', context)

    if (article.eState === 'd' && !['p', 'd', 't'].includes(body.eState)) _.throwError('invalidArticleOperation', context)

    if (article.eState === 'p' && !['p', 'r', 'cr', 'pub', 's', 't'].includes(body.eState)) _.throwError('invalidArticleOperation', context)

    if (article.eState === 'cr' && !['cr', 'cs', 't'].includes(body.eState)) _.throwError('invalidArticleOperation', context)

    if (article.eState === 'cs' && !['cr', 'cs', 't', 'r', 'pub', 's'].includes(body.eState)) _.throwError('invalidArticleOperation', context)

    if (article.eState === 't' && !['d'].includes(body.eState)) _.throwError('invalidArticleOperation', context)

    if (article.eState === 'pub' && !['t', 'pub'].includes(body.eState)) _.throwError('invalidArticleOperation', context)

    if (article.eState === 's' && ['p'].includes(body.eState)) {
      body.dPublishDate = null
      body.dPublishDisplayDate = null
    }

    if (['pub', 's', 'r', 'cr', 'cs'].includes(body.eState) && (!article.iReviewerId && !article.dPublishDate)) _.throwError('articleNotPicked', context)

    if (body.eState === 's') {
      if (!moment(body.dPublishDate).isValid()) _.throwError('invalid', context, 'date')
      if (moment(body.dPublishDate).unix() < moment().unix()) _.throwError('invalidPublishDate', context)
    }

    // if (body.eState === 't') {
    //   await grpcControllers.updateEntitySeo({ iId: article._id, eStatus: 'd' })
    //   // queuePush('updateEntitySeo', { iId: article._id, eStatus: 'd' })
    //   queuePush('updateSiteMap', { _id: article._id, eType: 'ar', dPublishDate: article?.dPublishDate })
    // }

    // if (body.eState === 'd' && article.eState === 't') {
    //   await grpcControllers.updateEntitySeo({ iId: article._id, eStatus: 'a' })
    //   // queuePush('updateEntitySeo', { iId: article._id, eStatus: 'a' })
    // }

    if (body.eState === 'pub' && body?.oAdvanceFeature?.bFBEnable && !body?.sInsContent) _.throwError('formFieldRequired', context, 'instantArticle')

    if (body.eState === 'pub' && ['p', 'cs'].includes(article.eState)) {
      CategoriesModel.updateOne({ _id: _.mongify(body.iCategoryId) }, { $inc: { nCount: 1 } })
      CategoriesModel.updateMany({ _id: { $in: body?.aSeries } }, { $inc: { nCount: 1 } })
      TagsModel.updateMany({ _id: { $in: body?.aTags } }, { $inc: { nCount: 1 } })
      TagsModel.updateMany({ _id: { $in: body?.aPlayer } }, { $inc: { nCount: 1 } })
      TagsModel.updateMany({ _id: { $in: body?.aVenue } }, { $inc: { nCount: 1 } })
      TagsModel.updateMany({ _id: { $in: body?.aTeam } }, { $inc: { nCount: 1 } })
    }

    // This is for amp generation.
    // if (body?.oAdvanceFeature?.bAmp) body.sAmpContent = await convertAmp(body?.sContent)
    if ((body.eState === 'pub' || body.eState === 'cs' || body.eState === 'p' || body.eState === 's') && (body?.oAdvanceFeature?.bAmp && body?.sContent?.trim())) {
      body.sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)
    } else {
      body.sAmpContent = ''
    }

    if (body.eState === 'pub' && body?.oSticky) {
      const oSticky = {}
      if (typeof body?.oSticky?.bHome === 'boolean') Object.assign(oSticky, { bHome: body?.oSticky?.bHome })
      if (typeof body?.oSticky?.bCategory === 'boolean') Object.assign(oSticky, { bCategory: body?.oSticky?.bCategory })
      if (typeof body?.oSticky?.bHomeCategory === 'boolean') Object.assign(oSticky, { bHomeCategory: body?.oSticky?.bHomeCategory })

      if (!Object.keys(oSticky).length || (!oSticky?.bHome && !oSticky?.bHomeCategory && !oSticky?.bCategory)) await StickyModel.findOneAndDelete({ iArticleId: _.mongify(article._id) })
      await StickyModel.updateOne({ iArticleId: _.mongify(article._id) }, { oSticky }, { upsert: true })
    }

    if (body.sContent.includes('<!-- pagebreak -->')) {
      const figure = body.sContent.split(/<!-- pagebreak -->/i)
      const pagingCount = figure.length
      const articlePaging = { nTotal: pagingCount, oPageContent: figure }

      if (body.sAmpContent) {
        const ampFigure = body.sAmpContent.split(/<!-- pagebreak -->/i)
        Object.assign(articlePaging, { oAmpPageContent: ampFigure })
      }

      Object.assign(body, { oListicleArticle: articlePaging, bIsListicleArticle: true })
    } else body.bIsListicleArticle = false

    const updateAck = await ArticlesModel.updateOne({ _id: body._id }, body)
    if (!updateAck.modifiedCount) _.throwError('notFound', context, 'article')
    if (body.eState === 't') {
      Object.assign(body?.oSeo, { eStatus: 'd' })
    }
    if (body.eState === 'pub' && article.eState === 'p') {
      Object.assign(body?.oSeo, { eStatus: 'a' })
    }
    Object.assign(body?.oSeo, { iId: body?._id })
    const akg = await grpcControllers.insertSeo(body?.oSeo)
    if (akg.nStatus !== 200) {
      _.throwError(akg.sMessage, context, akg?.sPrefix)
    }

    if (body?.iEventId) await ArticlesModel.updateOne({ _id: article._id }, { $set: { iEventId: body?.iEventId } })
    else if (article?.iEventId) await ArticlesModel.updateOne({ _id: article._id }, { $unset: { iEventId: body?.iEventId } })

    cachegoose.clearCache(`article:${body._id}`)
    cachegoose.clearCache(`articleData:${body._id}`)
    cachegoose.clearCache(`seoData:${body?._id}:`)

    const oData = await ArticlesModel.findOne({ _id: body._id })
      .populate(
        [{ path: 'oCategory' }, { path: 'aTags' }, { path: 'aSeries' }, { path: 'aTeam' }, { path: 'aPlayer' }, { path: 'aVenue' }
        ]).lean().cache(CACHE_7, `article:${body._id}`)
    const content = parse(body.sContent)

    const postAttachments = []

    const imagesInGallery = await gallery.find({ sUrl: { $in: content.querySelectorAll('img').map((ele) => ele.getAttribute('src').replace(config.S3_CDN_URL, '')) } }).lean()

    const imagesNotIngallery = content.querySelectorAll('img').map((ele) => {
      ele.setAttribute('src', ele.getAttribute('src').replace(config.S3_CDN_URL, ''))
      return ele
    }).filter((ele) => !imagesInGallery.find((elem) => ele.getAttribute('src') === elem.sUrl))

    for (const ele of imagesNotIngallery) {
      const obj = {
        sUrl: ele?.getAttribute('src'),
        sCaption: ele?.getAttribute('alt')
      }
      size(s3.s3, config.S3_BUCKET_NAME, ele?.getAttribute('src'), (err, dimensions, bytesRead) => {
        if (err) console.log(err)
        obj.oMeta = {
          nWidth: dimensions?.width,
          nHeight: dimensions?.height,
          nSize: bytesRead
        }
      })
      postAttachments.push(obj)
    }

    const featImgNotInGallery = await gallery.findOne({ sUrl: body?.oImg?.sUrl }).lean()

    if (!featImgNotInGallery) postAttachments.push({ sUrl: body?.oImg?.sUrl, sCaption: body?.oImg?.sCaption, sTitle: body?.oImg?.sText, sAttribute: body?.oImg?.sAttribute, oMeta: body?.oImg?.oMeta })

    if (body.oTImg) {
      const featImgNotInGallery = await gallery.findOne({ sUrl: body?.oTImg?.sUrl }).lean()
      if (!featImgNotInGallery) postAttachments.push({ sUrl: body?.oTImg?.sUrl, sCaption: body?.oTImg?.sCaption, sTitle: body?.oTImg?.sText, sAttribute: body?.oTImg?.sAttribute, oMeta: body?.oTImg?.oMeta })
    }

    const updateArr = []

    for (const photos of postAttachments) {
      Object.assign(photos, { iAuthorId: decodedToken.iAdminId })
      const updateObj = {
        updateOne: {
          filter: { sUrl: photos.sUrl },
          update: { $set: photos }
        }
      }
      updateArr.push(updateObj)
      // if (!image?.aArticleIds?.includes(_.mongify(oData._id))) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: oData._id } })
    }

    if (updateArr.length) await gallery.bulkWrite(updateArr)

    const images = await gallery.find({ sUrl: { $in: content.querySelectorAll('img').map((ele) => ele.getAttribute('src').replace(config.S3_CDN_URL, '')) } }).lean()

    const updateIdsArray = []

    for (const image of images) {
      if (!image.aArticleIds.map((ele) => ele.toString()).includes(oData._id.toString())) {
        image.aArticleIds.push(_.mongify(oData._id))
        updateIdsArray.push({
          updateOne: {
            filter: { sUrl: image.sUrl },
            update: { $set: { aArticleIds: image.aArticleIds } }
          }
        })
      }
    }

    if (updateIdsArray.length) await gallery.bulkWrite(updateIdsArray)

    // invoke scheduler
    if (body.eState === 's') {
      const scheduledTime = moment(body.dPublishDate).unix()
      await scheduleArticleTask({ eType: 'article', data: { _id: oData._id, nTimestamp: scheduledTime } }, scheduledTime)
    }

    updateArticleCount()
    updateArticleReadTime(body._id)

    return _.resolve('updateSuccess', { oData }, 'article', context)
  } catch (error) {
    return error
  }
}

controllers.getArticle = async (parent, { input }, context) => {
  try {
    const { _id } = input

    const populateMatch = { match: { eStatus: 'a' } }

    const article = await ArticlesModel.findOne({ _id })
      .populate(
        [{ path: 'oCategory', ...populateMatch }, { path: 'aTags', ...populateMatch }, { path: 'aSeries', ...populateMatch, populate: { path: 'oParentCategory', ...populateMatch } }, { path: 'aTeam', ...populateMatch }, { path: 'aPlayer', ...populateMatch }, { path: 'aVenue', ...populateMatch }
        ]).lean()

    if (!article) _.throwError('notFound', context, 'article')

    const nCommentCount = await comments.countDocuments({ eStatus: { $ne: 'd' }, iArticleId: _.mongify(_id) }).lean()
    Object.assign(article, { nCommentCount })

    const data = await StickyModel.findOne({ iArticleId: _.mongify(_id) }).lean()
    if (data?.oSticky) Object.assign(article, { oSticky: data.oSticky })

    return article
  } catch (error) {
    return error
  }
}

// Admin api
controllers.listArticle = async (parent, { input }, context) => {
  try {
    const { aState, aTagFilters, aCategoryFilters, aPublishDate, aTeamTagFilters, aVenueTagFilters, aSeriesFilters, aAuthorsFilters } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    let query = {}

    if (sSearch) Object.assign(query, { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

    if (aState?.filter((ele) => (ele !== 'all' && ele !== 'mine'))?.length) query.eState = { $in: aState }

    if (aTagFilters?.length) query.aTags = aTagFilters
    if (aTeamTagFilters?.length) query.aTeam = aTagFilters
    if (aVenueTagFilters?.length) query.aVenue = aTagFilters
    if (aSeriesFilters?.length) query.aSeries = aTagFilters
    if (aAuthorsFilters?.length) {
      query = { ...query, $or: [{ iAuthorId: { $in: aAuthorsFilters.map((iAdminId) => _.mongify(iAdminId)) } }, { iAuthorId: { $in: aAuthorsFilters.map((iAdminId) => _.mongify(iAdminId)) } }] }
    }
    if (aCategoryFilters?.length) {
      query = { ...query, iCategoryId: { $in: aCategoryFilters } }
    }
    if (aPublishDate?.length === 2) query.dPublishDate = { $gte: new Date(aPublishDate[0]), $lte: new Date(aPublishDate[1]) }

    if (aState.includes('mine')) {
      const { decodedToken } = context
      const { iAdminId } = decodedToken
      query.$or = []
      query.$or.push({ iAuthorId: _.mongify(iAdminId) }, { iAuthorDId: _.mongify(iAdminId) })
    }

    const oArticleCount = await counts.findOne({ eType: 'a' }).lean()

    let nTotal
    if (aState.includes('all')) nTotal = oArticleCount?.nAll
    if (aState.includes('pub')) nTotal = oArticleCount?.nPublished
    if (aState.includes('p')) nTotal = oArticleCount?.nPending
    if (aState.includes('s')) nTotal = oArticleCount?.nScheduled
    if (aState.includes('d')) nTotal = oArticleCount?.nDraft
    if (aState.includes('cr') && aState.includes('cr')) nTotal = oArticleCount?.nChangeRequested + oArticleCount?.nChangeSubmitted

    let aResults = await ArticlesModel.find(query)
      // .collation({ locale: 'en', caseLevel: true })
      .sort(sorting)
      .allowDiskUse(true)
      .skip(nSkip)
      .limit(nLimit)
      .populate([
        { path: 'oCategory' },
        { path: 'aTags' },
        { path: 'aSeries' },
        { path: 'aTeam' },
        { path: 'aPlayer' },
        { path: 'aVenue' }
      ]).lean()

    aResults = aResults.map((ele) => {
      ele.dUpdated = ele.dModifiedDate
      return ele
    })

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getArticleCounts = async (parent, { input }, context) => {
  try {
    const { decodedToken } = context
    const { iAdminId } = decodedToken

    await updateArticleCount(iAdminId)
    const data = await counts.findOne({ eType: 'a' }).lean()
    return data || {}
  } catch (error) {
    return error
  }
}

controllers.pickArticle = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['iArticleId', 'eType'])
    const { iArticleId, eType } = input
    const { decodedToken } = context

    const article = await ArticlesModel.findOne({ _id: iArticleId }).lean().cache(CACHE_7, `articleData:${iArticleId}`)
    if (!article) _.throwError('notFound', context, 'article')
    if (!['p', 'cr', 'pub'].includes(article.eState)) _.throwError('cantPickArticle', context)

    const updatParams = {}
    if (eType === 'p') {
      if (article.iReviewerId) _.throwError('articleAlreadyReview', context)
      updatParams.iReviewerId = _.mongify(decodedToken.iAdminId)
    }
    if (eType === 'o') {
      if (!article.iReviewerId && !article.bOld) _.throwError('cantOvertakeArticle', context)
      updatParams.iReviewerId = _.mongify(decodedToken.iAdminId)
    }

    await ArticlesModel.updateOne({ _id: iArticleId }, updatParams)

    if (eType === 'o') redis.pubsub.publish(`articleTakeOver:${article._id}:${article.iReviewerId}`, { articleTakeOver: { _id: decodedToken.iAdminId } })

    cachegoose.clearCache(`article:${iArticleId}`)
    cachegoose.clearCache(`articleData:${iArticleId}`)

    return _.resolve('articlePicked', null, null, context)
  } catch (error) {
    return error
  }
}

controllers.listArticleComment = async (parent, { input }, context) => {
  try {
    const { iArticleId, nOrder } = input

    const isExist = await ArticlesModel.findOne({ _id: iArticleId }).lean().cache(CACHE_7, `articleData:${iArticleId}`)
    if (!isExist) _.throwError('notFound', context, 'article')

    const { nSkip, nLimit } = getPaginationValues(input)

    const aResults = await ArticleCommentsModel.find({ iArticleId: _.mongify(iArticleId) }).sort({ dCreated: nOrder }).skip(nSkip).limit(nLimit).lean()
    const nTotal = await ArticleCommentsModel.countDocuments({ iArticleId: _.mongify(iArticleId) })

    return aResults.length ? { aResults, nTotal } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.editDisplayAuthor = async (parent, { input }, context) => {
  try {
    const { iArticleId, iAuthorDId } = input

    const article = await ArticlesModel.updateOne({ _id: iArticleId }, { iAuthorDId: _.mongify(iAuthorDId) })
    if (!article.modifiedCount) _.throwError('notFound', context, 'article')

    cachegoose.clearCache(`article:${iArticleId}`)
    cachegoose.clearCache(`articleData:${iArticleId}`)

    return _.resolve('displayAuthorChange', null, null, context)
  } catch (error) {
    return error
  }
}

// const updateArticleCountRedis = async (article, ip) => await articleViews(article, ip)

controllers.getArticleFront = async (parent, { input }, context) => {
  try {
    const { _id, bIsBookmarked } = input
    if (!_id) _.throwError('requiredField', context)

    const populateMatch = { match: { eStatus: 'a' } }

    const article = await ArticlesModel.findOne({ _id, eState: 'pub' })
      .populate(
        [{ path: 'oCategory', ...populateMatch }, { path: 'aTags', ...populateMatch }]).lean().cache(CACHE_7, `article:${_id}`)
    if (article?.aTeam?.filter(ele => ele)?.length) {
      const aTeam = await TagsModel.find({ _id: { $in: article?.aTeam } }).cache(CACHE_7, `aTeam:${_id}`)
      article.aTeam = aTeam
    }
    if (article?.aPlayer?.filter(ele => ele)?.length) {
      const aPlayer = await TagsModel.find({ _id: { $in: article?.aPlayer } }).cache(CACHE_7, `aPlayer:${_id}`)
      article.aPlayer = aPlayer
    }
    if (article?.aVenue?.filter(ele => ele)?.length) {
      const aVenue = await TagsModel.find({ _id: { $in: article?.aVenue } }).cache(CACHE_7, `aVenue:${_id}`)
      article.aVenue = aVenue
    }
    if (article?.aSeries?.filter(ele => ele)?.length) {
      const aSeries = await CategoriesModel.find({ _id: { $in: article?.aSeries } }).cache(CACHE_7, `aSeries:${_id}`)
      article.aSeries = aSeries
    }

    if (!article) _.throwError('notFound', context, 'article')

    Object.assign(article, { bIsBookmarked })

    const nCommentCount = await comments.countDocuments({ iArticleId: _.mongify(_id), eStatus: 'a' }).lean()
    Object.assign(article, { nCommentCount })

    if (article.bIsBookmarked) {
      article.iBookmarkedId = input.iBookmarkedId
    }

    return article
  } catch (error) {
    return error
  }
}

controllers.listUserArticle = async (parent, { input }, context) => {
  try {
    const { iSeriesId, oArticleInput } = input

    let query = { eState: 'pub', eVisibility: 'pb' }

    const { nSkip, nLimit, sorting } = getPaginationValues(oArticleInput)

    const category = await CategoriesModel.find({ iSeriesId }, { _id: 1 }).lean()
    const categoryIds = category.map(({ _id }) => _id)
    query = { ...query, aSeries: { $in: categoryIds } }

    const nTotal = await ArticlesModel.countDocuments(query)
    const aResults = await ArticlesModel.find(query).populate([{ path: 'aTags' }, { path: 'aPlayer' }, { path: 'aTeam' }, { path: 'aVenue' }, { path: 'aSeries' }, { path: 'oCategory' }]).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.listSimpleCategoryArticle = async (parent, { input }, context) => {
  try {
    const { iId, oArticleInput } = input

    let query = { eState: 'pub', eVisibility: 'pb' }

    const { nSkip, nLimit, sorting } = getPaginationValues(oArticleInput)

    query = { ...query, iCategoryId: iId }

    const nTotal = await ArticlesModel.countDocuments(query)
    const aResults = await ArticlesModel.find(query).populate([{ path: 'aTags' }, { path: 'aPlayer' }, { path: 'aTeam' }, { path: 'aVenue' }, { path: 'aSeries' }, { path: 'oCategory' }]).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.listUserTagArticle = async (parent, { input }, context) => {
  try {
    const { iPlayerId, oArticleInput } = input

    let query = { eState: 'pub', eVisibility: 'pb' }

    const { nSkip, nLimit, sorting } = getPaginationValues(oArticleInput)

    const tag = await TagsModel.find({ iId: iPlayerId }, { _id: 1 }).lean()
    const tagIds = tag.map(({ _id }) => _id)
    query = { ...query, aPlayer: { $in: tagIds } }

    const nTotal = await ArticlesModel.countDocuments(query)
    const aResults = await ArticlesModel.find(query).populate([{ path: 'aTags' }, { path: 'aPlayer' }, { path: 'aTeam' }, { path: 'aVenue' }, { path: 'aSeries' }, { path: 'oCategory' }]).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getHomePageArticle = async (parent, { input }, context) => {
  try {
    if (!input) input = {}
    if (!input?.nSkip) input.nSkip = 0
    if (!input?.nLimit) input.nLimit = 10

    const { nSkip, nLimit } = getPaginationValues(input)
    let homepage = await redis.redisArticleDb.get('homepage')

    if (homepage) {
      homepage = _.parse(homepage)

      const aResults = homepage.slice(nSkip, (nSkip + nLimit))
      const nTotal = homepage.length
      return { aResults, nTotal }
    }

    const aResults = await HomePagesModel.find({}).sort({ nPriority: 1 }).skip(nSkip).limit(nLimit).lean()
    const nTotal = await HomePagesModel.count()
    await redis.redisArticleDb.setex('homepage', 3600, _.stringify(await HomePagesModel.find({}).sort({ nPriority: 1 }).lean()))
    return { aResults, nTotal }
  } catch (error) {
    return error
  }
}

controllers.getPreviewArticleFront = async (parent, { input }, context) => {
  try {
    const { _id } = input || {}
    if (!_id) _.throwError('requiredField', context)

    const article = await ArticlesModel.findOne({ _id })
      .populate(
        [{ path: 'oCategory' }, { path: 'aTags' }, { path: 'aSeries', populate: { path: 'oParentCategory' } }, { path: 'aTeam' }, { path: 'aPlayer' }, { path: 'aVenue' }
        ]).lean().cache(CACHE_7, `articlePreview:${_id}`)

    if (!article) _.throwError('articleNotPublished', context)
    const nCommentCount = await comments.countDocuments({ eStatus: { $ne: 'd' }, iArticleId: _.mongify(_id) }).lean()
    Object.assign(article, { nCommentCount })

    return article
  } catch (error) {
    return error
  }
}

controllers.getArticleSearch = async (parent, { input }, context) => {
  try {
    const { sSearch, nSkip, nLimit } = getPaginationValues(input)
    if (!sSearch) return []
    const query = { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') }, eState: 'pub' }

    const aResults = await ArticlesModel.find(query).populate([{ path: 'aTags' }, { path: 'oCategory' }]).sort({ dPublishDate: -1 }).skip(nSkip).limit(nLimit).lean()

    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.getRssFeed = async (parent, { input }, context) => {
  try {
    const { sSlug } = input
    if (!sSlug || sSlug === 'smart-news-custom') {
      // const getRssFromRedis = await redis.redisclient.get('feed')

      // if (getRssFromRedis) return getRssFromRedis
      const feedOptions = {
        title: config.FEED_TITLE,
        description: config.FEED_DESCRIPTION,
        site_url: config.FRONTEND_URL,
        language: 'en-US',
        custom_elements: [
          {
            image: [
              { url: 'https://www.crictracker.com/favicon.png' },
              { title: 'CricTracker' },
              { link: config.FRONTEND_URL },
              { width: 32 },
              { height: 32 }
            ]
          },
          {
            'atom:link': {
              _attr: {
                href: `${config.FRONTEND_URL}/feed`,
                rel: 'self',
                type: 'application/rss+xml'
              }
            }
          }
        ]
      }

      if (sSlug === 'smart-news-custom') {
        feedOptions.custom_elements.push({ 'snf:logo': { _cdata: `${config.S3_CDN_URL}logo-color.svg` } })
        feedOptions.custom_elements.push({ 'snf:darkModeLogo': { _cdata: `${config.S3_CDN_URL}logo-color.svg` } })
      }

      const rss = new Rss(feedOptions)

      const article = await ArticlesModel.find({ eState: 'pub', iCategoryId: { $ne: _.mongify('623184aef5d229bacb00ff95') } }).populate('iCategoryId').populate('aSeries').sort({ dPublishDate: -1 }).limit(20).lean()

      if (!article.length) _.throwError('notFound', context, 'article')

      for (let index = 0; index < article.length; index++) {
        const categories = []
        const ele = article[index]

        if (ele.iCategoryId) {
          categories.push(ele.iCategoryId.sName)
        }

        if (ele.aSeries) {
          categories.push(...ele.aSeries.map((ele) => ele.sName))
        }

        const author = await axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${ele.iAuthorDId}`)

        const { data } = await axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo/${ele._id}`)
        const itemOptions = {
          title: ele.sTitle,
          description: ele.sSubtitle,
          url: `${config.FRONTEND_URL}/${data?.data?.sSlug}/`,
          guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
          categories,
          author: author.data.data,
          content: ele.sContent,
          date: ele.dPublishDisplayDate || ele.dPublishDate,
          custom_elements: [
            {
              'content:encoded': {
                _cdata: `<figure>
                  <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
              <figcaption>${ele?.oImg?.sCaption}</figcaption>
              </figure><br>${ele.sContent}`
              }
            }
          ]
        }

        const ETag = etag(JSON.stringify(itemOptions))

        itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

        if (sSlug === 'smart-news-custom') {
          itemOptions.custom_elements.push({ 'media:thumbnail': { _cdata: `${config.S3_CDN_URL}${ele?.oImg?.sUrl}` } })
          itemOptions.custom_elements.push({
            'snf:analytics': { _cdata: `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-49665093-1', 'crictracker');ga('require', 'displayfeatures');ga('set', 'referrer', 'http://www.smartnews.com/');ga('send', 'pageview', '${data?.data?.sSlug}/');</script>` }
          })
        }
        rss.item(itemOptions)
      }

      // ({ sSlug: 'feed' }, { sRss: rss.xml({ indent: true }) })
      await redis.redisclient.setex('feed', 300, rss.xml({ indent: true }))
      const xmlJson = xmlParser.xml2js(rss.xml({ indent: true }), { compact: true, spaces: 4 })
      if (sSlug === 'smart-news-custom') Object.assign(xmlJson.rss._attributes, { 'xmlns:media': 'http://search.yahoo.com/mrss/', 'xmlns:snf': 'http://www.smartnews.be/snf' })
      return sSlug === 'smart-news-custom' ? xmlParser.json2xml(xmlJson, { compact: true, spaces: 4 }) : rss.xml({ indent: true })
    }

    const { data } = await axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo-slug?sSlug=${sSlug}`)
    if (!data.data) _.throwError('notFound', context, 'seo')

    // const getRssFromRedis = await redis.redisclient.get(sSlug)

    // if (getRssFromRedis) return getRssFromRedis

    const feedOptions = {
      title: data.data.sTitle,
      description: data.data.sDescription,
      site_url: config.FRONTEND_URL,
      language: 'en-US',
      custom_elements: [
        {
          image: [
            { url: 'https://www.crictracker.com/favicon.png' },
            { title: 'CricTracker' },
            { link: config.FRONTEND_URL },
            { width: 32 },
            { height: 32 }
          ]
        },
        {
          'atom:link': {
            _attr: {
              href: `${config.FRONTEND_URL}/${sSlug}/feed/`,
              rel: 'self',
              type: 'application/rss+xml'
            }
          }
        }
      ]
    }
    const rss = new Rss(feedOptions)
    let article
    let categories = []
    let author

    switch (data.data.eType) {
      case 'ar':
        article = await ArticlesModel.findOne({ _id: _.mongify(data.data.iId), eState: 'pub' }).populate('iCategoryId').populate('aSeries').lean().cache(CACHE_7, `articleData:${data.data.iId}`)
        author = await axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${article.iAuthorDId}`)
        if (!article) _.throwError('notFound', context, 'article')

        if (article.iCategoryId) {
          categories.push(article.iCategoryId.sName)
        }
        if (article.aSeries) {
          categories.push(...article.aSeries.map((ele) => ele.sName))
        }

        const itemOptions = {
          title: article.sTitle,
          description: article.sSubtitle,
          url: `${config.FRONTEND_URL}/${sSlug}/`,
          guid: `${config.FRONTEND_URL}/?p=${article.id ?? article._id}`,
          categories,
          author: author.data.data,
          date: article.dPublishDisplayDate || article.dPublishDate,
          custom_elements: [
            {
              'content:encoded': {
                _cdata: `<figure>
                  <img src="${config.S3_CDN_URL}${article?.oImg?.sUrl}" width="${article?.oImg?.oMeta?.nWidth ?? 600}" height="${article?.oImg?.oMeta?.nHeight ?? 400}" alt="${article?.oImg?.sText}"/>
                <figcaption>${article?.oImg?.sCaption}</figcaption>
                </figure><br>${article.sContent}`
              }
            }
          ]
        }

        const ETag = etag(JSON.stringify(itemOptions))

        itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

        rss.item(itemOptions)

        await redis.redisclient.setex(sSlug, 300, rss.xml({ indent: true }))

        return rss.xml({ indent: true })
      case 'ct':
        const category = await CategoriesModel.findOne({ _id: _.mongify(data.data.iId), eStatus: 'a' }).lean().cache(CACHE_7, `categoryData:${data.data.iId}`)
        const query = { eState: 'pub' }
        if (!category) _.throwError('notFound', context, 'category')
        if (data.data.sSlug === 'fantasy-cricket-tips') {
          const items = await RssModel.find().sort({ dPublishDate: -1 }).lean()
          items.forEach((ele) => {
            if (ele?.oRss?.custom_elements[1]?.['content:encoded']) {
              const ETag = etag(JSON.stringify(ele))
              ele?.oRss?.custom_elements.push({ ETag: { _cdata: ETag } })
            }
            rss.item(ele.oRss)
          })
        } else {
          if (category.eType === 'as' || category.bFutureSeries) Object.assign(query, { aSeries: category._id })
          else Object.assign(query, { iCategoryId: _.mongify(category._id) })
          article = await ArticlesModel.find(query).populate('iCategoryId').populate('aSeries').sort({ dPublishDate: -1 }).limit(10).lean()

          if (!article.length) _.throwError('notFound', context, 'article')
          for (let index = 0; index < article.length; index++) {
            categories = []
            const ele = article[index]

            if (ele.iCategoryId) {
              categories.push(ele.iCategoryId.sName)
            }

            if (ele.aSeries) {
              categories.push(...ele.aSeries.map((ele) => ele.sName))
            }

            author = await axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${ele.iAuthorDId}`)

            const { data } = await axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo/${ele._id}`)

            const itemOptions = {
              title: ele.sTitle,
              description: ele.sSubtitle,
              url: `${config.FRONTEND_URL}/${data?.data?.sSlug}/`,
              guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
              categories,
              author: author.data.data,
              date: ele.dPublishDisplayDate || ele.dPublishDate,
              custom_elements: [
                {
                  'content:encoded': {
                    _cdata: `<figure>
                    <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
              <figcaption>${ele?.oImg?.sCaption}</figcaption>
                  </figure><br>${ele.sContent}`
                  }
                }
              ]
            }

            const ETag = etag(JSON.stringify(itemOptions))

            itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

            rss.item(itemOptions)
          }
        }
        // ({ sSlug }, { sRss: rss.xml({ indent: true }) })

        await redis.redisclient.setex(sSlug, 300, rss.xml({ indent: true }))

        return rss.xml({ indent: true })
      case 'gt':
        const generalTag = await TagsModel.findOne({ _id: _.mongify(data.data.iId), eStatus: 'a' }).lean().cache(CACHE_7, `tag:${data.data.eType}:${data.data.iId}`)
        if (!generalTag) _.throwError('notFound', context, 'tag')
        article = await ArticlesModel.find({ aTags: _.mongify(generalTag._id), eState: 'pub' }).populate('iCategoryId').populate('aSeries').sort({ dPublishDate: -1 }).limit(10).lean()

        if (!article.length) _.throwError('notFound', context, 'tag')
        for (let index = 0; index < article.length; index++) {
          categories = []
          const ele = article[index]

          if (ele.iCategoryId) {
            categories.push(ele.iCategoryId.sName)
          }

          if (ele.aSeries) {
            categories.push(...ele.aSeries.map((ele) => ele.sName))
          }

          author = await axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${ele.iAuthorDId}`)

          const { data } = await axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo/${ele._id}`)

          const itemOptions = {
            title: ele.sTitle,
            description: ele.sSubtitle,
            url: `${config.FRONTEND_URL}/${data?.data?.sSlug}/`,
            guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
            categories,
            author: author.data.data,
            date: ele.dPublishDisplayDate || ele.dPublishDate,
            custom_elements: [
              {
                'content:encoded': {
                  _cdata: `<figure>
                <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                <figcaption>${ele?.oImg?.sCaption}</figcaption>
            </figure><br>${ele.sContent}`
                }
              }
            ]
          }

          const ETag = etag(JSON.stringify(itemOptions))

          itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

          rss.item(itemOptions)
        }

        // ({ sSlug }, { sRss: rss.xml({ indent: true }) }, { upsert: true })

        await redis.redisclient.setex(sSlug, 300, rss.xml({ indent: true }))

        return rss.xml({ indent: true })
      case 'p':
        const playerTag = await TagsModel.findOne({ iId: _.mongify(data.data.iId), eStatus: 'a' }).lean()
        if (!playerTag) _.throwError('notFound', context, 'tag')
        article = await ArticlesModel.find({ aPlayer: _.mongify(playerTag._id), eState: 'pub' }).populate('iCategoryId').populate('aSeries').sort({ dPublishDate: -1 }).limit(10)
        if (!article.length) _.throwError('notFound', context, 'article')
        for (let index = 0; index < article.length; index++) {
          categories = []
          const ele = article[index]

          if (ele.iCategoryId) {
            categories.push(ele.iCategoryId.sName)
          }

          if (ele.aSeries) {
            categories.push(...ele.aSeries.map((ele) => ele.sName))
          }

          author = await axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${ele.iAuthorDId}`)

          const { data } = await axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo/${ele._id}`)

          const itemOptions = {
            title: ele.sTitle,
            description: ele.sSubtitle,
            url: `${config.FRONTEND_URL}/${data?.data?.sSlug}/`,
            guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
            categories,
            author: author.data.data,
            date: ele.dPublishDisplayDate || ele.dPublishDate,
            custom_elements: [
              {
                'content:encoded': {
                  _cdata: `<figure>
                <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                <figcaption>${ele?.oImg?.sCaption}</figcaption>
            </figure><br>${ele.sContent}`
                }
              }
            ]
          }

          const ETag = etag(JSON.stringify(itemOptions))

          itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

          rss.item(itemOptions)
        }

        // ({ sSlug }, { sRss: rss.xml({ indent: true }) }, { upsert: true })

        await redis.redisclient.setex(sSlug, 300, rss.xml({ indent: true }))

        return rss.xml({ indent: true })
      case 't':
        const teamTag = await TagsModel.findOne({ iId: _.mongify(data.data.iId), eStatus: 'a' }).lean()
        if (!teamTag) _.throwError('notFound', context, 'tag')
        article = await ArticlesModel.find({ aTeam: _.mongify(teamTag._id), eState: 'pub' }).populate('iCategoryId').populate('aSeries').sort({ dPublishDate: -1 }).limit(10)
        if (!article.length) _.throwError('notFound', context, 'article')
        for (let index = 0; index < article.length; index++) {
          categories = []
          const ele = article[index]

          if (ele.iCategoryId) {
            categories.push(ele.iCategoryId.sName)
          }

          if (ele.aSeries) {
            categories.push(...ele.aSeries.map((ele) => ele.sName))
          }

          author = await axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${ele.iAuthorDId}`)

          const { data } = await axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo/${ele._id}`)

          const itemOptions = {
            title: ele.sTitle,
            description: ele.sSubtitle,
            url: `${config.FRONTEND_URL}/${data?.data?.sSlug}/`,
            guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
            categories,
            author: author.data.data,
            date: ele.dPublishDisplayDate || ele.dPublishDate,
            custom_elements: [
              {
                'content:encoded': {
                  _cdata: `<figure>
                <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                <figcaption>${ele?.oImg?.sCaption}</figcaption>
            </figure><br>${ele.sContent}`
                }
              }
            ]
          }

          const ETag = etag(JSON.stringify(itemOptions))

          itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

          rss.item(itemOptions)
        }

        // ({ sSlug }, { sRss: rss.xml({ indent: true }) }, { upsert: true })

        await redis.redisclient.setex(sSlug, 300, rss.xml({ indent: true }))

        return rss.xml({ indent: true })
      case 'v':
        const venueTag = await TagsModel.findOne({ iId: _.mongify(data.data.iId), eStatus: 'a' }).lean()
        if (!venueTag) _.throwError('notFound', context, 'tag')
        article = await ArticlesModel.find({ aVenue: _.mongify(venueTag._id), eState: 'pub' }).populate('iCategoryId').populate('aSeries').sort({ dPublishDate: -1 }).limit(10)
        if (!article.length) _.throwError('notFound', context, 'article')
        for (let index = 0; index < article.length; index++) {
          categories = []
          const ele = article[index]

          if (ele.iCategoryId) {
            categories.push(ele.iCategoryId.sName)
          }

          if (ele.aSeries) {
            categories.push(...ele.aSeries.map((ele) => ele.sName))
          }

          author = await axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${ele.iAuthorDId}`)

          const { data } = await axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo/${ele._id}`)

          const itemOptions = {
            title: ele.sTitle,
            description: ele.sSubtitle,
            url: `${config.FRONTEND_URL}/${data?.data?.sSlug}/`,
            guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
            categories,
            author: author.data.data,
            date: ele.dPublishDisplayDate || ele.dPublishDate,
            custom_elements: [
              {
                'content:encoded': {
                  _cdata: `<figure>
                <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                <figcaption>${ele?.oImg?.sCaption}</figcaption>
            </figure><br>${ele.sContent}`
                }
              }
            ]
          }

          const ETag = etag(JSON.stringify(itemOptions))

          itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

          rss.item(itemOptions)
        }

        // ({ sSlug }, { sRss: rss.xml({ indent: true }) }, { upsert: true })

        await redis.redisclient.setex(sSlug, 300, rss.xml({ indent: true }))

        return rss.xml({ indent: true })
      default:
        await redis.redisclient.setex(sSlug, 300, rss.xml({ indent: true }))
        return rss.xml({ indent: true })
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.listSeriesArticlesVideosFront = async (parent, { input }, context) => {
  try {
    const { iSeriesId, eType } = input || {}
    const { nSkip, nLimit, sorting } = getPaginationValues(input)
    if (!iSeriesId || !eType) _.throwError('requiredField', context)

    const query = { iSeriesId: _.mongify(iSeriesId), eStatus: 'a' }

    const response = {}

    if (eType === 'vn') {
      const { nArticleLimit, nVideoLimit, nArticleSkip, nVideoSkip } = getArticleVideoLimit(input)

      const categoryData = await CategoriesModel.findOne({ iSeriesId: _.mongify(iSeriesId), eStatus: 'a' })
      let aResultsArticles = []
      if (categoryData) {
        const articles = await ArticlesModel.find({ aSeries: categoryData._id, eState: 'pub', eVisibility: 'pb' }).sort(sorting).skip(nArticleSkip).limit(nArticleLimit)
        aResultsArticles = articles
      }

      response.oArticles = { aResults: aResultsArticles }

      const categories = await CategoriesModel.find(query, { _id: 1 }).lean()
      const aCategoryId = categories.map(({ _id }) => _id)

      const playlists = await PlayListsModel.find({ iCategoryId: { $in: aCategoryId }, eStatus: 'a' })

      const aPlaylistId = playlists.map(({ _id }) => _id)

      const aResultsVideos = await VideosModel.find({ iPlaylistId: { $in: aPlaylistId }, eStatus: 'a' }).sort(sorting).skip(nVideoSkip).limit(nVideoLimit).lean()

      response.oVideos = { aResults: aResultsVideos }
    }

    if (eType === 'v') {
      const categories = await CategoriesModel.find(query, { _id: 1 }).lean()
      const aCategoryId = categories.map(({ _id }) => _id)
      const playlists = await PlayListsModel.find({ iCategoryId: { $in: aCategoryId }, eStatus: 'a' })

      const aPlaylistId = playlists.map(({ _id }) => _id)

      const aResultsVideos = await VideosModel.find({ iPlaylistId: { $in: aPlaylistId }, eStatus: 'a' }).sort(sorting).skip(nSkip).limit(nLimit).lean()

      response.oVideos = { aResults: aResultsVideos }
    }

    if (eType === 'n') {
      const categoryData = await CategoriesModel.findOne({ iSeriesId: _.mongify(iSeriesId), eStatus: 'a' })
      let aResultsArticles = []
      if (categoryData) {
        const articles = await ArticlesModel.find({ aSeries: _.mongify(categoryData._id), eState: 'pub', eVisibility: 'pb' }).sort(sorting).skip(nSkip).limit(nLimit)
        aResultsArticles = articles
      }

      response.oArticles = { aResults: aResultsArticles }
    }

    return response
  } catch (error) {
    return error
  }
}

controllers.getAuthorArticles = async (parent, { input }, context) => {
  try {
    if (!input.iAuthorDId) return _.throwError('requiredField', context)
    const { iAuthorDId } = input

    const query = { eState: 'pub', eVisibility: 'pb', iAuthorDId }

    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    const nTotal = await ArticlesModel.countDocuments(query)
    const aResults = await ArticlesModel.find(query).populate([{ path: 'aTags' }, { path: 'aPlayer' }, { path: 'aTeam' }, { path: 'aVenue' }, { path: 'aSeries' }, { path: 'oCategory' }]).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.listSimpleCategoryArticlesVideosFront = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('inputRequired', context)
    const { iCategoryId, eType } = input
    if (!iCategoryId || !eType) _.throwError('requiredField', context)

    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    let query
    let category
    let bIsVideo = true
    const SeriesCategories = []
    const SimpleCategories = []

    if (iCategoryId === '623184acf5d229bacb00fef0') { // cricket-teams category
      query = { $expr: { $gt: [{ $size: '$aTeam' }, 0] } }
      bIsVideo = false
    } else if (iCategoryId === '63ca8df031aea8684a74a00b') { // cricket-players category
      query = { $expr: { $gt: [{ $size: '$aPlayer' }, 0] } }
      bIsVideo = false
    } else {
      query = {
        $or: [{ iCategoryId: _.mongify(iCategoryId) }, { $and: [{ bFutureSeries: true }, { aSeries: _.mongify(iCategoryId) }] }]
      }

      category = await CategoriesModel.find({ iParentId: _.mongify(iCategoryId) }).select({ _id: 1, eType: 1, sName: 1 }).lean()

      category.forEach((s) => {
        if (s.eType === 's') {
          SimpleCategories.push({ iCategoryId: _.mongify(s._id) })
        } else if (s.eType === 'as') {
          SeriesCategories.push({ aSeries: _.mongify(s._id) })
        }
      })
    }
    if (category?.length) {
      query.$or = [...query.$or, ...SeriesCategories, ...SimpleCategories]
    }

    const response = {}

    if (eType === 'v') {
      let aResults = []
      if (bIsVideo) {
        aResults = await VideosModel.find({ ...query, eStatus: 'a' }).sort(sorting).skip(nSkip).limit(nLimit).lean()
      }

      if (!aResults.length) {
        aResults = await VideosModel.find({ eStatus: 'a' }).sort(sorting).skip(nSkip).limit(nLimit).lean()
      }

      response.oVideos = aResults.length ? { aResults } : { aResults: [] }
    }

    if (eType === 'n') {
      const aResults = await ArticlesModel.find({ ...query, eState: 'pub' }).populate([{ path: 'aTags' }, { path: 'aPlayer' }, { path: 'aTeam' }, { path: 'aVenue' }, { path: 'aSeries' }, { path: 'oCategory' }]).sort(sorting).skip(nSkip).limit(nLimit).lean()

      response.oArticles = aResults?.length ? { aResults } : { aResults: [] }
    }

    if (eType === 'vn') {
      const { nArticleLimit, nVideoLimit, nArticleSkip, nVideoSkip } = getArticleVideoLimit(input)

      let videos = []
      if (bIsVideo) {
        videos = await VideosModel.find({ ...query, eStatus: 'a' }).sort(sorting).skip(nVideoSkip).limit(nVideoLimit).lean()
      }

      if (!videos.length) {
        videos = await VideosModel.find({ eStatus: 'a' }).sort(sorting).skip(nVideoSkip).limit(nVideoLimit).lean()
      }

      response.oVideos = { aResults: videos.length ? videos : [] }

      const aResults = await ArticlesModel.find({ ...query, eState: 'pub' }).populate([{ path: 'aTags' }, { path: 'aPlayer' }, { path: 'aTeam' }, { path: 'aVenue' }, { path: 'aSeries' }, { path: 'oCategory' }]).sort(sorting).skip(nArticleSkip).limit(nArticleLimit).lean()

      response.oArticles = { aResults: aResults?.length ? aResults : [] }
    }

    return response
  } catch (error) {
    return error
  }
}

controllers.updateArticleStatus = async (parent, { input }, context) => {
  try {
    const { _id, eState } = input
    if (!_id || !eState) _.throwError('requiredField', context)

    const article = await ArticlesModel.findOneAndUpdate({ _id: input._id }, { eState, $unset: { iReviewerId: 1, dPublishDate: 1, dPublishDisplayDate: 1 } })

    if (eState === 't') {
      await grpcControllers.updateEntitySeo({ iId: input._id, eStatus: 'd' })
      // queuePush('updateEntitySeo', { iId: input._id, eStatus: 'd' })
      queuePush('updateSiteMap', { _id, eType: 'ar', dPublishDate: article?.dPublishDate })
    }

    if (eState === 'd' && article.eState === 't') {
      await grpcControllers.updateEntitySeo({ iId: input._id, eStatus: 'a' })
      // queuePush('updateEntitySeo', { iId: input._id, eStatus: 'a' })
    }

    if (!article) _.throwError('notFound', context, 'article')
    cachegoose.clearCache(`article:${_id}`)
    cachegoose.clearCache(`articleData:${_id}`)

    return _.resolve('updateSuccess', null, 'article', context)
  } catch (error) {
    return error
  }
}

controllers.getArticleByTeam = async (parent, { input }, context) => {
  try {
    const { iTeamId } = input
    const { nLimit, nSkip, sorting } = getPaginationValues(input)
    const tag = await TagsModel.findOne({ iId: _.mongify(iTeamId) })
    const query = { aTeam: _.mongify(tag?._id), eState: 'pub' }
    const aResults = await ArticlesModel.find(query).skip(nSkip).limit(nLimit).sort(sorting).lean()
    const nTotal = await ArticlesModel.countDocuments(query)
    return { aResults, nTotal }
  } catch (error) {
    return error
  }
}

controllers.getRelatedStories = async (parent, { input }, context) => {
  try {
    const { oGetRelatedStoriesIdInput, oPaginationInput } = input
    const { nLimit, nSkip } = getPaginationValues(oPaginationInput)

    const query = { eState: 'pub', dPublishDate: { $gt: moment().subtract(3, 'months') } }
    const $or = []

    if (oGetRelatedStoriesIdInput) {
      const { aTags, aTeam, aPlayer, aVenue, aSeries, iCategoryId, iArticleId } = oGetRelatedStoriesIdInput
      if (iCategoryId) $or.push({ iCategoryId: _.mongify(iCategoryId) })
      if (aTags?.length) $or.push({ aTags: { $in: aTags.map(tag => _.mongify(tag)) } })
      if (aSeries?.length) $or.push({ aSeries: { $in: aSeries.map(tag => _.mongify(tag)) } })
      if (aPlayer?.length) $or.push({ aPlayer: { $in: aPlayer.map(tag => _.mongify(tag)) } })
      if (aVenue?.length) $or.push({ aVenue: { $in: aVenue.map(tag => _.mongify(tag)) } })
      if (aTeam?.length) $or.push({ aTeam: { $in: aTeam.map(tag => _.mongify(tag)) } })

      if (iArticleId) query._id = { $ne: _.mongify(iArticleId) }
    }

    if ($or?.length) query.$or = $or

    const aResults = await ArticlesModel.find(query).sort({ dPublishDate: -1 }).skip(nSkip).limit(nLimit).lean()

    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.getTopArticles = async (parent, { input }, context) => {
  try {
    const { nLimit } = input
    let { nSkip } = input
    nSkip = nSkip === 1 ? 0 : nSkip
    const aResults = []
    const data = await redisclient.hgetall('articles')
    if (data) {
      const sorted = Object.entries(data)
        .sort(([, a], [, b]) => b - a).slice(nSkip, nSkip + nLimit)
      for (let index = 0; index < sorted.length; index++) {
        const ele = sorted[index]
        const _id = ele[0].split(':')[1]
        const getArticle = await ArticlesModel.findOne({ _id }).lean()

        if (getArticle) aResults.push(getArticle)
      }
      if (aResults.length < nLimit) {
        const aResults = await ArticlesModel.find({ eState: 'pub', dPublishDate: { $gt: moment().add(-7, 'days') } }).hint({ nViewCount: -1 }).skip(nSkip).limit(nLimit).lean()
        return aResults
      } else return aResults
    } else {
      const aResults = await ArticlesModel.find({ eState: 'pub', dPublishDate: { $gt: moment().add(-7, 'days') } }).hint({ nViewCount: -1 }).skip(nSkip).limit(nLimit).lean()
      return aResults
    }
  } catch (error) {
    return error
  }
}

controllers.updatePickArticleData = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sTitle', 'sSubtitle', 'sSrtTitle', 'sContent', 'oImg', 'oTImg', 'oCategories', 'aTags', 'sEditorNotes', 'oAdvanceFeature', 'eState', 'eVisibility', 'bPriority', 'dPublishDate', 'dPublishDisplayDate', 'iCategoryId', 'aPlayer', 'aSeries', 'aTeam', 'aVenue', 'sInsContent', 'oSeo'])

    const { decodedToken } = context
    if (!body._id) _.throwError('requiredField', context)

    const article = await ArticlesModel.findOne({ _id: body._id }).lean().cache(CACHE_7, `articleData:${body._id}`)
    if (body.sContent) body.sDescription = _.stripHtml(body.sContent).replace(/\r\n|\n|\r/gm, '').substr(0, 200)

    if (body.eState === 'pub' && ['p', 'cs'].includes(article.eState)) {
      body.dPublishDate = new Date()
      body.dPublishDisplayDate = body.dPublishDate
    }

    if (body.eState === 'pub' && article.dPublishDate && article.eState === 'pub') {
      delete body?.dPublishDate
      if (body?.dPublishDisplayDate) {
        body.dPublishDisplayDate = moment(body.dPublishDisplayDate).toISOString()
      } else body.dPublishDisplayDate = article.dPublishDate
    }

    if (!['pub', 's'].includes(body.eState)) {
      body.dPublishDate = null
      body.dPublishDisplayDate = null
    }
    if (body.eState === 's') {
      body.dPublishDate = moment(body.dPublishDate).toISOString()
      body.dPublishDisplayDate = body.dPublishDate
    }

    if (article.eState === 's' && ['p'].includes(body.eState)) {
      body.dPublishDate = null
      body.dPublishDisplayDate = null
    }

    if (body.eState === 'pub' && ['p', 'cs'].includes(article.eState)) {
      CategoriesModel.updateOne({ _id: _.mongify(body.iCategoryId) }, { $inc: { nCount: 1 } })
      CategoriesModel.updateMany({ _id: { $in: body?.aSeries } }, { $inc: { nCount: 1 } })
      TagsModel.updateMany({ _id: { $in: body?.aTags } }, { $inc: { nCount: 1 } })
      TagsModel.updateMany({ _id: { $in: body?.aPlayer } }, { $inc: { nCount: 1 } })
      TagsModel.updateMany({ _id: { $in: body?.aVenue } }, { $inc: { nCount: 1 } })
      TagsModel.updateMany({ _id: { $in: body?.aTeam } }, { $inc: { nCount: 1 } })
    }

    // This is for amp generation.
    // if (body?.oAdvanceFeature?.bAmp) body.sAmpContent = await convertAmp(body?.sContent)
    if (body?.oAdvanceFeature?.bAmp && body?.sContent?.trim()) {
      body.sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)
    } else {
      body.sAmpContent = ''
    }

    if (body.sContent.includes('<!-- pagebreak -->')) {
      const figure = body.sContent.split(/<!-- pagebreak -->/i)
      const pagingCount = figure.length
      const ampFigure = body.sAmpContent.split(/<!-- pagebreak -->/i)

      const articlePaging = {
        nTotal: pagingCount,
        oAmpPageContent: ampFigure,
        oPageContent: figure
      }
      Object.assign(body, { oListicleArticle: articlePaging, bIsListicleArticle: true })
    } else body.bIsListicleArticle = false

    const updateAck = await ArticlesModel.updateOne({ _id: body._id }, body)
    if (!updateAck.modifiedCount) _.throwError('notFound', context, 'article')

    Object.assign(body?.oSeo, { iId: updateAck?._id })

    const akg = await grpcControllers.insertSeo(body?.oSeo)
    if (akg.nStatus !== 200) {
      await ArticlesModel.findByIdAndDelete(updateAck?._id).lean()
      _.throwError(akg.sMessage, context, akg?.sPrefix)
    }

    cachegoose.clearCache(`article:${body._id}`)
    cachegoose.clearCache(`articleData:${body._id}`)

    const oData = await ArticlesModel.findOne({ _id: body._id })
      .populate(
        [{ path: 'oCategory' }, { path: 'aTags' }, { path: 'aSeries' }, { path: 'aTeam' }, { path: 'aPlayer' }, { path: 'aVenue' }
        ]).lean().cache(CACHE_7, `article:${body._id}`)
    const content = parse(body.sContent)

    const postAttachments = []

    const imagesInGallery = await gallery.find({ sUrl: { $in: content.querySelectorAll('img').map((ele) => ele.getAttribute('src').replace(config.S3_CDN_URL, '')) } }).lean()

    const imagesNotIngallery = content.querySelectorAll('img').map((ele) => {
      ele.setAttribute('src', ele.getAttribute('src').replace(config.S3_CDN_URL, ''))
      return ele
    }).filter((ele) => !imagesInGallery.find((elem) => ele.getAttribute('src') === elem.sUrl))

    for (const ele of imagesNotIngallery) {
      const obj = {
        sUrl: ele?.getAttribute('src'),
        sCaption: ele?.getAttribute('alt')
      }
      size(s3.s3, config.S3_BUCKET_NAME, ele?.getAttribute('src'), (err, dimensions, bytesRead) => {
        if (err) console.log(err)
        obj.oMeta = {
          nWidth: dimensions?.width,
          nHeight: dimensions?.height,
          nSize: bytesRead
        }
      })
      postAttachments.push(obj)
    }

    const featImgNotInGallery = await gallery.findOne({ sUrl: body?.oImg?.sUrl }).lean()

    if (!featImgNotInGallery) postAttachments.push({ sUrl: body?.oImg?.sUrl, sCaption: body?.oImg?.sCaption, sTitle: body?.oImg?.sText, sAttribute: body?.oImg?.sAttribute, oMeta: body?.oImg?.oMeta })

    if (body.oTImg) {
      const featImgNotInGallery = await gallery.findOne({ sUrl: body?.oTImg?.sUrl }).lean()
      if (!featImgNotInGallery) postAttachments.push({ sUrl: body?.oTImg?.sUrl, sCaption: body?.oTImg?.sCaption, sTitle: body?.oTImg?.sText, sAttribute: body?.oTImg?.sAttribute, oMeta: body?.oTImg?.oMeta })
    }

    const updateArr = []

    for (const photos of postAttachments) {
      Object.assign(photos, { iAuthorId: decodedToken.iAdminId })
      const updateObj = {
        updateOne: {
          filter: { sUrl: photos.sUrl },
          update: { $set: photos }
        }
      }
      updateArr.push(updateObj)
      // if (!image?.aArticleIds?.includes(_.mongify(oData._id))) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: oData._id } })
    }

    if (updateArr.length) await gallery.bulkWrite(updateArr)

    const images = await gallery.find({ sUrl: { $in: content.querySelectorAll('img').map((ele) => ele.getAttribute('src').replace(config.S3_CDN_URL, '')) } }).lean()

    const updateIdsArray = []

    for (const image of images) {
      if (!image.aArticleIds.map((ele) => ele.toString()).includes(oData._id.toString())) {
        image.aArticleIds.push(_.mongify(oData._id))
        updateIdsArray.push({
          updateOne: {
            filter: { sUrl: image.sUrl },
            update: { $set: { aArticleIds: image.aArticleIds } }
          }
        })
      }
    }

    if (updateIdsArray.length) await gallery.bulkWrite(updateIdsArray)

    // invoke scheduler
    if (body.eState === 's') {
      const scheduledTime = moment(body.dPublishDate).unix()
      scheduleArticleTask({ eType: 'article', data: { _id: oData._id, nTimestamp: scheduledTime } }, scheduledTime)
    }

    if (body.eState === 't') {
      grpcControllers.updateEntitySeo({ iId: body._id, eStatus: 'd' })
      // queuePush('updateEntitySeo', { iId: body._id, eStatus: 'd' })
    }

    updateArticleCount()
    updateArticleReadTime(body._id)
    redis.pubsub.publish(`articleTakeOverUpdate:${article._id}:${article.iReviewerId}`, { articleTakeOverUpdate: 'Data updated' })
    return _.resolve('updateSuccess', { oData }, 'article', context)
  } catch (error) {
    return error
  }
}

controllers.randomArticles = async (parent, { input }, context) => {
  try {
    const { nSample } = input

    const aggregatePipeline = [
      {
        $match: {
          eState: 'pub', dPublishDate: { $gte: new Date(moment().subtract(2, 'months')), $lte: new Date() }
        }
      },
      {
        $sample: {
          size: nSample
        }
      }]

    const articles = await ArticlesModel.aggregate(aggregatePipeline)
    return articles
  } catch (error) {
    return error
  }
}

controllers.getArticleById = async (parent, { input }, context) => {
  try {
    const { id } = input
    if (!id) _.throwError('requiredField', context)

    const article = await ArticlesModel.findOne({ id, eState: 'pub' })

    if (!article) _.throwError('notFound', context, 'Article')

    return article
  } catch (error) {
    return error
  }
}

controllers.updateNewsArticleViewsCount = async (parent, { input }, context) => {
  const { _id } = input
  articleViews({ _id }, context.ip)

  return 'Successfully incresed article view'
}

module.exports = controllers
