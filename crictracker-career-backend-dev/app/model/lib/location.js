const mongoose = require('mongoose')
const enums = require('../enums')

const location = new mongoose.Schema(
  {
    sTitle: { type: String, required: true, trim: true },
    eStatus: { type: String, enum: enums.eStatus.value, default: enums.eStatus.default }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sTitle: 1 })

location.index({ eStatus: 1 })

module.exports = mongoose.model('locations', location)
