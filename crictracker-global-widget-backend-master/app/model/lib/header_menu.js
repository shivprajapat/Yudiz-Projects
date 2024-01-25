const mongoose = require('mongoose')
const enums = require('../enums')

const menu = new mongoose.Schema(
  {
    sTitle: {
      type: String,
      required: true,
      trim: true
    },

    bIsMulti: { type: Boolean, default: false },

    oChildren: [{
      sTitle: { type: String, trim: true },
      sSlug: { type: String },
      sUrl: { type: String },
      eUrlTarget: { type: String, enum: enums.eUrlTarget.value, default: enums.eUrlTarget.default },
      eMenuType: {
        type: String,
        enum: enums.eMenuType.value,
        default: enums.eMenuType.default
      }
    }],
    sSlug: {
      type: String
    },
    sUrl: {
      type: String
    },
    eUrlTarget: {
      type: String,
      enum: enums.eUrlTarget.value,
      default: enums.eUrlTarget.default
    },
    eMenuType: {
      type: String,
      enum: enums.eMenuType.value,
      default: enums.eMenuType.default
    },
    nSort: {
      type: Number,
      default: 0
    },
    eStatus: {
      type: String,
      enum: enums.eStatus.value,
      default: enums.eStatus.default
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sTitle: 1 })

menu.index({ eStatus: 1, nSort: 1 })

module.exports = mongoose.model('header_menus', menu)
