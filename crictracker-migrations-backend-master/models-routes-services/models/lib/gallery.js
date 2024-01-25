const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const gallery = new mongoose.Schema({
  aArticleIds: [{ type: mongoose.Schema.Types.ObjectId }],
  aFArticleIds: [{ type: mongoose.Schema.Types.ObjectId }],
  sUrl: {
    type: String,
    unique: true
  },
  sText: {
    type: String,
    trim: true
  },
  sCaption: {
    type: String,
    trim: true
  },
  sAttribute: {
    type: String,
    trim: true
  },
  oMeta: {
    nWidth: {
      type: Number
    },
    nHeight: {
      type: Number
    },
    nSize: {
      type: Number
    }
  },
  eStatus: {
    type: String
  },
  iAuthorId: {
    type: mongoose.Schema.Types.ObjectId
  },
  aCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories'
  }],
  id: {
    type: Number
  },
  dCreated: Date,
  dUpdated: Date
}
// , { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' }
// }
)

module.exports = ArticleDBConnect.model('gallery', gallery)
