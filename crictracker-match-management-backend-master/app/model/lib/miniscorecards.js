const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider, eDecision } = require('../enums')

const miniscorecards = new mongoose.Schema(
  {
    iMatchId: { type: ObjectId, ref: 'matches', required: true },
    oSeries: {
      _id: { type: ObjectId, ref: 'series', required: true },
      sTitle: String,
      sAbbr: String,
      sSeason: String,
      sSrtTitle: String,
      nTotalTeams: Number,
      iCategoryId: ObjectId
    },
    sMatchKey: String,
    nPriority: Number,
    sTitle: String,
    sSubtitle: String,
    sFormatStr: String,
    sStatusStr: String,
    sStatusNote: String,
    sLiveGameStatusStr: String,
    bIsDomestic: Boolean,
    dStartDate: Date,
    dEndDate: Date,
    dStartTimestamp: Number,
    dEndTimestamp: Number,
    iVenueId: { type: ObjectId, ref: 'venues' },
    oVenue: {
      sName: String,
      sLocation: String
    },
    sEquation: String,
    nLatestInningNumber: Number,
    oToss: {
      sText: { type: String },
      iWinnerTeamId: { type: ObjectId, ref: 'matches' },
      eDecision: { type: String, enum: eDecision.value }
    },
    oTeamScoreA: {
      type: {
        iTeamId: {
          type: ObjectId,
          ref: 'teams'
        },
        oTeam: {
          _id: { type: ObjectId, ref: 'teams', required: true },
          sTitle: String,
          sAbbr: String,
          sSeason: String,
          sThumbUrl: String,
          oImg: {
            sText: { type: String, trim: true },
            sCaption: { type: String, trim: true },
            sAttribute: { type: String, trim: true },
            sUrl: { type: String, trim: true }
          }
        },
        sTeamKey: String,
        sName: String,
        sSortName: String,
        sLogoUrl: String,
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
        oTeam: {
          _id: { type: ObjectId, ref: 'teams', required: true },
          sTitle: String,
          sAbbr: String,
          sSeason: String,
          sThumbUrl: String,
          oImg: {
            sText: { type: String, trim: true },
            sCaption: { type: String, trim: true },
            sAttribute: { type: String, trim: true },
            sUrl: { type: String, trim: true }
          }
        },
        sScoresFull: String,
        sScores: String,
        sOvers: String
      }
    },
    iBattingTeamId: { type: ObjectId, ref: 'teams' },
    iFieldingTeamId: { type: ObjectId, ref: 'teams' },
    sLiveMatchNote: String,
    iWinnerId: { type: ObjectId, ref: 'teams' },
    oWinner: {
      _id: { type: ObjectId, ref: 'teams' },
      sTitle: String,
      sAbbr: String,
      oImg: {
        sText: String,
        sCaption: String,
        sAttribute: String,
        sUrl: String
      }
    },
    sResult: String,
    sETag: String,
    eProvider: {
      type: String,
      enum: eProvider.value
    },
    aFantasyTipsSlug: [String]
  },
  {
    timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

miniscorecards.index({ nPriority: 1 })

module.exports = mongoose.model('miniscorecards', miniscorecards)
