const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider, eDecision } = require('../enums')

const matches = new mongoose.Schema(
  {
    iSeriesId: { type: ObjectId, ref: 'series' },
    sSeriesKey: { type: String },
    sMatchKey: { type: String, unique: true },
    sTitle: { type: String },
    sShortTitle: { type: String },
    sSubtitle: { type: String },
    iFormatId: { type: ObjectId, ref: 'enums' },
    sFormatStr: { type: String },
    iStatusId: { type: ObjectId, ref: 'enums' },
    sStatusStr: { type: String },
    sStatusNote: { type: String },
    bVerified: { type: Boolean },
    bPreSquad: { type: Boolean },
    iLiveGameStatusId: { type: ObjectId, ref: 'enums' },
    sLiveGameStatusStr: { type: String },
    bIsDomestic: { type: Boolean },
    dStartDate: { type: Date },
    dEndDate: { type: Date },
    dMatchEndTime: { type: Date },
    dStartTimestamp: { type: Number },
    dEndTimestamp: { type: Number },
    iVenueId: { type: ObjectId, ref: 'venues' },
    sEquation: { type: String },
    sUmpires: { type: String },
    sReferee: { type: String },
    sWinMargin: { type: String },
    iWinnerId: { type: ObjectId, ref: 'teams' },
    bIsCommentary: { type: Boolean },
    nLatestInningNumber: Number,
    oToss: {
      type: {
        sText: { type: String },
        iWinnerTeamId: { type: ObjectId, ref: 'teams' },
        eDecision: { type: String, enum: eDecision.value }
      }
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
    sLiveMatchNote: { type: String },
    sResult: { type: String },
    // iResultTypeId: { type: ObjectId, ref: 'enums' },
    bIsWagon: { type: Boolean },
    sDescription: { type: String },
    bFantasyTips: { type: Boolean, default: false },
    eProvider: { type: String, enum: eProvider.value },
    sETag: { type: String },
    bEntityAccess: { type: Boolean },
    oLiveScore: {
      nRuns: { type: Number, default: 0 },
      sOvers: { type: String, trim: true },
      nWickets: { type: Number, default: 0 },
      nTarget: { type: Number, default: 0 },
      nRunrate: { type: Number, default: 0 },
      sRequiredRunrate: { type: String, trim: true }
    },
    iMomId: { type: ObjectId, ref: 'players' },
    iMosId: { type: ObjectId, ref: 'players' },
    bImp: { type: Boolean, default: false },
    iEventId: { type: ObjectId },
    aPollId: [String]
  },
  {
    timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })

matches.index({ dEndDate: 1 })
matches.index({ dStartDate: 1 })
matches.index({ sMatchKey: 1 }, { unique: true })
matches.index({ sSeriesKey: 1 })
matches.index({ iSeriesId: 1, iVenueId: 1 })
matches.index({ iVenueId: 1 })
matches.index({ 'oTeamScoreA.iTeamId': 1 })
matches.index({ 'oTeamScoreB.iTeamId': 1 })
matches.index({ 'oToss.iWinnerTeamId': 1 })
matches.index({ iMomId: 1 })
matches.index({ iMosId: 1 })
matches.index({ iWinnerId: 1 })
matches.index({ bEntityAccess: 1 })
matches.index({ sFormatStr: 1, dStartDate: 1, dEndDate: 1, dUpdated: 1 })
matches.index({ bImp: -1, dStartDate: 1 })

matches.virtual('oSeries', {
  ref: 'series',
  localField: 'iSeriesId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oVenue', {
  ref: 'venues',
  localField: 'iVenueId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oTeamScoreA.oTeam', {
  ref: 'teams',
  localField: 'oTeamScoreA.iTeamId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oTeamScoreB.oTeam', {
  ref: 'teams',
  localField: 'oTeamScoreB.iTeamId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oToss.oWinnerTeam', {
  ref: 'teams',
  localField: 'oToss.iWinnerTeamId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('aFantasyTips', {
  ref: 'fantasyarticles',
  localField: '_id',
  foreignField: 'iMatchId'
})

matches.virtual('oTeamA', {
  ref: 'teams',
  localField: 'oTeamScoreA.iTeamId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oTeamB', {
  ref: 'teams',
  localField: 'oTeamScoreB.iTeamId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oMom', {
  ref: 'players',
  localField: 'iMomId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oMos', {
  ref: 'players',
  localField: 'iMosId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oWinner', {
  ref: 'teams',
  localField: 'iWinnerId',
  foreignField: '_id',
  justOne: true
})

matches.virtual('oEvent', {
  ref: 'events',
  localField: 'iEventId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('matches', matches)
