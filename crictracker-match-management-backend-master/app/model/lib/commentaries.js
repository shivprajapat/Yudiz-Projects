const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eCommentaryEvent } = require('../enums')

const commentaries = new mongoose.Schema({
  iMatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'matches' }, // ref to matches
  nInningNumber: Number,
  sEventId: String,
  eEvent: { type: String, enum: eCommentaryEvent.value },
  iBatterId: { type: ObjectId, ref: 'players' },
  iBowlerId: { type: ObjectId, ref: 'players' },
  iWicketBatterId: { type: ObjectId, ref: 'players' },
  sOver: String,
  sBall: String,
  sScore: String,
  nRuns: Number,
  aOverScores: { type: [String], default: undefined },
  aBatters: {
    type: [{
      iBatterId: { type: ObjectId, ref: 'players' },
      nRuns: Number,
      nBallFaced: Number,
      nFours: Number,
      nSixes: Number
    }],
    default: undefined
  },
  aBowlers: {
    type: [{
      iBowlerId: { type: ObjectId, ref: 'players' },
      sOvers: String,
      nRunsConceded: Number,
      nWickets: Number,
      nMaidens: Number
    }],
    default: undefined
  },
  nTimestamp: Number,
  sHowOut: String,
  bIsNoBallDismissal: { type: Boolean },
  nBatterRuns: Number,
  nBatterBalls: Number,
  sText: { type: String, trim: true },
  sCommentary: { type: String, trim: true },
  sHash: { type: String },
  oTeamA: {
    sTeam: String,
    sPlayers: String
  },
  oTeamB: {
    sTeam: String,
    sPlayers: String
  },
  sNoBallRun: {
    type: String
  },
  sWideRun: {
    type: String
  },
  sByeRun: {
    type: String
  },
  sLegbyeRun: {
    type: String
  },
  sBatrun: {
    type: String
  },
  bIsNoball: {
    type: Boolean
  },
  bIsWideball: {
    type: Boolean
  },
  bIsSix: {
    type: Boolean
  },
  bIsFour: {
    type: Boolean
  }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

commentaries.index({ iMatchId: 1, nInningNumber: -1, sEventId: -1 })

commentaries.index({ sEventId: 1, eEvent: 1, iMatchId: 1 })

commentaries.virtual('oMatch', {
  ref: 'matches',
  localField: 'iMatchId',
  foreignField: '_id',
  justOne: true
})
commentaries.virtual('oBatter', {
  ref: 'players',
  localField: 'iBatterId',
  foreignField: '_id',
  justOne: true
})
commentaries.virtual('oBowler', {
  ref: 'players',
  localField: 'iBowlerId',
  foreignField: '_id',
  justOne: true
})
commentaries.virtual('oWicketBatter', {
  ref: 'players',
  localField: 'iWicketBatterId',
  foreignField: '_id',
  justOne: true
})
commentaries.virtual('aBatters.oBatter', {
  ref: 'players',
  localField: 'aBatters.iBatterId',
  foreignField: '_id',
  justOne: true
})
commentaries.virtual('aBowlers.oBowler', {
  ref: 'players',
  localField: 'aBowlers.iBowlerId',
  foreignField: '_id',
  justOne: true
})

const model = mongoose.model('commentaries', commentaries)
module.exports = model
