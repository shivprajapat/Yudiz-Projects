const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const articleFixTrackingsModel = {
  iId: { type: mongoose.Schema.Types.ObjectId },
  eType: { type: String, enum: ['a', 'fa', 'cms'], default: 'a' },
  oData: mongoose.Schema.Types.Mixed,
  eIssue: { type: String, enum: ['fix'], default: 'fix' },
  eStatus: {
    type: String,
    enum: ['a', 'i', 'd'],
    default: 'a'
  }
}

const articlefixtrackings = new mongoose.Schema(
  articleFixTrackingsModel,
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ iId: 1 })

module.exports = {
  articlefixtrackings: ArticleDBConnect.model('articlefixtrackings', articlefixtrackings),
  schema: articleFixTrackingsModel
}
