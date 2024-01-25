const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const PlayerStats = new mongoose.Schema({
  iPlayerId: { type: ObjectId, ref: 'players', required: true },
  sMatchStatsTypes: { type: String, required: true, trim: true },
  sPlayerKey: { type: String, trim: true },
  oBatting: {
    nMatches: { type: Number, default: 0, required: true },
    nInnings: { type: Number, default: 0, required: true },
    nNotOut: { type: Number, default: 0 },
    nRuns: { type: Number, default: 0 },
    nPlayedBalls: { type: Number, default: 0 },
    nHighest: { type: Number, default: 0 },
    nRun100: { type: Number, default: 0 },
    nRun50: { type: Number, default: 0 },
    nRun4: { type: Number, default: 0 },
    nRun6: { type: Number, default: 0 },
    sAverage: { type: String },
    sStrikeRate: { type: String },
    nFastest50Balls: { type: Number, default: 0 },
    nFastest100Balls: { type: Number, default: 0 }
  },
  oBowling: {
    nMatches: { type: Number, default: 0, required: true },
    nInnings: { type: Number, default: 0, required: true },
    nBalls: { type: Number, default: 0 },
    sOvers: { type: String },
    nRuns: { type: Number, default: 0 },
    nWickets: { type: Number, default: 0 },
    sBestBowlingInning: { type: String },
    sBestBowlingMatch: { type: String },
    sEconomy: { type: String },
    sAverage: { type: String },
    sStrikeRate: { type: String },
    nWkt4i: { type: Number, default: 0 },
    nWkt5i: { type: Number, default: 0 },
    nWkt10m: { type: Number },
    nHatTrick: { type: Number },
    nMostExpensiveOver: { type: Number }
  }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

PlayerStats.index({ iPlayerId: 1 })

PlayerStats.virtual('oPlayer', {
  ref: 'players',
  localField: 'iPlayerId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('playerStats', PlayerStats)
