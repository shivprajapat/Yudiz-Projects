const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider } = require('../enums')

const SeriesStats = new mongoose.Schema({
  iSeriesId: { type: ObjectId, ref: 'series' },
  iSeriesStatsId: { type: ObjectId, ref: 'seriesStatsTypes' },
  iPlayerId: { type: ObjectId, ref: 'players' },
  iTeamId: { type: ObjectId, ref: 'teams' },
  nAverage: { type: Number, default: 0 },
  nRuns: { type: Number, default: 0 },
  nInnings: { type: Number, default: 0 },
  sStrike: { type: Number, default: 0 },
  nRun4: { type: Number, default: 0 },
  nRun6: { type: Number, default: 0 },
  nMatches: { type: Number, default: 0 },
  nNotout: { type: Number, default: 0 },
  nBalls: { type: Number, default: 0 },
  nHighest: { type: Number, default: 0 },
  nRun100: { type: Number, default: 0 },
  nRun50: { type: Number, default: 0 },
  nCatches: { type: Number, default: 0 },
  nStumpings: { type: Number, default: 0 },
  nOvers: { type: Number, default: 0 },
  nWickets: { type: Number, default: 0 },
  sBestInning: { type: String },
  nInningNumerator: { type: Number },
  nInningDenominator: { type: Number },
  sBestMatch: { type: String },
  nEcon: { type: Number, default: 0 },
  nWicket4i: { type: Number, default: 0 },
  nWicket5i: { type: Number, default: 0 },
  nWicket10m: { type: Number, default: 0 },
  nMaidens: { type: Number, default: 0 },
  nRunsConceded: { type: Number, default: 0 },
  dModified: { type: Date },
  eProvider: {
    type: String,
    enum: eProvider.value
  },
  eFormat: { type: String },
  nPriority: { type: Number }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

SeriesStats.index({ iSeriesStatsId: 1, iSeriesId: 1 })
SeriesStats.index({ nPriority: 1 })

SeriesStats.virtual('oPlayer', {
  ref: 'players',
  localField: 'iPlayerId',
  foreignField: '_id',
  justOne: true
})

SeriesStats.virtual('oTeam', {
  ref: 'teams',
  localField: 'iTeamId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('seriesStats', SeriesStats)
