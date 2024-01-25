const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider, eStandingsType } = require('../enums')

const SeriesRounds = new mongoose.Schema({
  iSeriesId: { type: ObjectId, ref: 'series' },
  sKey: { type: String, required: true },
  nOrder: { type: Number, required: true },
  sName: { type: String },
  sType: { type: String },
  dStartDate: { type: Date },
  dEndDate: { type: Date },
  sMatchFormat: { type: String },
  eType: { type: String, enum: eStandingsType.value, default: eStandingsType.default },
  eProvider: { type: String, enum: eProvider.value }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

SeriesRounds.index({ iSeriesId: 1, sKey: 1 })
SeriesRounds.index({ iSeriesId: 1, nOrder: 1 })

module.exports = mongoose.model('series_rounds', SeriesRounds)
