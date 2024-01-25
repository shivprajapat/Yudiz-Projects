const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { schema } = require('./articles')
const { ArticleDBConnect } = require('../../../db_services/mongoose')

const articleSchema = Object.assign({}, schema)

const fieldsToDelete = ['iAuthorId',
  'iAuthorDId',
  'iReviewerId',
  'eVisibility',
  'bPriority',
  'sContent',
  'sInsContent',
  'sAmpContent',
  'eStatus',
  'eState',
  'aSeries',
  'aPlayer',
  'aTeam',
  'aVenue',
  'aTags',
  'sEditorNotes',
  'nClaps',
  'nViewCount',
  'bOld',
  'id',
  'bIsListicleArticle',
  'oListicleArticle'
]

fieldsToDelete.forEach((ele) => {
  delete articleSchema[ele]
})

const homepages = new mongoose.Schema({
  _id: false,
  iCategoryId: {
    type: ObjectId,
    ref: 'categories'
  },
  sName: {
    type: String,
    required: true
  },
  sSlug: {
    type: String
  },
  bScoreCard: {
    type: Boolean,
    default: false
  },
  nPriority: {
    type: Number
  },
  eType: {
    type: String
  },
  iSeriesId: {
    type: ObjectId
  },
  aArticle: [{
    oSeo: {
      sSlug: String
    },
    sType: String,
    _id: { type: Object },
    sTitle: { type: String },
    sSrtTitle: { type: String },
    sDescription: { type: String },
    oImg: {
      sUrl: { type: String },
      sText: { type: String },
      sCaption: { type: String },
      sAttribute: { type: String }
    },
    nDuration: { type: Number },
    dPublishDate: { type: Date },
    dPublishDisplayDate: { type: Date },
    oCategory: {
      sName: { type: String },
      _id: { type: ObjectId },
      oSeo: {
        sSlug: { type: String }
      }
    },
    oTImg: {
      sUrl: { type: String },
      sText: { type: String },
      sCaption: { type: String },
      sAttribute: { type: String }
    },
    iEventId: {
      type: ObjectId
    }
  }],
  oScore: {
    iMatchId: { type: ObjectId, ref: 'matches' },
    oSeries: {
      _id: { type: ObjectId, ref: 'series' },
      sTitle: String,
      sAbbr: String,
      sSeason: String,
      nTotalTeams: Number,
      iCategoryId: { type: ObjectId }
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
      eDecision: { type: String }
    },
    oTeamScoreA: {
      type: {
        iTeamId: {
          type: ObjectId,
          ref: 'teams'
        },
        oTeam: {
          _id: { type: ObjectId, ref: 'teams' },
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
          _id: { type: ObjectId, ref: 'teams' },
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
    sLiveMatchNote: String,
    iWinnerId: { type: ObjectId, ref: 'teams' },
    sResult: String,
    sETag: String,
    eProvider: {
      type: String
    }
  }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

module.exports = ArticleDBConnect.model('homepages', homepages)
