const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const AmpBrokenArticlesModel = {
  iId: { type: mongoose.Schema.Types.ObjectId },
  eType: { type: String, enum: ['a', 'fa', 'cms'], default: 'a' },
  oData: mongoose.Schema.Types.Mixed,
  eIssue: { type: String, enum: ['amp', 'link', 'image'], default: 'amp' },
  eStatus: {
    type: String,
    enum: ['a', 'i', 'd'],
    default: 'a'
  }
}

const ampbrokenarticles = new mongoose.Schema(
  AmpBrokenArticlesModel,
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ eStatus: 1 })

module.exports = {
  ampbrokenarticles: ArticleDBConnect.model('ampbrokenarticles', ampbrokenarticles),
  schema: AmpBrokenArticlesModel
}
