const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const articleattachments = new mongoose.Schema({
  iArticleId: { type: ObjectId, ref: 'article' },
  oAttach: [{
    eType: {
      type: String
    },
    iImageId: { type: ObjectId }
  }]
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

module.exports = ArticleDBConnect.model('articleattachments', articleattachments)
