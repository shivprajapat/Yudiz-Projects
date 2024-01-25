const { bookmarks, articles, VideosModel } = require('../../model')
const { getPaginationValues, redis } = require('../../utils')
const _ = require('../../../global')
const { eBookmarkType: aBookmarkType } = require('../../model/enums')
const controllers = {}
const grpcController = require('../../grpc/client/')

controllers.addUserBookmark = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId', 'iVideoId', 'eBookmarkType'])
    const { decodedToken } = context
    if (!body.eBookmarkType) _.throwError('requiredField', context)
    if (!aBookmarkType.value.includes(body.eBookmarkType)) _.throwError('formFieldInvalid', context, 'bookmark_type')

    const { eBookmarkType } = body
    const { iUserId } = decodedToken
    if (!iUserId) _.throwError('notFound', context, 'user')
    const oCreateBookmark = { iUserId, eBookmarkType }

    // check condition for article bookmark and validate article
    if (eBookmarkType === 'ar') {
      if (!body.iArticleId) _.throwError('requiredField', context)

      const { iArticleId } = body
      const article = await articles.findById(iArticleId).lean()

      if (!article) _.throwError('notFound', context, 'article')

      if (article?.eState !== 'pub') _.throwError('bookmarkNotAllowed', context, 'article')

      const exist = await bookmarks.findOne({ iArticleId: _.mongify(iArticleId), iUserId: _.mongify(iUserId), eStatus: { $ne: 'd' } }).lean()

      if (exist) _.throwError('alreadyBookmarked', context, 'article')

      oCreateBookmark.iArticleId = iArticleId
      oCreateBookmark.iCategoryId = article.iCategoryId
    } else if (eBookmarkType === 'fa') {
      if (!body.iArticleId) _.throwError('requiredField', context)

      const { iArticleId } = body

      const exist = await bookmarks.findOne({ iArticleId: _.mongify(iArticleId), iUserId: _.mongify(iUserId), eStatus: { $ne: 'd' } }).lean()
      if (exist) _.throwError('alreadyBookmarked', context, 'article')

      const akg = await grpcController.fantasyArticleValidation({ iArticleId: body?.iArticleId })
      if (akg.nStatus !== 200) {
        _.throwError(akg.sMessage, context, 'fantasyArticle')
      }
      // const article = await articles.findById(iArticleId).lean()
      // if (article) _.throwError('notFound', context, 'article')

      oCreateBookmark.iArticleId = iArticleId
    }

    // check condition for video bookmark and validate video
    if (eBookmarkType === 'v') {
      if (!body.iVideoId) _.throwError('requiredField', context)
      const { iVideoId } = body
      const video = await VideosModel.findById(iVideoId).lean()
      if (!video) _.throwError('notFound', context, 'video')

      const exist = await bookmarks.findOne({ iVideoId: _.mongify(iVideoId), iUserId: _.mongify(iUserId), eStatus: { $ne: 'd' } }).lean()

      if (exist) _.throwError('alreadyBookmarked', context, 'video')

      oCreateBookmark.iVideoId = iVideoId
      oCreateBookmark.iCategoryId = video.iCategoryId
    }

    if (eBookmarkType === 'fa') {
      // add redis stream to check fantasy article validation......
      // addBookmarkForFantasyArticleStream(data)
      if (!body?.iArticleId) _.throwError('requiredField', context)
      // const akg = await grpcController.fantasyArticleValidation({ iArticleId: body?.iArticleId })
      // if (akg.nStatus !== 200) {
      //   _.throwError(akg.sMessage, context, akg?.sPrefix)
      // }
    }
    const data = await bookmarks.create(oCreateBookmark)

    const nTotal = await bookmarks.countDocuments({ iUserId: _.mongify(iUserId), eStatus: 'a' })
    console.log('added')
    await redis.redisclient.set(`bookmark_count:${iUserId}`, _.stringify({ iUserId, nTotal }))

    const word = eBookmarkType === 'v' ? 'videoBookmarked' : 'articleBookmarked'
    return _.resolve('successfully', { _id: data._id }, word, context)
  } catch (error) {
    return error
  }
}

controllers.listBookmarks = async (parent, { input }, context) => {
  try {
    const query = {}
    const { decodedToken } = context

    const { nSkip, nLimit } = getPaginationValues(input)

    const { iUserId } = decodedToken
    if (!iUserId) _.throwError('notFound', context, 'user')

    query.eStatus = { $ne: 'd' }
    if (iUserId) query.iUserId = _.mongify(iUserId)

    const nTotal = await bookmarks.countDocuments(query)

    const aResults = await bookmarks.find(query)
      .populate([
        { path: 'oArticle', populate: { path: 'oCategory' } },
        { path: 'oVideo' }
      ])
      .sort({ dCreated: -1 })
      .skip(parseInt(nSkip))
      .limit((parseInt(nLimit))).lean()
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.deleteBookmark = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const { iUserId } = context.decodedToken
    const deleteBookmark = await bookmarks.findOneAndUpdate({ _id: _.mongify(_id) }, { eStatus: 'd' }, { new: true }).lean()
    if (!deleteBookmark) return _.resolve('alreadyDeleted', null, 'bookmark', context)
    const nTotal = await bookmarks.countDocuments({ iUserId: _.mongify(iUserId), eStatus: 'a' })
    await redis.redisclient.set(`bookmark_count:${iUserId}`, _.stringify({ iUserId, nTotal }))
    return _.resolve('removeSuccess', null, 'bookmark', context)
  } catch (error) {
    return error
  }
}

controllers.getBookmarks = async (parent, { input }, context) => {
  try {
    const { iId, eType } = input
    const { decodedToken } = context
    const { iUserId } = decodedToken

    const query = { iUserId, eBookmarkType: eType, eStatus: 'a' }
    if (eType !== 'v') query.iArticleId = iId
    else query.iVideoId = iId

    const isExist = await bookmarks.findOne(query, { _id: 1 }).lean()

    return { bIsBookmarked: !!isExist, _id: isExist?._id }
  } catch (error) {
    return error
  }
}
module.exports = controllers
