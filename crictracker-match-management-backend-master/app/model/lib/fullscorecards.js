const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider, eDecision } = require('../enums')

const fullscorecards = new mongoose.Schema(
  {
    iMatchId: { type: ObjectId, ref: 'matches', required: true },
    iSeriesId: { type: ObjectId, ref: 'series' }, // Competition.cid
    iVenueId: { type: ObjectId, ref: 'venues' },
    sEquation: String,
    nLatestInningNumber: Number,
    oToss: {
      sText: { type: String },
      iWinnerTeamId: { type: ObjectId, ref: 'teams' },
      eDecision: { type: String, enum: eDecision.value }
    },
    oTeamScoreA: {
      type: {
        iTeamId: {
          type: ObjectId,
          ref: 'teams'
        },
        sScoresFull: String,
        sScores: String,
        sOvers: String
      }
    },
    oTeamScoreB: {
      type: {
        iTeamId: {
          type: ObjectId,
          ref: 'teams'
        },
        sScoresFull: String,
        sScores: String,
        sOvers: String
      }
    },
    sLiveMatchNote: String,
    sResult: String,
    iMomId: { type: ObjectId, ref: 'players' },
    iMosId: { type: ObjectId, ref: 'players' },
    bIsFollowOn: { type: Boolean, default: false },
    sWinMargin: String,
    sCurrentOver: String,
    sPreviousOver: String,
    sLastFiveOvers: String,
    sETag: String,
    eProvider: {
      type: String,
      enum: eProvider.value
    },
    sDayRemainingOver: { type: String }
  },
  {
    timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

fullscorecards.index({ iMatchId: 1 })

fullscorecards.virtual('oMatch', {
  ref: 'matches',
  localField: 'iMatchId',
  foreignField: '_id',
  justOne: true
})
fullscorecards.virtual('oSeries', {
  ref: 'series',
  localField: 'iSeriesId',
  foreignField: '_id',
  justOne: true
})
fullscorecards.virtual('oVenue', {
  ref: 'venues',
  localField: 'iVenueId',
  foreignField: '_id',
  justOne: true
})
fullscorecards.virtual('oToss.oWinnerTeam', {
  ref: 'teams',
  localField: 'oToss.iWinnerTeamId',
  foreignField: '_id',
  justOne: true
})
fullscorecards.virtual('oTeamScoreA.oTeam', {
  ref: 'teams',
  localField: 'oTeamScoreA.iTeamId',
  foreignField: '_id',
  justOne: true
})
fullscorecards.virtual('oTeamScoreB.oTeam', {
  ref: 'teams',
  localField: 'oTeamScoreB.iTeamId',
  foreignField: '_id',
  justOne: true
})
fullscorecards.virtual('oMom', {
  ref: 'players',
  localField: 'iMomId',
  foreignField: '_id',
  justOne: true
})
fullscorecards.virtual('oMos', {
  ref: 'players',
  localField: 'iMosId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('fullscorecards', fullscorecards)
