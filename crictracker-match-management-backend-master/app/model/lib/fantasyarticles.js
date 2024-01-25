const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eState, eArticleType, ePlatformType, eArticleVisibilityType, eCVC, eFantasyLeagueType } = require('../enums')

const oFantasyTeam = {
  aSelectedPlayerFan: [{ type: ObjectId, ref: 'fantasyPlayers' }], // fantasy player
  iCapFanId: { type: ObjectId, ref: 'fantasyPlayers' }, // use this
  iVCFanId: { type: ObjectId, ref: 'fantasyPlayers' },
  iTPFanId: { type: ObjectId, ref: 'fantasyPlayers' },
  oTeamA: {
    nCount: { type: Number, default: 0 },
    iTeamId: { type: ObjectId, ref: 'teams' } // new
  },
  oTeamB: {
    nCount: { type: Number, default: 0 },
    iTeamId: { type: ObjectId, ref: 'teams' } // new
  }
}

const oFantasyLeague = {
  eLeague: { type: String, enum: eFantasyLeagueType.value, trim: true },
  eLeagueFull: { type: String, enum: Object.values(eFantasyLeagueType?.description) },
  aTeam: [oFantasyTeam]
}

const oPickedPlayerFan = {
  iPlayerFanId: { type: ObjectId, ref: 'fantasyPlayers' },
  sDescription: { type: String, trim: true }
}

const fantasyarticles = new mongoose.Schema({
  iMatchId: { type: ObjectId, ref: 'matches' }, // ref to natch
  ePlatformType: { type: String, enum: ePlatformType.value, trim: true }, // dream 11 , 11 wickets
  iAuthorId: { type: ObjectId },
  iAuthorDId: { type: ObjectId }, // author display id
  iReviewerId: { type: ObjectId },
  sTitle: { type: String, trim: true }, // max-length 200
  sSubtitle: { type: String, trim: true },
  sSrtTitle: { type: String, trim: true },
  sMatchPreview: { type: String, trim: true },
  // Amp
  sAmpPreview: { type: String, trim: true },
  aCVCFan: [{
    iPlayerFanId: { type: ObjectId, ref: 'fantasyPlayers' },
    sDescription: { type: String, trim: true },
    eType: { type: String, enum: eCVC.value }
  }],
  aTopicPicksFan: [oPickedPlayerFan],
  aBudgetPicksFan: [oPickedPlayerFan],
  aAvoidPlayerFan: [oPickedPlayerFan], // Player to Avoid
  oOtherInfo: {
    sExpertAdvice: { type: String, trim: true }
  },
  eVisibility: { type: String, enum: eArticleVisibilityType.value, default: eArticleVisibilityType.default, trim: true },
  nRevision: Number,
  bPriority: { type: Boolean, default: false }, // default false
  oImg: {
    type: {
      sText: { type: String, trim: true },
      sCaption: { type: String, trim: true },
      sAttribute: { type: String, trim: true },
      sUrl: { type: String, trim: true },
      oMeta: {
        nWidth: { type: Number },
        nHeight: { type: Number },
        nSize: { type: Number }
      }
    }
  },
  oTImg: {
    type: {
      sText: { type: String, trim: true },
      sCaption: { type: String, trim: true },
      sAttribute: { type: String, trim: true },
      sUrl: { type: String, trim: true },
      oMeta: {
        nWidth: { type: Number },
        nHeight: { type: Number },
        nSize: { type: Number }
      }
    }
  },
  aTags: [{ type: ObjectId }],
  sEditorNotes: { type: String, trim: true },
  oAdvanceFeature: {
    type: {
      bAllowComments: { type: Boolean, default: false },
      bRequireAdminApproval: { type: Boolean, default: false },
      bAmp: { type: Boolean, default: false },
      bFBEnable: { type: Boolean, default: false },
      bBrandedContent: { type: Boolean, default: false },
      bExclusiveArticle: { type: Boolean, default: false },
      bEditorsPick: { type: Boolean, default: false },
      bPlayerStats: { type: Boolean, default: true }, // player performance in this current series
      bTeamForm: { type: Boolean, default: true },
      bPitchReport: { type: Boolean, default: true }
    }
  },
  eType: { type: String, enum: eArticleType.value, default: eArticleType.default, trim: true }, // article Type
  eState: { type: String, enum: eState.value, default: eState.default, trim: true }, // Article lifecycle state
  nViews: { type: Number, default: 0 }, // Article view count
  nOViews: { type: Number, default: 0 }, // original views
  dPublishDate: { type: Date }, // article publish date
  dPublishDisplayDate: { type: Date }, // article publish date
  sDescription: { type: String }, // for short content ...
  iCategoryId: { type: ObjectId, ref: 'categories' },
  aSeries: [{ type: ObjectId, ref: 'categories' }],
  aPlayer: [{ type: ObjectId, ref: 'tags' }],
  aTeam: [{ type: ObjectId, ref: 'tags' }],
  aVenue: [{ type: ObjectId, ref: 'tags' }],
  sVideoUrl: { type: String, trim: true },
  sMustPick: { type: String, trim: true },
  // Amp
  sAmpMustPick: { type: String, trim: true },
  aLeague: [oFantasyLeague],
  nViewCount: { type: Number, default: 0 },
  nDuration: { type: Number, default: 0 },
  nClaps: { type: Number, default: 0 },
  dModifiedDate: { type: Date, default: new Date() },
  aPollId: [String]
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}).index({ iMatchId: 1, ePlatformType: 1 }).index({ iMatchId: 1, ePlatformType: 1 })

fantasyarticles.index({ iCategoryId: 1 })
fantasyarticles.index({ iMatchId: 1 })
fantasyarticles.index({ dPublishDate: 1 })
fantasyarticles.index({ dPublishDate: -1 })
fantasyarticles.index({ iCategoryId: 1, eState: 1 })
fantasyarticles.index({ eState: 1 })

module.exports = mongoose.model('fantasyarticles', fantasyarticles)

fantasyarticles.virtual('oCategory', {
  ref: 'categories',
  localField: 'iCategoryId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('oMatch', {
  ref: 'matches',
  localField: 'iMatchId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('oOverview', {
  ref: 'matchoverviews',
  localField: 'iMatchId',
  foreignField: 'iMatchId',
  justOne: true
})

fantasyarticles.virtual('aBudgetPicksFan.oPlayerFan', { //! use this
  ref: 'fantasyPlayers',
  localField: 'aBudgetPicksFan.iPlayerFanId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aTopicPicksFan.oPlayerFan', { //! use this
  ref: 'fantasyPlayers',
  localField: 'aTopicPicksFan.iPlayerFanId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aAvoidPlayerFan.oPlayerFan', { //! use this
  ref: 'fantasyPlayers',
  localField: 'aAvoidPlayerFan.iPlayerFanId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aCVCFan.oPlayerFan', { //! use this
  ref: 'fantasyPlayers',
  localField: 'aCVCFan.iPlayerFanId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aLeague.aTeam.oCapFan', { //! use this
  ref: 'fantasyPlayers',
  localField: 'aLeague.aTeam.iCapFanId',
  foreignField: '_id',
  justOne: true
})
fantasyarticles.virtual('aLeague.aTeam.oVCFan', { // ! use this
  ref: 'fantasyPlayers',
  localField: 'aLeague.aTeam.iVCFanId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aLeague.aTeam.oTPFan', { //! use this
  ref: 'fantasyPlayers',
  localField: 'aLeague.aTeam.iTPFanId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aLeague.aTeam.oTeamA.oTeam', { //! use this
  ref: 'teams',
  localField: 'aLeague.aTeam.oTeamA.iTeamId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aLeague.aTeam.oTeamB.oTeam', { //! use this
  ref: 'teams',
  localField: 'aLeague.aTeam.oTeamB.iTeamId',
  foreignField: '_id',
  justOne: true
})
