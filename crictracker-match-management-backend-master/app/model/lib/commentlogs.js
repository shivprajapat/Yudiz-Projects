const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const commentlogs = new mongoose.Schema({
  iUserId: { type: ObjectId },
  iArticleId: { type: ObjectId, ref: 'fantasyarticles' },
  iCommentId: { type: ObjectId, ref: 'usercomments' },
  sReason: { type: String, trim: true },
  sIpAddress: { type: String, required: true },
  bIsPublicComment: { type: Boolean, default: false },
  dCreated: { type: Date, default: Date.now() }
})

commentlogs.index({ iCommentId: 1, iArticleId: 1 })

module.exports = mongoose.model('commentlogs', commentlogs)
