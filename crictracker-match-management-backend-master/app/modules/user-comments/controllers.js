const { CommentLogsModel, UserCommentsModel, fantasyarticles: FantasyArticlesModel, UserCommentLikesModel, ReportReasonsModel, CountsModel } = require('../../model')
const { getPaginationValues, queuePush } = require('../../utils')
// const { getPaginationValues } = require('../../utils')
const _ = require('../../../global')
const controllers = {}

const updateCommentCounts = async () => {
  try {
    const data = {}
    data.nAll = await UserCommentsModel.countDocuments({ eStatus: { $ne: 'd' } }).lean()
    data.nPending = await UserCommentsModel.countDocuments({ eStatus: 'p' }).lean()
    data.nApproved = await UserCommentsModel.countDocuments({ eStatus: 'a' }).lean()
    data.nSpam = await UserCommentsModel.countDocuments({ eStatus: 'sp' }).lean()
    data.nRejected = await UserCommentsModel.countDocuments({ eStatus: 'r' }).lean()
    data.nTrash = await UserCommentsModel.countDocuments({ eStatus: 't' }).lean()
    await CountsModel.updateOne({ eType: 'c' }, data, { upsert: true })
  } catch (error) {
    return error
  }
}

controllers.addFantasyUserComment = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId', 'sContent', 'iParentId'])
    const { iArticleId, sContent } = body

    const { decodedToken } = context
    if (!decodedToken.iUserId) _.throwError('authorizationError', context)

    const oCreateComment = { iSubmittedBy: decodedToken.iUserId, sContent, iArticleId }
    if (body.iParentId) {
      oCreateComment.iParentId = body.iParentId
    }
    const article = await FantasyArticlesModel.findById(iArticleId, { oAdvanceFeature: 1, eState: 1 }).lean()
    if (!article) _.throwError('notFound', context, 'fantasyarticle')

    if (article?.eState !== 'pub') _.throwError('commentNotAllowed', context, 'fantasyarticle')

    if (!article?.oAdvanceFeature?.bAllowComments) _.throwError('commentNotAllowed', context, 'fantasyarticle')
    if (!article?.oAdvanceFeature?.bRequireAdminApproval) oCreateComment.eStatus = 'a'

    const newComment = await UserCommentsModel.create(oCreateComment)
    updateCommentCounts()
    await queuePush('sanitizeContent', { sContent, _id: newComment._id })

    const sGeneral = (article?.oAdvanceFeature?.bRequireAdminApproval) ? 'postComment' : 'postSuccess'
    return _.resolve(sGeneral, { oData: newComment }, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.reportFantasyComment = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId', '_id', 'iReportReasonId'])
    const { iArticleId, _id, iReportReasonId } = body
    const { decodedToken } = context
    const { iUserId } = decodedToken

    const oLogComment = { iUserId, _id, iArticleId, sIpAddress: context.ip }
    const article = await FantasyArticlesModel.findById(iArticleId, { oAdvanceFeature: 1, eState: 1, eVisibility: 1 }).lean()

    if (!article) _.throwError('notFound', context, 'fantasyarticle')
    const comment = await UserCommentsModel.findOne({ iArticleId: _.mongify(iArticleId), _id: _.mongify(_id) }).lean()

    if (!comment) _.throwError('notFound', context, 'comment')
    if (comment.eStatus !== 'a') _.throwError('notApprovedYet', context, 'comment')

    const exist = await CommentLogsModel.findOne({ iArticleId: _.mongify(iArticleId), _id: _.mongify(_id), iUserId: _.mongify(iUserId) }).lean()

    if (exist) _.throwError('alreadyReported', context, 'comment')

    /** add report reson to comment */
    const query = { _id: _.mongify(iReportReasonId), eStatus: 'a', eType: 'comment' }
    const reason = await ReportReasonsModel.findOne(query).lean()
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
    const reportComment = await UserCommentsModel.updateOne({ _id: _.mongify(body._id) }, { $inc: { nReportCount: 1 }, oReportReason: updateReportReasons })
    if (!reportComment.modifiedCount) _.throwError('notFound', context, 'comment')

    if (article?.eVisibility === 'pb') oLogComment.bIsPublicComment = true
    await CommentLogsModel.create(oLogComment)
    updateCommentCounts()
    return _.resolve('reportedComment', null, 'comment', context)
  } catch (error) {
    return error
  }
}

// admin service --> for admin approval
controllers.listFantasyComments = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['eStatus', 'iArticleId'])
    const { eStatus, iArticleId } = body
    const query = {}

    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    if (sSearch) query.$or = [{ sContent: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }]
    query.eStatus = (eStatus === 'all' || !eStatus) ? { $ne: 'd' } : eStatus
    if (iArticleId) query.iArticleId = _.mongify(iArticleId)

    const nTotal = await UserCommentsModel.countDocuments(query)
    const aResults = await UserCommentsModel.find(query).populate({ path: 'oArticle', select: 'sTitle' }).sort({ ...sorting }).skip(parseInt(nSkip)).limit((parseInt(nSkip) + parseInt(nLimit)))

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.updateFantasyCommentStatus = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'eStatus'])
    const { _id, eStatus } = body

    const { decodedToken } = context

    const iProcessedBy = decodedToken.iAdminId

    const comment = await UserCommentsModel.updateOne({ _id: _.mongify(_id) }, { eStatus, iProcessedBy })
    if (!comment.modifiedCount) _.throwError('notFound', context, 'comment')
    updateCommentCounts()
    return _.resolve('updateSuccess', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.bulkFantasyCommentUpdate = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['aId', 'eStatus'])
    const { eStatus } = body
    let { aId } = body

    aId = aId.map(id => _.mongify(id))

    const { decodedToken } = context
    const iProcessedBy = decodedToken.iAdminId

    const comment = await UserCommentsModel.updateMany({ _id: { $in: aId } }, { eStatus, iProcessedBy })
    if (!comment.modifiedCount) _.throwError('notFound', context, 'comment')
    updateCommentCounts()
    return _.resolve('updateSuccess', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.deleteFantasyComment = async (parent, { input }, context) => {
  try {
    const { _id } = input

    await UserCommentsModel.deleteOne({ _id: _.mongify(_id) })
    updateCommentCounts()

    return _.resolve('deleteSuccess', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.getFantasyCommentCounts = async (parent, { input }, context) => {
  try {
    await updateCommentCounts()
    const data = await CountsModel.findOne({ eType: 'c' }).lean()
    return data || {}
  } catch (error) {
    return error
  }
}

controllers.listFantasyFrontComments = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId'])
    const { iArticleId } = body
    const query = { iParentId: null }

    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    if (iArticleId) query.iArticleId = _.mongify(iArticleId)
    query.eStatus = 'a'
    const nTotal = await UserCommentsModel.countDocuments(query)
    const aResults = await UserCommentsModel.aggregate([
      {
        $match: query
      },
      { $sort: sorting },
      { $limit: parseInt(nSkip) + parseInt(nLimit) },
      { $skip: parseInt(nSkip) },
      { $lookup: { from: 'usercomments', localField: '_id', foreignField: 'iParentId', as: 'replies' } },
      { $addFields: { nReplies: { $size: '$replies' } } },
      { $lookup: { from: 'fantasyarticles', localField: 'iArticleId', foreignField: '_id', as: 'oArticle' } },
      { $unwind: { path: '$oArticle', preserveNullAndEmptyArrays: true } }
    ])

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.listFantasyFrontChildComments = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iCommentId'])
    const { iCommentId } = body
    const query = { iParentId: _.mongify(iCommentId) }

    const { nSkip, nLimit } = getPaginationValues(input)
    const sorting = { dCreated: -1 }
    query.eStatus = 'a'
    const nTotal = await UserCommentsModel.countDocuments(query)
    const aResults = await UserCommentsModel.aggregate([
      {
        $match: query
      },
      { $limit: parseInt(nSkip) + parseInt(nLimit) },
      { $skip: parseInt(nSkip) },
      { $sort: sorting },
      { $lookup: { from: 'usercomments', localField: '_id', foreignField: 'iParentId', as: 'replies' } },
      { $addFields: { nReplies: { $size: '$replies' } } },
      { $lookup: { from: 'fantasyarticles', localField: 'iArticleId', foreignField: '_id', as: 'oArticle' } },
      { $unwind: { path: '$oArticle', preserveNullAndEmptyArrays: true } }
    ])

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.likeDislikeFantasyComment = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId', 'iCommentId', 'likeType'])
    const { iArticleId, iCommentId, likeType } = body
    const { iUserId } = _.decodeToken(context.headers.authorization)

    const article = await FantasyArticlesModel.findById(iArticleId, { oAdvanceFeature: 1, eState: 1, eVisibility: 1 }).lean()
    if (!article) _.throwError('notFound', context, 'fantasyarticle')

    const comment = await UserCommentsModel.findOne({ iArticleId: _.mongify(iArticleId), _id: _.mongify(iCommentId) }).lean()
    if (!comment) _.throwError('notFound', context, 'comment')

    const commentLike = await UserCommentLikesModel.findOne({ iArticleId: _.mongify(iArticleId), iCommentId: _.mongify(iCommentId), iUserId: _.mongify(iUserId) }).lean()

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

          await UserCommentsModel.updateOne({ _id: _.mongify(comment._id) }, { nDislikeCount: updateDislikeCount, nLikeCount: updateLikeCount })
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
          await UserCommentsModel.updateOne({ _id: _.mongify(comment._id) }, { nLikeCount: updateLikeCount, nDislikeCount: updateDislikeCount })
        }
      }
      await UserCommentLikesModel.updateOne({ _id: _.mongify(commentLike._id) }, { eLikeStatus: likeType })
    } else {
      // Update comment like/dislike count
      if (likeType === 'like') {
        let updateLikeCount = 1
        if (comment.nLikeCount) {
          updateLikeCount = (comment.nLikeCount + 1)
        }
        await UserCommentsModel.updateOne({ _id: _.mongify(comment._id) }, { nLikeCount: updateLikeCount })
      } else {
        let updateDislikeCount = 1
        if (comment.nDislikeCount) {
          updateDislikeCount = (comment.nDislikeCount + 1)
        }
        responseMessage = 'commentDislike'
        await UserCommentsModel.updateOne({ _id: _.mongify(comment._id) }, { nDislikeCount: updateDislikeCount })
      }
      // Update user coment like status
      const data = {
        iUserId,
        iCommentId,
        iArticleId,
        eLikeStatus: likeType
      }

      await UserCommentLikesModel.create(data)
    }

    updateCommentCounts()
    return _.resolve('commentLikeDislikeSuccess', null, responseMessage, context)
  } catch (error) {
    return error
  }
}

controllers.deleteFantasyFrontComment = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const { iUserId } = _.decodeToken(context.headers.authorization)

    const comment = await UserCommentsModel.findOne({ _id: _.mongify(_id) }).lean()
    if (!comment) _.throwError('notFound', context, 'comment')

    if (_.stringify(comment.iSubmittedBy) !== _.stringify(iUserId)) {
      _.throwError('cantDeleteComment', context, '')
    }

    const article = await FantasyArticlesModel.findById(comment.iArticleId).lean()
    if (!article) _.throwError('notFound', context, 'fantasyarticle')

    await UserCommentsModel.deleteOne({ _id: _.mongify(_id) })

    return _.resolve('removeSuccess', null, 'comment', context)
  } catch (error) {
    return error
  }
}

controllers.listFantasyFrontCommentReportReason = async (parent, { input }, context) => {
  try {
    const query = { eType: 'comment', eStatus: 'a' }
    const aResults = await ReportReasonsModel.find(query).sort({ nSort: 1 }).lean()
    return aResults
  } catch (error) {
    return error
  }
}

module.exports = controllers
