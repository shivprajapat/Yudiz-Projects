const mongoose = require('mongoose')
const { eSeoRedirectType, eSeoType, eStatus } = require('../../enums')
const { SeoDBConnect } = require('../../../db_services/mongoose')

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
    eStatus: {
      type: String,
      enum: eStatus.value,
      default: eStatus.default
    },
    eSubType: {
      type: String
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

module.exports = SeoDBConnect.model('seoredirects', seoredirects)
