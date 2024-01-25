const mongoose = require('mongoose')
const { eProvider, eListTagStatus } = require('../enums')

const venues = new mongoose.Schema({
  sVenueKey: { type: String, time: true }, // venue key
  sName: { type: String, time: true },
  sLocation: { type: String, time: true },
  sTimezone: { type: String, time: true },
  sKnownAs: { type: String, time: true }, // from admin
  sCountry: { type: String, time: true }, // from admin
  sCity: { type: String, time: true }, // from admin
  nOpenedYear: { type: Number }, // from admin
  sEnds: { type: String, time: true }, // city end, cathedral end
  sHomeTo: { type: String, time: true }, // from admin
  bFloodLights: { type: Boolean }, // from admin
  eProvider: { type: String, enum: eProvider.value }, // from admin
  sDescription: { type: String, time: true }, // from admin
  sUrl: { type: String, time: true }, // venue picture
  eTagStatus: { type: String, enum: eListTagStatus.value, default: eListTagStatus.default },
  bTagEnabled: { type: Boolean, default: true },
  sLatitude: { type: String },
  sLongitude: { type: String }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

venues.index({ sVenueKey: 1 }, { unique: true })

module.exports = mongoose.model('venues', venues)
