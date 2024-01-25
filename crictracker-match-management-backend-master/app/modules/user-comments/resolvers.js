const { addFantasyUserComment, listFantasyComments, updateFantasyCommentStatus, listFantasyFrontComments, listFantasyFrontChildComments, getFantasyCommentCounts, listFantasyFrontCommentReportReason, reportFantasyComment, bulkFantasyCommentUpdate, deleteFantasyComment, deleteFantasyFrontComment, likeDislikeFantasyComment } = require('./controllers')

const Mutation = {
  addFantasyUserComment,
  reportFantasyComment,
  updateFantasyCommentStatus,
  bulkFantasyCommentUpdate,
  deleteFantasyComment,
  likeDislikeFantasyComment,
  deleteFantasyFrontComment
}

const Query = {
  listFantasyComments,
  listFantasyFrontComments,
  listFantasyFrontChildComments,
  getFantasyCommentCounts,
  listFantasyFrontCommentReportReason
}

const comment = {
  oCreatedBy: (com) => {
    return { __typename: 'user', _id: com.iSubmittedBy }
  }
}

const frontFantasyComment = {
  oCreatedBy: (com) => {
    return { __typename: 'user', _id: com.iSubmittedBy }
  }
}

const oFantasyComment = {
  oCreatedBy: (com) => {
    return { __typename: 'user', _id: com.iSubmittedBy }
  }
}

const resolvers = { Mutation, Query, comment, frontFantasyComment, oFantasyComment }
module.exports = resolvers
