const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider } = require('../enums')

const SeriesData = new mongoose.Schema({
  iSeriesId: { type: ObjectId, ref: 'series' },
  aMatches: [
    { type: ObjectId, ref: 'matches' }
  ],
  aVenues: [
    { type: ObjectId, ref: 'venues' }
  ],
  aTeams: [
    { type: ObjectId, ref: 'teams' }
  ],
  eProvider: {
    type: String,
    enum: eProvider.value,
    default: eProvider.default
  }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ iSeriesId: 1 })

module.exports = mongoose.model('series_data', SeriesData)
