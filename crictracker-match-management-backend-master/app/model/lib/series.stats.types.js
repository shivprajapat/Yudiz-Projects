const mongoose = require('mongoose')
const { eStatisticsTypes, eProvider, eStatisticsTypesFullName, eSubType } = require('../enums')

const SeriesStatsTypes = new mongoose.Schema({
  eGroupTitle: {
    type: String,
    enum: eStatisticsTypes.value,
    default: eStatisticsTypes.default
  },
  sType: {
    type: String,
    trim: true,
    required: true
  },
  eFullTitle: {
    type: String,
    enum: eStatisticsTypesFullName.value,
    default: eStatisticsTypesFullName.default,
    trim: true
  },
  aHeaders: {
    type: [Array],
    required: true
  },
  sDescription: { type: String, trim: true },
  eProvider: {
    type: String,
    enum: eProvider.value
  },
  nPriority: {
    type: Number
  },
  eSubType: {
    type: String,
    enum: eSubType.value
  }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ iSeriesId: 1 })

SeriesStatsTypes.index({ sType: 1 })

module.exports = mongoose.model('seriesStatsTypes', SeriesStatsTypes)
