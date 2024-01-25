const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { keygen } = require('../../helper/utilities.services')

const State = Schema({
  sName: { type: String, trim: true },
  sKey: { type: String },
  sStateCode: { type: String }, // state_code
  sLatitude: { type: String, trim: true },
  sLongitude: { type: String, trim: true },
  eStatus: { type: String, enum: status, default: 'Y' },
  iCountryId: { type: Schema.Types.ObjectId, ref: 'countries' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

State.pre('save', async function (next) {
  const country = this
  if (country.isModified('sName')) {
    country.sKey = keygen(country.sName)
  }
  next()
})

State.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sKey = keygen(this._update.sName)
  }
  next()
})

module.exports = ResourceManagementDB.model('states', State)
