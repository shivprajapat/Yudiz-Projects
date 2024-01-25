const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const imageType = {
  sText: { type: String, trim: true },
  sCaption: { type: String, trim: true },
  sAttribute: { type: String, trim: true },
  sUrl: { type: String, trim: true }
}
const category = {
  _id: { type: String, trim: true },
  sName: { type: String, trim: true },
  sContent: { type: String, trim: true }
}

const cricspecial = new mongoose.Schema(
  {
    iArticleId: { type: ObjectId },
    sTitle: { type: String, required: true, trim: true },
    sSubtitle: { type: String, trim: true },
    // sShortTitle
    sSrtTitle: { type: String, trim: true },
    // oFeatureImage
    oImg: { type: imageType },
    // oThumbnail
    oTImg: { type: imageType },
    dPublishDate: { type: Date },
    nDuration: { type: Number, default: 0 },
    oCategory: { type: category }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sTitle: 1 })

cricspecial.index({ dPublishDate: -1 })

module.exports = mongoose.model('cricspecials', cricspecial)
