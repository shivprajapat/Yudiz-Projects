const mongoose = require('mongoose')
const { eProvider, eListTagStatus } = require('../enums')

const imageType = {
  sText: { type: String, trim: true },
  sCaption: { type: String, trim: true },
  sAttribute: { type: String, trim: true },
  sUrl: { type: String, trim: true }
}

const teams = new mongoose.Schema({
  sTeamKey: { type: String, time: true },
  sTitle: { type: String, time: true },
  sAbbr: { type: String, time: true },
  sLogoUrl: { type: String, time: true },
  sThumbUrl: { type: String, time: true },
  sTeamType: { type: String, time: true }, // team type Country(International Team) or Club,
  sCountry: { type: String, time: true },
  sAltName: { type: String, time: true },
  sSex: { type: String, time: true },
  oImg: {
    type: imageType
  },
  nPriority: {
    type: Number,
    default: 0
  },
  sDescription: { type: String, time: true }, // from admin
  eProvider: { type: String, enum: eProvider.value },
  eTagStatus: { type: String, enum: eListTagStatus.value, default: eListTagStatus.default },
  bTagEnabled: { type: Boolean, default: true },
  sCountryFull: { type: String, trim: true },
  oJersey: { type: imageType },
  bIsLeague: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

teams.index({ sTeamKey: 1 }, { unique: true })
teams.index({ sCountry: 1, sTitle: 1 })

module.exports = mongoose.model('teams', teams)
