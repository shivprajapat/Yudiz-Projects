const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const imageType = {
  sText: { type: String, trim: true },
  sCaption: { type: String, trim: true },
  sAttribute: { type: String, trim: true },
  sUrl: { type: String, trim: true },
  oMeta: {
    nWidth: { type: Number },
    nHeight: { type: Number },
    nSize: { type: Number }
  }
}

const oAdvanceFeatureType = {
  bAllowComments: { type: Boolean, default: false },
  bRequireAdminApproval: { type: Boolean, default: false },
  bAmp: { type: Boolean, default: false },
  bFBEnable: { type: Boolean, default: false },
  bBrandedContent: { type: Boolean, default: false },
  bExclusiveArticle: { type: Boolean, default: false },
  bEditorsPick: { type: Boolean, default: false }
}

const articleModel = {
  iAuthorId: {
    type: ObjectId,
    ref: 'admins',
    required: true
  },

  iAuthorDId: { // Display Author
    type: ObjectId,
    ref: 'admins',
    required: true
  },
  iReviewerId: {
    type: ObjectId,
    ref: 'admins'
  },
  eVisibility: {
    type: String
  },
  // Publish on priority
  bPriority: {
    type: Boolean,
    default: false
  },
  sTitle: {
    type: String,
    required: true,
    trim: true
  },
  sSubtitle: {
    type: String,
    trim: true
  },
  // sShortTitle
  sSrtTitle: {
    type: String,
    required: false,
    trim: true
  },
  sContent: {
    type: String,
    trim: true
  },
  sInsContent: { // Instant article.
    type: String
  },
  sAmpContent: { // This is for amp content
    type: String
  },
  eStatus: {
    type: String
  },
  eState: {
    type: String
  },
  // oFeatureImage
  oImg: {
    type: imageType
  },
  // oThumbnail
  oTImg: {
    type: imageType
  },

  oCategories: { //! deprecated
    type: {
      aCategoryId: [{
        type: ObjectId,
        ref: 'categories'
      }],
      iPrimaryId: {
        type: ObjectId,
        ref: 'categories'
      }
    }
  },
  iCategoryId: { type: ObjectId, ref: 'categories' },
  aSeries: [{ type: ObjectId, ref: 'categories' }],
  aPlayer: [{ type: ObjectId, ref: 'tags' }],
  aTeam: [{ type: ObjectId, ref: 'tags' }],
  aVenue: [{ type: ObjectId, ref: 'tags' }],
  aTags: {
    type: [ObjectId],
    ref: 'tags'
  },
  oAdvanceFeature: {
    type: oAdvanceFeatureType
  },
  sDescription: {
    type: String,
    trim: true
  },
  nOViews: {
    type: Number
  },
  eType: {
    type: String
  },
  nDuration: {
    type: Number,
    default: 0
  },
  dPublishDate: {
    type: Date
  },
  dPublishDisplayDate: {
    type: Date
  },
  dModifiedDate: {
    type: Date
  },
  sEditorNotes: { type: String, trim: true },
  nClaps: {
    type: Number,
    default: 0
  },
  nViewCount: {
    type: Number,
    default: 0
  },
  bOld: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number
  },
  bIsListicleArticle: {
    type: Boolean
  },
  oListicleArticle: {
    nTotal: Number,
    oPageContent: [String],
    oAmpPageContent: [String]
  },
  bUpdated: {
    type: Boolean
  },
  iEventId: {
    type: ObjectId
  }
}

const article = new mongoose.Schema(articleModel,
  {
    timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

article.virtual('oCategory', {
  ref: 'categories',
  localField: 'iCategoryId',
  foreignField: '_id',
  justOne: true
})

article.virtual('oParentCategory', {
  ref: 'categories',
  localField: 'iParentId',
  foreignField: '_id',
  justOne: true
})

module.exports = {
  articles: ArticleDBConnect.model('article', article),
  schema: articleModel
}
