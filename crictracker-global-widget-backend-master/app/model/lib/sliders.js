const mongoose = require('mongoose')
const enums = require('../enums')

const imageType = {
  sText: { type: String, trim: true },
  sCaption: { type: String, trim: true },
  sAttribute: { type: String, trim: true },
  sUrl: { type: String, trim: true }
}

const sliders = new mongoose.Schema(
  {
    sName: { type: String, required: true, trim: true },
    oImg: { type: imageType },
    sSlug: { type: String, trim: true },
    nPriority: { type: Number },
    bIsMulti: { type: Boolean, default: false },
    aSlide: [{
      sName: { type: String, trim: true },
      sSlug: { type: String, trim: true }
    }],
    eStatus: {
      type: String,
      enum: enums.eStatus.value,
      default: enums.eStatus.default
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ eStatus: 1 })

sliders.index({ eStatus: 1, eType: 1, nPriority: 1 })

module.exports = mongoose.model('sliders', sliders)
