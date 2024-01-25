const mongoose = require('mongoose')
const { eSeoRedirectType, eSeoType, eStatus, eSeoSubType } = require('../enums')

const seoredirects = new mongoose.Schema(
  {
    iId: { type: mongoose.Schema.Types.ObjectId },
    sOldUrl: { type: String, trim: true },
    sNewUrl: { type: String, trim: true },
    eCode: {
      type: Number,
      enum: eSeoRedirectType.value,
      default: eSeoRedirectType.default
    },
    eSeoType: {
      type: String,
      enum: eSeoType.value,
      default: eSeoType.default
    },
    eSubType: {
      type: String,
      enum: eSeoSubType.value
    },
    eStatus: {
      type: String,
      enum: eStatus.value,
      default: eStatus.default
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

seoredirects.index({ eStatus: 1, sOldUrl: 1 })
seoredirects.index({ eStatus: 1, sNewUrl: 1 })
seoredirects.index({ eStatus: 1 })
seoredirects.index({ eCode: 1 })
seoredirects.index({ sOldUrl: 1 })
seoredirects.index({ sOldUrl: -1 })
seoredirects.index({ sNewUrl: 1 })
seoredirects.index({ sNewUrl: -1 })
seoredirects.index({ eSeoType: 1 })
seoredirects.index({ eSeoType: -1 })
seoredirects.index({ eSubType: 1 })
seoredirects.index({ eSubType: -1 })

module.exports = mongoose.model('seoredirects', seoredirects)
