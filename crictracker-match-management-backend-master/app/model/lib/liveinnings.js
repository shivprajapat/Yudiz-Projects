const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider, eBattingPosition, eDismissal, eBowlingPosition } = require('../enums')

// From match live API & Scorecards mix
const liveinnings = new mongoose.Schema({
  iMatchId: { type: ObjectId, required: true, ref: 'matches' },
  sInningId: { type: String },
  nInningNumber: Number,
  sName: String,
  sShortName: String,
  iResultId: { type: ObjectId, ref: 'enums' },
  sResultStr: { type: String },
  iStatusId: { type: ObjectId, ref: 'enums' },
  sStatusStr: { type: String },
  iBattingTeamId: { type: ObjectId },
  iFieldingTeamId: { type: ObjectId, ref: 'teams' },
  aActiveBatters: [{ // From Live match API
    iBatterId: { type: ObjectId, ref: 'players' },
    nRuns: Number,
    nBallFaced: Number,
    nFours: Number,
    nSixes: Number,
    sStrikeRate: String
  }],
  aActiveBowlers: [{ // From Live match API
    iBowlerId: { type: ObjectId, ref: 'players' },
    sOvers: String,
    nRunsConceded: Number,
    nWickets: Number,
    nMaidens: Number,
    sEcon: String
  }],
  aBatters: [{
    iBatterId: { type: ObjectId, ref: 'players' },
    bIsBatting: { type: Boolean, default: false },
    ePosition: { type: String, enum: eBattingPosition.value },
    nRuns: Number,
    nBallFaced: Number,
    nFours: Number,
    nSixes: Number,
    nDots: Number,
    nSingles: Number,
    nDoubles: Number,
    nThree: Number,
    nFives: Number,
    sHowOut: String,
    eDismissal: { type: String, enum: eDismissal.value },
    sStrikeRate: String,
    iBowlerId: { type: ObjectId, ref: 'players' },
    iFirstFielderId: { type: ObjectId, ref: 'players' },
    iSecondFielderId: { type: ObjectId, ref: 'players' },
    iThirdFielderId: { type: ObjectId, ref: 'players' }
  }],
  aBowlers: [{
    iBowlerId: { type: ObjectId, ref: 'players' },
    bIsBowling: { type: Boolean, default: false },
    ePosition: { type: String, enum: eBowlingPosition.value },
    sOvers: String,
    nMaidens: { type: Number, default: 0 },
    nRunsConceded: { type: Number, default: 0 },
    nWickets: { type: Number, default: 0 },
    nNoBalls: { type: Number, default: 0 },
    nWides: { type: Number, default: 0 },
    nDotBalls: { type: Number, default: 0 },
    sEcon: String,
    nBowled: { type: Number, default: 0 },
    nLbw: { type: Number, default: 0 }
  }],
  aFielders: [{
    iFielderId: { type: ObjectId, ref: 'players' },
    nCatches: { type: Number, default: 0 },
    nRunoutThrow: { type: Number, default: 0 },
    nRunoutCatcher: { type: Number, default: 0 },
    nRunoutDirect: { type: Number, default: 0 },
    bIsSubstitute: { type: Boolean, default: false },
    nStumping: { type: Number, default: 0 }
  }],
  oLastWicket: {
    iBatterId: { type: ObjectId, ref: 'players' },
    nRuns: Number,
    nBallFaced: Number,
    sHowOut: String,
    nScoreDismissal: Number,
    sOverDismissal: String,
    iBowlerId: { type: ObjectId, ref: 'players' },
    eDismissal: { type: String, enum: eDismissal.value },
    nWicketNumber: Number
  },
  aFOWs: [{
    iBatterId: { type: ObjectId, ref: 'players' },
    nRuns: Number,
    nBallFaced: Number,
    nHowOut: Number,
    nScoreDismissal: Number,
    sOverDismissal: String,
    iBowlerId: { type: ObjectId, ref: 'players' },
    eDismissal: { type: String, enum: eDismissal.value },
    nWicketNumber: Number
  }],
  oExtraRuns: {
    nByes: Number,
    nLegByes: Number,
    nWides: Number,
    nNoBalls: Number,
    nPenalty: Number,
    nTotal: Number
  },
  oEquations: {
    nRuns: Number,
    nWickets: Number,
    sOvers: String,
    nBowlersUsed: Number,
    sRunRate: String
  },
  oCurrentPartnership: {
    nRuns: Number,
    nBalls: Number,
    sOvers: String,
    aBatters: [{
      iBatterId: { type: ObjectId, ref: 'players' },
      nRuns: Number,
      nBalls: Number
    }]
  },
  aPowerPlay: [{
    sPowerPlay: { type: String },
    sStartOver: { type: String },
    sEndOver: { type: String }
  }],
  oBattingReview: {
    nTotal: { type: Number },
    nSuccess: { type: Number },
    nFailed: { type: Number },
    nAvailable: { type: Number }
  },
  oBowlingReview: {
    nTotal: { type: Number },
    nSuccess: { type: Number },
    nFailed: { type: Number },
    nAvailable: { type: Number }
  },
  aDidNotBat: [{ type: ObjectId }],
  aInningNote: [{ type: String }],
  sRecentScores: String, // Match Live API
  sLastFiveOvers: String, // Match Live API
  sLastTenOvers: String, // Match Live API
  sETag: String,
  eProvider: { type: String, enum: eProvider.value },
  oLiveScore: {
    nRuns: { type: Number, default: 0 },
    sOvers: { type: String, trim: true },
    nWickets: { type: Number, default: 0 },
    nTarget: { type: Number, default: 0 },
    nRunrate: { type: Number, default: 0 },
    sRequiredRunrate: { type: String, trim: true }
  }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

liveinnings.index({ iMatchId: 1, nInningNumber: 1 })

liveinnings.virtual('oMatch', {
  ref: 'matches',
  localField: 'iMatchId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('oBattingTeam', {
  ref: 'teams',
  localField: 'iBattingTeamId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('oFieldingTeam', {
  ref: 'teams',
  localField: 'iFieldingTeamId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aBatters.oBatter', {
  ref: 'players',
  localField: 'aBatters.iBatterId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aBatters.oBowler', {
  ref: 'players',
  localField: 'aBatters.iBowlerId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aBatters.oFirstFielder', {
  ref: 'players',
  localField: 'aBatters.iFirstFielderId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aBatters.oSecondFielder', {
  ref: 'players',
  localField: 'aBatters.iSecondFielderId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aBatters.oThirdFielder', {
  ref: 'players',
  localField: 'aBatters.iThirdFielderId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aBowlers.oBowler', {
  ref: 'players',
  localField: 'aBowlers.iBowlerId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aFielders.oFielder', {
  ref: 'players',
  localField: 'aFielders.iFielderId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('oLastWicket.oBatter', {
  ref: 'players',
  localField: 'oLastWicket.iBatterId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('oLastWicket.oBowler', {
  ref: 'players',
  localField: 'oLastWicket.iBowlerId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aFOWs.oBatter', {
  ref: 'players',
  localField: 'aFOWs.iBatterId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aFOWs.oBowler', {
  ref: 'players',
  localField: 'aFOWs.iBowlerId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('oCurrentPartnership.aBatters.oBatter', {
  ref: 'players',
  localField: 'oCurrentPartnership.aBatters.iBatterId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aActiveBatters.oBatter', {
  ref: 'players',
  localField: 'aActiveBatters.iBatterId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aActiveBowlers.oBowler', {
  ref: 'players',
  localField: 'aActiveBowlers.iBowlerId',
  foreignField: '_id',
  justOne: true
})
liveinnings.virtual('aYetToBat', {
  ref: 'players',
  localField: 'aDidNotBat',
  foreignField: '_id'
})

module.exports = mongoose.model('liveinnings', liveinnings, 'liveinnings')
