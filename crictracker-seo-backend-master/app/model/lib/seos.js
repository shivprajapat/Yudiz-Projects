const mongoose = require('mongoose')
const { eSeoType, eStatus, eSeoSubType } = require('../enums')

const seo = new mongoose.Schema(
  {
    iId: {
      type: mongoose.Schema.Types.ObjectId
    },
    aSeoRIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'seoredirects' }], // SEO Redirect Ids
    sTitle: { type: String, trim: true },
    sDescription: { type: String, trim: true },
    sSlug: { type: String, trim: true },
    aKeywords: [{ type: String, trim: true }],
    oFB: {
      type: {
        sTitle: { type: String, trim: true },
        sDescription: { type: String, trim: true },
        sUrl: { type: String, trim: true },
        oMeta: {
          nSize: { type: Number },
          nWidth: { type: Number },
          nHeight: { type: Number }
        }
      }
    },
    oTwitter: {
      type: {
        sTitle: { type: String, trim: true },
        sDescription: { type: String, trim: true },
        sUrl: { type: String, trim: true },
        oMeta: {
          nSize: { type: Number },
          nWidth: { type: Number },
          nHeight: { type: Number }
        }
      }
    },
    eType: {
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
    },
    // sCUrl => Canonical url
    sCUrl: { type: String, trim: true },
    sRobots: { type: String, trim: true },
    iUpdatedBy: { type: mongoose.Schema.Types.ObjectId },
    eSchemaType: { type: String, enum: ['ar', 'nar'] },
    bIsDeletable: { type: Boolean, default: true },
    bGone: { type: Boolean, default: false },
    eTabType: {
      type: String,
      enum: ['standings', 'stats', 'teams', 'squads', 'fixtures']
    },
    sContent: {
      type: String
    },
    sAmpContent: {
      type: String
    },
    sDTitle: { // Display Title
      type: String
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ iId: 1, sSlug: 1 })

seo.index({ sSlug: 1, eStatus: 1 })
seo.index({ iId: -1 })
seo.index({ eType: 1 })
seo.index({ eType: -1 })
seo.index({ eSubType: 1 })
seo.index({ eSubType: -1 })

module.exports = mongoose.model('seos', seo)
