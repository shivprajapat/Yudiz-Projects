const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const matchoverviews = new mongoose.Schema({
  iMatchId: { type: ObjectId, ref: 'matches' },
  sMatchPreview: { type: String, trim: true },
  sNews: { type: String, trim: true }, // INJURY AND AVAILABILITY NEWS
  sPitchCondition: { type: String, trim: true },
  sAvgScore: { type: String, trim: true },
  sPitchReport: { type: String, trim: true },
  sWeatherReport: { type: String, trim: true },
  iWinnerTeamId: { type: ObjectId, ref: 'teams' },
  sWeatherCondition: { type: String, trim: true },
  sOutFieldCondition: { type: String, trim: true },
  oTeam1: {
    iTeamId: { type: ObjectId, ref: 'teams' },
    aPlayers: [{ type: ObjectId, ref: 'players' }],
    aBenchedPlayers: [{ type: ObjectId, ref: 'players' }],
    iC: { type: ObjectId, ref: 'players' },
    iVC: { type: ObjectId, ref: 'players' },
    iWK: { type: ObjectId, ref: 'players' }
  },
  oTeam2: {
    iTeamId: { type: ObjectId, ref: 'teams' },
    aPlayers: [{ type: ObjectId, ref: 'players' }],
    aBenchedPlayers: [{ type: ObjectId, ref: 'players' }],
    iC: { type: ObjectId, ref: 'players' },
    iVC: { type: ObjectId, ref: 'players' },
    iWK: { type: ObjectId, ref: 'players' }
  },
  sBroadCastingPlatform: { type: String, trim: true },
  nPaceBowling: { type: Number },
  nSpinBowling: { type: Number },
  nBattingPitch: { type: Number },
  nBowlingPitch: { type: Number },
  sLiveStreaming: { type: String, trim: true }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}).index({ iMatchId: 1 })

module.exports = mongoose.model('matchoverviews', matchoverviews)

matchoverviews.virtual('oMatch', {
  ref: 'matches',
  localField: 'iMatchId',
  foreignField: '_id',
  justOne: true
})

matchoverviews.virtual('oTeam1.oTeam', {
  ref: 'teams',
  localField: 'oTeam1.iTeamId',
  foreignField: '_id',
  justOne: true
})

matchoverviews.virtual('oTeam2.oTeam', {
  ref: 'teams',
  localField: 'oTeam2.iTeamId',
  foreignField: '_id',
  justOne: true
})

matchoverviews.virtual('oWinnerTeam', {
  ref: 'teams',
  localField: 'iWinnerTeamId',
  foreignField: '_id',
  justOne: true
})
