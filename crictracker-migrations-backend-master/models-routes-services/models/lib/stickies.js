const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const stickies = new mongoose.Schema(
  {
    iArticleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'articles'
    },
    iVideoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'videos'
    },
    iCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories'
    },
    oSticky: {
      bHome: {
        type: Boolean,
        nPriority: { type: Number }
      },
      bHomeCategory: {
        type: Boolean
      },
      bCategory: {
        type: Boolean
      }
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

stickies.virtual('oArticle', {
  ref: 'article',
  localField: 'iArticleId',
  foreignField: '_id',
  justOne: true
})

stickies.virtual('oCategory', {
  ref: 'categories',
  localField: 'iCategoryId',
  foreignField: '_id',
  justOne: true
})

stickies.virtual('oVideo', {
  ref: 'videos',
  localField: 'iVideoId',
  foreignField: '_id',
  justOne: true
})

module.exports = ArticleDBConnect.model('stickies', stickies)
