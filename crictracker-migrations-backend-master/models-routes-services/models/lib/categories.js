const mongoose = require('mongoose')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const imageType = {
  sText: { type: String, trim: true },
  sCaption: { type: String, trim: true },
  sAttribute: { type: String, trim: true },
  sUrl: { type: String, trim: true }
}

const category = new mongoose.Schema(
  {
    sName: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    iSeriesId: {
      type: mongoose.Schema.Types.ObjectId
    },
    sContent: {
      type: String,
      trim: true
    },
    nCount: {
      type: Number,
      default: 0
    },
    eType: {
      type: String
    },
    oImg: {
      type: imageType
    },
    sUrl: { type: String, trim: true }, // Category image
    oSponsored: {
      type: {
        sTitle: { type: String, trim: true },
        sCompany: { type: String, trim: true },
        dStartDate: { type: Date },
        dEndDate: { type: Date }
      }
    },
    bIsSponsored: {
      type: Boolean,
      default: false
    },
    iSubmittedBy: {
      type: mongoose.Schema.Types.ObjectId
    },
    iProcessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins'
    },
    eStatus: {
      type: String
    },
    iParentId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

category.virtual('oParentCategory', {
  ref: 'categories',
  localField: 'iParentId',
  foreignField: '_id'
})

module.exports = ArticleDBConnect.model('categories', category)
