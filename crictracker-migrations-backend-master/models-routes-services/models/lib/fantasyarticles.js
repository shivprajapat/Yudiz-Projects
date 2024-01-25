const mongoose = require('mongoose')
const { MatchManagementDBConnect } = require('../../../db_services/mongoose')

const { ObjectId } = mongoose.Schema.Types
const { eState, eArticleType, ePlatformType, eStatus, eArticleVisibilityType, eCVC, eFantasyLeagueType } = require('../../enums')

const oFantasyTeam = {
  aSelectedPlayer: [{ type: ObjectId, ref: 'players' }],
  iCapId: { type: ObjectId },
  iVCId: { type: ObjectId },
  iTPId: { type: ObjectId },
  oTeamA: {
    sTitle: { type: String, trim: true },
    nCount: { type: Number, default: 0 }
  },
  oTeamB: {
    sTitle: { type: String, trim: true },
    nCount: { type: Number, default: 0 }
  }
}

const oFantasyLeague = {
  eLeague: { type: String, enum: eFantasyLeagueType.value, trim: true },
  aTeam: [oFantasyTeam]
}

const oPickedPlayer = {
  iPlayerId: { type: ObjectId, ref: 'players' },
  sDescription: { type: String, trim: true },
  sTeamAbbr: { type: String, trim: true }
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
  sAmpPreview: { type: String, trim: true },
  aCVC: [{
    type: {
      iPlayerId: { type: ObjectId, ref: 'players' },
      sDescription: { type: String, trim: true },
      eType: { type: String, enum: eCVC.value },
      sTeamAbbr: { type: String, trim: true }
    }
  }],
  aTopicPicks: [oPickedPlayer],
  aBudgetPicks: [oPickedPlayer],
  aAvoidPlayer: [oPickedPlayer], // Player to Avoid
  oOtherInfo: {
    sExpertAdvice: { type: String, trim: true }
  },
  eStatus: { type: String, enum: eStatus.value, default: eStatus.default, trim: true },
  eVisibility: { type: String, enum: eArticleVisibilityType.value, default: eArticleVisibilityType.default, trim: true },
  nRevision: Number,
  bPriority: { type: Boolean, default: false }, // default false
  oImg: {
    type: {
      sText: { type: String, trim: true },
      sCaption: { type: String, trim: true },
      sAttribute: { type: String, trim: true },
      sUrl: { type: String, trim: true }
    }
  },
  oTImg: {
    type: {
      sText: { type: String, trim: true },
      sCaption: { type: String, trim: true },
      sAttribute: { type: String, trim: true },
      sUrl: { type: String, trim: true }
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
      bEditorsPick: { type: Boolean, default: false }
    }
  },
  eType: { type: String, enum: eArticleType.value, default: eArticleType.default, trim: true }, // article Type
  eState: { type: String, enum: eState.value, default: eState.default, trim: true }, // Article lifecycle state
  nViews: { type: Number, default: 0 }, // Article view count
  nOViews: { type: Number, default: 0 }, // original views
  dPublishDate: { type: Date }, // article publish date
  sDescription: { type: String }, // for short content ...
  iCategoryId: { type: ObjectId },
  aSeries: [{ type: ObjectId }],
  aPlaylist: [{ type: ObjectId }],
  aPlayer: [{ type: ObjectId }],
  aTeam: [{ type: ObjectId }],
  aVenue: [{ type: ObjectId }],
  sVideoUrl: { type: String, trim: true },
  sMustPick: { type: String, trim: true },
  aLeague: [{ type: oFantasyLeague }],
  nViewCount: { type: Number, default: 0 },
  nDuration: { type: Number, default: 0 },
  nClaps: { type: Number, default: 0 }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}).index({ iMatchId: 1, ePlatformType: 1 })

module.exports = MatchManagementDBConnect.model('fantasyarticles', fantasyarticles)

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

fantasyarticles.virtual('aTopicPicksPlayer', {
  ref: 'players',
  localField: 'aTopicPicks.iPlayerId',
  foreignField: '_id'
})

fantasyarticles.virtual('aBudgetPicksPlayer', {
  ref: 'players',
  localField: 'aBudgetPicks.iPlayerId',
  foreignField: '_id'
})

fantasyarticles.virtual('aBudgetPicks.oPlayer', {
  ref: 'players',
  localField: 'aBudgetPicks.iPlayerId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aTopicPicks.oPlayer', {
  ref: 'players',
  localField: 'aTopicPicks.iPlayerId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aAvoidPlayer.oPlayer', {
  ref: 'players',
  localField: 'aAvoidPlayer.iPlayerId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aCVC.oPlayer', {
  ref: 'players',
  localField: 'aCVC.iPlayerId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aAvoidPlayerPlayer', {
  ref: 'players',
  localField: 'aAvoidPlayer.iPlayerId',
  foreignField: '_id'
})

fantasyarticles.virtual('aCVCPlayer', {
  ref: 'players',
  localField: 'aCVC.iPlayerId',
  foreignField: '_id'
})

// fantasyarticles.virtual('aLeague.aTeam.aSelectedPlayer.oPlayer', {
//   ref: 'players',
//   localField: 'aLeague.aTeam.aSelectedPlayer._id',
//   foreignField: '_id',
//   justOne: true
// })

// fantasyarticles.virtual('aLeague.aTeam.aSelectedPlayer.oPlayer', {
//   ref: 'players',
//   localField: 'aLeague.aTeam.aSelectedPlayer',
//   foreignField: '_id',
//   justOne: true
// })

fantasyarticles.virtual('aLeague.aTeam.oCap', {
  ref: 'players',
  localField: 'aLeague.aTeam.iCapId',
  foreignField: '_id',
  justOne: true
})
fantasyarticles.virtual('aLeague.aTeam.oVC', {
  ref: 'players',
  localField: 'aLeague.aTeam.iVCId',
  foreignField: '_id',
  justOne: true
})

fantasyarticles.virtual('aLeague.aTeam.oTP', {
  ref: 'players',
  localField: 'aLeague.aTeam.iTPId',
  foreignField: '_id',
  justOne: true
})
