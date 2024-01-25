const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider, ePlatformType, eListTagStatus } = require('../../enums')
const { MatchManagementDBConnect } = require('../../../db_services/mongoose')

const imageType = {
  sText: { type: String, trim: true },
  sCaption: { type: String, trim: true },
  sAttribute: { type: String, trim: true },
  sUrl: { type: String, trim: true }
}

const players = new mongoose.Schema({
  sPlayerKey: { type: String, trim: true, unique: true },
  sAbout: { type: String, trim: true }, // from admin
  sShortName: { type: String, trim: true },
  sFirstName: { type: String, trim: true },
  sLastName: { type: String, trim: true },
  sMiddleName: { type: String, trim: true },
  sFullName: { type: String, trim: true }, // from admin panel || sTitle from ES
  dBirthDate: { type: Date },
  sBirthPlace: { type: String, trim: true },
  sCountry: { type: String, trim: true },
  sLogoUrl: { type: String, trim: true },
  sPlayingRole: { type: String, trim: true }, // bat, bowl
  sBattingStyle: { type: String, trim: true }, // right-hand arm
  sBowlingStyle: { type: String, trim: true }, // left hand arm
  sFieldingPosition: { type: String, trim: true },
  iRecentMatchId: { type: ObjectId, ref: 'matches' },
  nRecentAppearance: { type: Number }, // timestamp of last played match
  aFantasyPlayerRating: [{
    type: {
      ePlatformType: { type: String, enum: ePlatformType.value },
      nRating: { type: Number }
    }
  }],
  nPriority: {
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
  sCountryFull: { type: String, trim: true }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })
module.exports = MatchManagementDBConnect.model('players', players)
