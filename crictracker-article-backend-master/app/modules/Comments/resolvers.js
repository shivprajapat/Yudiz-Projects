const { addUserComment, reportComment, listComments, updateCommentStatus, bulkCommentUpdate, deleteComment, getCommentCounts, likeDislikeComment, listFrontComments, listFrontChildComments, deleteFrontComment, listFrontCommentReportReason, listFrontDeleteAccountReasons } = require('./controllers')

const Mutation = {
  addUserComment,
  reportComment,
  updateCommentStatus,
  bulkCommentUpdate,
  deleteComment,
  likeDislikeComment,
  deleteFrontComment
}

const Query = {
  listComments,
  listFrontComments,
  listFrontChildComments,
  getCommentCounts,
  listFrontCommentReportReason,
  listFrontDeleteAccountReasons
}

const comment = {
  oCreatedBy: (com) => {
    return { __typename: 'user', _id: com.iSubmittedBy }
  },
  oArticleSeo: (com) => {
    return { __typename: 'Seo', iId: com.oArticle?._id }
  }
}

const frontComment = {
  oCreatedBy: (com) => {
    return { __typename: 'user', _id: com.iSubmittedBy }
  }
}

const resolvers = { Mutation, Query, comment, frontComment }

module.exports = resolvers
