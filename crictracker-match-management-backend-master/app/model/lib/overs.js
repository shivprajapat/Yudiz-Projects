const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eCommentaryEvent } = require('../enums')
const balls = {
  sEventId: String,
  eEvent: { type: String, enum: eCommentaryEvent.value },
  sOver: String,
  iBatterId: { type: ObjectId, ref: 'players' },
  iBowlerId: { type: ObjectId, ref: 'players' },
  iWicketBatterId: { type: ObjectId, ref: 'players' },
  sBall: String,
  sScore: String,
  nRuns: Number,
  nTimestamp: Number,
  sHowOut: String,
  bIsNoBallDismissal: { type: Boolean },
  nBatterRuns: Number,
  nBatterBalls: Number
}

const overEnd = {
  sEventId: String,
  eEvent: { type: String, enum: eCommentaryEvent.value },
  sOver: String,
  sScore: String,
  nRuns: Number,
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
  }
}

const over = new mongoose.Schema({
  iMatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'matches' }, // ref to matches
  nInningNumber: Number,
  sOver: String,
  aBall: [balls],
  oOver: { type: overEnd }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

over.index({ iMatchId: 1, nInningNumber: 1, sOver: -1 })

const model = mongoose.model('overs', over)
module.exports = model

over.virtual('aBall.oBatter', {
  ref: 'players',
  localField: 'aBall.iBatterId',
  foreignField: '_id',
  justOne: true
})

over.virtual('aBall.oBowler', {
  ref: 'players',
  localField: 'aBall.iBowlerId',
  foreignField: '_id',
  justOne: true
})

over.virtual('aBall.oWicketBatter', {
  ref: 'players',
  localField: 'aBall.iWicketBatterId',
  foreignField: '_id',
  justOne: true
})

over.virtual('oOver.aBatters.oBatter', {
  ref: 'players',
  localField: 'oOver.aBatters.iBatterId',
  foreignField: '_id',
  justOne: true
})

over.virtual('oOver.aBowlers.oBowler', {
  ref: 'players',
  localField: 'oOver.aBowlers.iBowlerId',
  foreignField: '_id',
  justOne: true
})
