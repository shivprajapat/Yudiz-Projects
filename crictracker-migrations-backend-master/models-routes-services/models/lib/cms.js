const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const cmsModel = {
  sTitle: { type: String, required: true, trim: true },
  sContent: { type: String, trim: true },
  sAmpContent: { type: String, trim: true },
  eStatus: {
    type: String,
    enum: ['a', 'i', 'd'],
    default: 'a'
  }
}

const cmspages = new mongoose.Schema(
  cmsModel,
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ eStatus: 1 })

module.exports = {
  cms: ArticleDBConnect.model('cmspages', cmspages),
  schema: cmsModel
}
