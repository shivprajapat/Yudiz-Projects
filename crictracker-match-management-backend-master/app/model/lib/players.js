const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider, ePlatformType, eListTagStatus } = require('../enums')

const imageType = {
  sText: { type: String, trim: true },
  sCaption: { type: String, trim: true },
  sAttribute: { type: String, trim: true },
  sUrl: { type: String, trim: true }
}

const players = new mongoose.Schema({
  sPlayerKey: { type: String, trim: true },
  sShortName: { type: String, trim: true },
  sFirstName: { type: String, trim: true },
  sLastName: { type: String, trim: true },
  sMiddleName: { type: String, trim: true },
  sFullName: { type: String, trim: true }, // from admin panel || sTitle from ES
  dBirthDate: { type: Date },
  sBirthPlace: { type: String, trim: true },
  sCountry: { type: String, trim: true },
  sLogoUrl: { type: String, trim: true },
  sThumbUrl: { type: String, trim: true }, // deprecated
  sPlayingRole: { type: String, trim: true }, // bat, bowl
  sBattingStyle: { type: String, trim: true }, // right-hand arm
  sBowlingStyle: { type: String, trim: true }, // left hand arm
  sFieldingPosition: { type: String, trim: true },
  iRecentMatchId: { type: ObjectId, ref: 'matches' },
  nRecentAppearance: { type: Number }, // timestamp of last played match
  aFantasyPlayerRating: [{
    ePlatformType: { type: String, enum: ePlatformType.value },
    nRating: { type: Number }
  }],
  nPriority: {
    type: Number,
    default: 0
  },
  nBattingPerformancePoint: {
    type: Number,
    default: 0
  },
  nBowlingPerformancePoint: {
    type: Number,
    default: 0
  },
  sNationality: { type: String, trim: true }, // India, England
  nMatchesPlayed: { type: Number }, // from admin panel
  nRuns: { type: Number }, // from admin panel
  nWickets: { type: Number }, // from admin panel
  sNickName: { type: String, trim: true }, // from admin panel
  aMajorTeams: [{ type: String, trim: true }],
  oImg: {
    type: imageType
  },
  eProvider: { type: String, enum: eProvider.value, default: eProvider.default },
  eTagStatus: { type: String, enum: eListTagStatus.value, default: eListTagStatus.default },
  bTagEnabled: { type: Boolean, default: true },
  sCountryFull: { type: String, trim: true },
  sSex: { type: String }, // from teams via seriessquad
  sContent: { type: String },
  iPrimaryTeam: { type: ObjectId },
  sAmpContent: { type: String }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}).index({ sPlayerKey: 1, sFullName: 1 })

players.index({ sPlayerKey: 1 }, { unique: true })
players.index({ sFullName: 1, sFirstName: 1, sShortName: 1 })
players.index({ nBattingPerformancePoint: 1 })
players.index({ nBowlingPerformancePoint: 1 })

players.virtual('oStats', {
  ref: 'playerStats',
  localField: '_id',
  foreignField: 'iPlayerId',
  justOne: false
})

players.virtual('oPrimaryTeam', {
  ref: 'teams',
  localField: 'iPrimaryTeam',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('players', players)
