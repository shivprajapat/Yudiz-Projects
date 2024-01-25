const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const Country = Schema({
  sName: { type: String, trim: true },
  sKey: { type: String },
  sLatitude: { type: String, trim: true },
  sLongitude: { type: String, trim: true },
  sEmoji: { type: String },
  sEmojiU: { type: String },
  eStatus: { type: String, enum: status, default: 'Y' },
  sCountryCode: { type: String } // iso3
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Country.pre('save', async function (next) {
  const country = this
  if (country.isModified('sName')) {
    country.sKey = keygen(country.sName)
  }
  next()
})

Country.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sKey = keygen(this._update.sName)
  }
  next()
})

module.exports = ResourceManagementDB.model('countries', Country)
