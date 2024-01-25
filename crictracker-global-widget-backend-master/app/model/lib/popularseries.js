const mongoose = require('mongoose')
const enums = require('../enums')

// Model for current popular series...
const popularSeries = new mongoose.Schema(
  {
    nPriority: {
      type: Number,
      required: true
    },
    iSeriesId: { // series id
      type: mongoose.Types.ObjectId,
      required: true
    },
    eStatus: {
      type: String,
      enum: enums.eStatus.value,
      default: enums.eStatus.default
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sSlug: 1 })

popularSeries.index({ nPriority: 1 })
popularSeries.index({ eStatus: 1 })
popularSeries.index({ iSeriesId: 1 })

module.exports = mongoose.model('popularseries', popularSeries)
