const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const City = Schema({
  sName: { type: String, trim: true },
  sKey: { type: String },
  sLatitude: { type: String, trim: true },
  sLongitude: { type: String, trim: true },
  eStatus: { type: String, enum: status, default: 'Y' },
  iCountryId: { type: Schema.Types.ObjectId, ref: 'countries' },
  iStateId: { type: Schema.Types.ObjectId, ref: 'states' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

City.pre('save', async function (next) {
  const city = this
  if (city.isModified('sName')) {
    city.sKey = keygen(city.sName)
  }
  next()
})

City.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sKey = keygen(this._update.sName)
  }
  next()
})

module.exports = ResourceManagementDB.model('cities', City)
