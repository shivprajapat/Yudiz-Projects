const mongoose = require('mongoose')
const { eSeoType, eStatus } = require('../../enums')
const { SeoDBConnect } = require('../../../db_services/mongoose')

const seo = new mongoose.Schema(
  {
    iId: {
      type: mongoose.Schema.Types.ObjectId
    },
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
      enum: eSeoType.value
    },
    eSubType: {
      type: String
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
    iSeriesId: { type: mongoose.Schema.Types.ObjectId },
    sDTitle: { // Display Title
      type: String
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

module.exports = SeoDBConnect.model('seos', seo)
