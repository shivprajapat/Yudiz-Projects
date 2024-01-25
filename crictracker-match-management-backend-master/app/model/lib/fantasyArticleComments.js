const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const fantasyArticleComments = new mongoose.Schema(
  {
    iArticleId: { type: ObjectId, ref: 'article' },
    iSenderId: { type: ObjectId },
    iReceiverId: { type: ObjectId },
    sMessage: { type: String, trim: true },
    dSentDate: { type: Date, default: Date.now() },
    aPic: [{ type: String }]
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ iArticleId: 1 })

module.exports = mongoose.model('fantasyArticleComments', fantasyArticleComments)
