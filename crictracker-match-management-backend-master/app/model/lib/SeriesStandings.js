const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider } = require('../enums')

const SeriesStandings = new mongoose.Schema({
  iSeriesId: { type: ObjectId, ref: 'series' },
  iRoundId: { type: ObjectId, ref: 'series_rounds' },
  iTeamId: { type: ObjectId, ref: 'teams' },
  nPlayed: { type: Number }, // matches played
  nWin: { type: Number },
  nDraw: { type: Number }, // match tied
  nLoss: { type: Number },
  nNR: { type: Number },
  nOverFor: { type: String },
  nRunFor: { type: Number },
  nOverAgainst: { type: String },
  nRunAgainst: { type: Number },
  nNetrr: { type: String },
  nPoints: { type: Number },
  bIsQualified: { type: Boolean },
  nPriority: { type: Number },
  eProvider: { type: String, enum: eProvider.value }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

SeriesStandings.virtual('oRound', {
  ref: 'series_rounds',
  localField: 'iRoundId',
  foreignField: '_id',
  justOne: true
})

SeriesStandings.virtual('oTeam', {
  ref: 'teams',
  localField: 'iTeamId',
  foreignField: '_id',
  justOne: true
})

SeriesStandings.virtual('oSeries', {
  ref: 'series',
  localField: 'iSeriesId',
  foreignField: '_id',
  justOne: true
})

SeriesStandings.index({ iSeriesId: 1, iRoundId: 1, nPriority: 1 })
SeriesStandings.index({ iSeriesId: 1, iRoundId: 1, iTeamId: 1 })

module.exports = mongoose.model('series_standings', SeriesStandings)
