const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eCommentStatus } = require('../enums')

const reportReasons = {
  iReportReasonId: { type: ObjectId, ref: 'reportreasons' },
  iUserId: { type: ObjectId }
}

const usercomments = new mongoose.Schema({
  iSubmittedBy: { type: ObjectId },
  iProcessedBy: {
    type: ObjectId,
    ref: 'admins'
  },
  iArticleId: {
    type: ObjectId,
    ref: 'fantasyarticles'
  },
  sContent: {
    type: String
  },
  sOriginalContent: {
    type: String
  },
  oReportReason: [reportReasons],
  nReportCount: {
    type: Number,
    default: 0
  },
  nLikeCount: {
    type: Number,
    default: 0
  },
  nDislikeCount: {
    type: Number,
    default: 0
  },
  iParentId: { type: ObjectId, ref: 'usercomments' },
  eStatus: {
    type: String,
    enum: eCommentStatus.value,
    default: eCommentStatus.default
  }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

usercomments.index({ iArticleId: 1, eStatus: 1 })

usercomments.virtual('oParentComment', {
  ref: 'comment',
  localField: 'iParentId',
  foreignField: '_id',
  justOne: true
})

usercomments.virtual('oArticle', {
  ref: 'fantasyarticles',
  localField: 'iArticleId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('usercomments', usercomments)
