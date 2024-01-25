const { commentlogs, comments, articles, counts, commentLikes, reportReasons } = require('../../model')
const { getPaginationValues, queuePush } = require('../../utils')
const _ = require('../../../global')
const controllers = {}
const { CACHE_7, CACHE_3 } = require('../../../config')

const updateCommentCounts = async () => {
  try {
    const data = {}
    data.nAll = await comments.countDocuments({ eStatus: { $ne: 'd' } }).lean()
    data.nPending = await comments.countDocuments({ eStatus: 'p' }).lean()
    data.nApproved = await comments.countDocuments({ eStatus: 'a' }).lean()
    data.nSpam = await comments.countDocuments({ eStatus: 'sp' }).lean()
    data.nRejected = await comments.countDocuments({ eStatus: 'r' }).lean()
    data.nTrash = await comments.countDocuments({ eStatus: 't' }).lean()
    await counts.updateOne({ eType: 'c' }, data, { upsert: true })
    return
  } catch (error) {
    return error
  }
}

controllers.addUserComment = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId', 'sContent', 'iParentId'])
    const { iArticleId, sContent } = body

    const { decodedToken } = context
    if (!decodedToken.iUserId) _.throwError('authorizationError', context)

    const oCreateComment = { iSubmittedBy: decodedToken.iUserId, sContent, iArticleId }
    if (body.iParentId) {
      oCreateComment.iParentId = body.iParentId
    }
    const article = await articles.findById(iArticleId).lean().cache(CACHE_7, `articleData:${iArticleId}`)
    if (!article) _.throwError('notFound', context, 'article')

    if (article?.eState !== 'pub') _.throwError('commentNotAllowed', context, 'article')

    if (!article?.oAdvanceFeature?.bAllowComments) _.throwError('commentNotAllowed', context, 'article')
    if (!article?.oAdvanceFeature?.bRequireAdminApproval) oCreateComment.eStatus = 'a'

    const newComment = await comments.create(oCreateComment)
    await updateCommentCounts()
    queuePush('sanitizeContent', { sContent, _id: newComment._id })

    const sGeneral = (article?.oAdvanceFeature?.bRequireAdminApproval) ? 'postComment' : 'postSuccess'
    return _.resolve(sGeneral, { oData: newComment }, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.reportComment = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId', '_id', 'iReportReasonId'])
    const { iArticleId, _id, iReportReasonId } = body
    const { decodedToken } = context
    const { iUserId } = decodedToken

    const oLogComment = { iUserId, _id, iArticleId, sIpAddress: context.ip }
    const article = await articles.findById(iArticleId).lean().cache(CACHE_7, `articleData:${iArticleId}`)

    if (!article) _.throwError('notFound', context, 'article')
    const comment = await comments.findOne({ iArticleId: _.mongify(iArticleId), _id: _.mongify(_id) }).lean()

    if (!comment) _.throwError('notFound', context, 'comment')
    if (comment.eStatus !== 'a') _.throwError('notApprovedYet', context, 'comment')

    const exist = await commentlogs.findOne({ iArticleId: _.mongify(iArticleId), _id: _.mongify(_id), iUserId: _.mongify(iUserId) }).lean()

    if (exist) _.throwError('alreadyReported', context, 'comment')

    /** add report reson to comment */
    const query = { _id: _.mongify(iReportReasonId), eStatus: 'a', eType: 'comment' }
    const reason = await reportReasons.findOne(query).lean()
    if (!reason) _.throwError('invalid', context, 'reportreason')

    const reasonData = {
      sTitle: reason.sTitle,
      iReportReasonId,
      iUserId
    }
    let updateReportReasons = []
    if (comment.oReportReason) {
      updateReportReasons = comment.oReportReason
    }
    updateReportReasons.push(reasonData)

    // I didn't get below commented code, need to discuss.
    // const reportComment = await comments.updateOne({ _id: _.mongify(body._id), eStatus: 'sp' }, { $inc: { nReportCount: 1 }, oReportReason: updateReportReasons })
    const reportComment = await comments.updateOne({ _id: _.mongify(body._id) }, { $inc: { nReportCount: 1 }, oReportReason: updateReportReasons })
    if (!reportComment.modifiedCount) _.throwError('notFound', context, 'comment')

    if (article?.eVisibility === 'pb') oLogComment.bIsPublicComment = true
    await commentlogs.create(oLogComment)
    await updateCommentCounts()
    return _.resolve('reportedComment', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.listComments = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['eStatus', 'iArticleId'])
    const { eStatus, iArticleId } = body
    const query = {}

    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    if (sSearch) query.$or = [{ sContent: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }]
    query.eStatus = (eStatus === 'all' || !eStatus) ? { $ne: 'd' } : eStatus
    if (iArticleId) query.iArticleId = _.mongify(iArticleId)

    const nTotal = await comments.countDocuments(query)
    const aResults = await comments.find(query).populate({ path: 'oArticle', select: 'sTitle' }).sort({ ...sorting }).skip(parseInt(nSkip)).limit((parseInt(nSkip) + parseInt(nLimit))).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.updateCommentStatus = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'eStatus'])
    const { _id, eStatus } = body

    const { decodedToken } = context

    const iProcessedBy = decodedToken.iAdminId

    const comment = await comments.updateOne({ _id: _.mongify(_id) }, { eStatus, iProcessedBy })
    if (!comment.modifiedCount) _.throwError('notFound', context, 'comment')
    await updateCommentCounts()
    return _.resolve('updateSuccess', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.bulkCommentUpdate = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['aId', 'eStatus'])
    const { eStatus } = body
    let { aId } = body

    aId = aId.map(id => _.mongify(id))

    const { decodedToken } = context
    const iProcessedBy = decodedToken.iAdminId

    const comment = await comments.updateMany({ _id: { $in: aId } }, { eStatus, iProcessedBy })
    if (!comment.modifiedCount) _.throwError('notFound', context, 'comment')
    updateCommentCounts()
    return _.resolve('updateSuccess', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.deleteComment = async (parent, { input }, context) => {
  try {
    const { _id } = input

    await comments.deleteOne({ _id: _.mongify(_id) })
    updateCommentCounts()

    return _.resolve('deleteSuccess', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.getCommentCounts = async (parent, { input }, context) => {
  try {
    updateCommentCounts()
    const data = await counts.findOne({ eType: 'c' }).lean()
    return data || {}
  } catch (error) {
    return error
  }
}

controllers.listFrontComments = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId'])
    const { iArticleId } = body
    const query = { iParentId: null }

    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    if (iArticleId) query.iArticleId = _.mongify(iArticleId)
    query.eStatus = 'a'

    const nTotal = await comments.countDocuments(query)
    const aResults = await comments.aggregate([
      {
        $match: query
      },
      { $sort: sorting },
      { $skip: parseInt(nSkip) },
      { $limit: parseInt(nLimit) },
      { $lookup: { from: 'comments', localField: '_id', foreignField: 'iParentId', as: 'replies' } },
      { $addFields: { nReplies: { $size: '$replies' } } },
      { $lookup: { from: 'articles', localField: 'iArticleId', foreignField: '_id', as: 'oArticle' } },
      { $unwind: { path: '$oArticle', preserveNullAndEmptyArrays: true } }
    ])

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.listFrontChildComments = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iCommentId'])
    const { iCommentId } = body
    const query = { iParentId: _.mongify(iCommentId) }

    const { nSkip, nLimit } = getPaginationValues(input)
    const sorting = { dCreated: -1 }
    query.eStatus = 'a'
    const nTotal = await comments.countDocuments(query)
    const aResults = await comments.aggregate([
      {
        $match: query
      },
      { $skip: parseInt(nSkip) },
      { $limit: parseInt(nSkip) + parseInt(nLimit) },
      { $sort: sorting },
      { $lookup: { from: 'comments', localField: '_id', foreignField: 'iParentId', as: 'replies' } },
      { $addFields: { nReplies: { $size: '$replies' } } },
      { $lookup: { from: 'articles', localField: 'iArticleId', foreignField: '_id', as: 'oArticle' } },
      { $unwind: { path: '$oArticle', preserveNullAndEmptyArrays: true } }
    ])

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.likeDislikeComment = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId', 'iCommentId', 'likeType'])
    const { iArticleId, iCommentId, likeType } = body
    const { iUserId } = _.decodeToken(context.headers.authorization)

    const article = await articles.findById(iArticleId).lean().cache(CACHE_7, `articleData:${iArticleId}`)
    if (!article) _.throwError('notFound', context, 'article')

    const comment = await comments.findOne({ iArticleId: _.mongify(iArticleId), _id: _.mongify(iCommentId) }).lean()
    if (!comment) _.throwError('notFound', context, 'comment')

    const commentLike = await commentLikes.findOne({ iArticleId: _.mongify(iArticleId), iCommentId: _.mongify(iCommentId), iUserId: _.mongify(iUserId) }).lean()

    let responseMessage = 'commentLike'
    if (commentLike) {
      const currentLike = commentLike.eLikeStatus

      // check current like status same or diffenrt
      if (likeType !== currentLike) {
        // if current like status diffent then update comment like/dislike count
        if (likeType === 'like') {
          let updateDislikeCount = 0
          if (comment.nDislikeCount) {
            updateDislikeCount = (comment.nDislikeCount - 1)
          }
          updateDislikeCount = (updateDislikeCount < 0) ? 0 : updateDislikeCount

          let updateLikeCount = 1
          if (comment.nLikeCount) {
            updateLikeCount = (comment.nLikeCount + 1)
          }

          await comments.updateOne({ _id: _.mongify(comment._id) }, { nDislikeCount: updateDislikeCount, nLikeCount: updateLikeCount })
        } else {
          let updateLikeCount = 0
          if (comment.nDislikeCount) {
            updateLikeCount = (comment.nLikeCount - 1)
          }
          updateLikeCount = (updateLikeCount < 0) ? 0 : updateLikeCount
          let updateDislikeCount = 1
          if (comment.nDislikeCount) {
            updateDislikeCount = (comment.nDislikeCount + 1)
          }
          responseMessage = 'commentDislike'
          await comments.updateOne({ _id: _.mongify(comment._id) }, { nLikeCount: updateLikeCount, nDislikeCount: updateDislikeCount })
        }
      }
      await commentLikes.updateOne({ _id: _.mongify(commentLike._id) }, { eLikeStatus: likeType })
    } else {
      // Update comment like/dislike count
      if (likeType === 'like') {
        let updateLikeCount = 1
        if (comment.nLikeCount) {
          updateLikeCount = (comment.nLikeCount + 1)
        }
        await comments.updateOne({ _id: _.mongify(comment._id) }, { nLikeCount: updateLikeCount })
      } else {
        let updateDislikeCount = 1
        if (comment.nDislikeCount) {
          updateDislikeCount = (comment.nDislikeCount + 1)
        }
        responseMessage = 'commentDislike'
        await comments.updateOne({ _id: _.mongify(comment._id) }, { nDislikeCount: updateDislikeCount })
      }
      // Update user coment like status
      const data = {
        iUserId,
        iCommentId,
        iArticleId,
        eLikeStatus: likeType
      }

      await commentLikes.create(data)
    }

    updateCommentCounts()
    return _.resolve('commentLikeDislikeSuccess', null, responseMessage, context)
  } catch (error) {
    return error
  }
}

controllers.deleteFrontComment = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const { iUserId } = _.decodeToken(context.headers.authorization)

    const comment = await comments.findOne({ _id: _.mongify(_id) }).lean()
    if (!comment) _.throwError('notFound', context, 'comment')

    if (_.stringify(comment.iSubmittedBy) !== _.stringify(iUserId)) {
      _.throwError('cantDeleteComment', context, '')
    }

    const article = await articles.findById(comment.iArticleId).lean().cache(CACHE_7, `articleData:${comment.iArticleId}`)
    if (!article) _.throwError('notFound', context, 'article')

    await comments.deleteOne({ _id: _.mongify(_id) })

    return _.resolve('removeSuccess', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.listFrontCommentReportReason = async (parent, { input }, context) => {
  try {
    const query = { eType: 'comment', eStatus: 'a' }
    const aResults = await reportReasons.find(query).sort({ nSort: 1 }).lean().cache(CACHE_3, 'reportReasons')
    return aResults
  } catch (error) {
    return error
  }
}

controllers.listFrontDeleteAccountReasons = async (parent, { input }, context) => {
  try {
    const query = { eType: 'delete_user_account', eStatus: 'a' }
    const aResults = await reportReasons.find(query).sort({ nSort: 1 }).lean().cache(CACHE_3, 'reportReasons')
    return aResults
  } catch (error) {
    return error
  }
}

module.exports = controllers
