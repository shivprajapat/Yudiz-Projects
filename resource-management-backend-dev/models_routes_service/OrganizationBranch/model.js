const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const ORGBranch = Schema({
  sName: { type: String },
  sKey: { type: String },
  sAddress: { type: String },
  iCountryId: { type: Schema.Types.ObjectId, ref: 'countries' },
  iStateId: { type: Schema.Types.ObjectId, ref: 'states' },
  iCityId: { type: Schema.Types.ObjectId, ref: 'cities' },
  nCurrentEmployee: { type: Number, default: 0 },
  //   sCity: { type: String },
  //   sState: { type: String },
  //   sCountry: { type: String },
  sDescription: { type: String },
  bIsHeadquarter: { type: Boolean, default: false },
  nSeatingCapacity: { type: Number },
  eStatus: { type: String, default: 'Y', enum: status },
  //   sCountryCode: { type: String }, // iso3
  //   sStateCode: { type: String }, // state_code
  //   iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employee' },
  //   sEmoji: { type: String },
  //   sEmojiU: { type: String },
  sLatitude: { type: String },
  sLongitude: { type: String },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

ORGBranch.index({ iCreatedBy: 1 })
ORGBranch.index({ iLastUpdateBy: 1 })

ORGBranch.pre('save', async function (next) {
  const orgBranch = this
  if (orgBranch.isModified('sName')) {
    orgBranch.sName = camelCase(orgBranch.sName)
  }
  if (orgBranch.isModified('sKey')) {
    orgBranch.sKey = keygen(orgBranch.sName)
  }
  if (orgBranch.isModified('nCurrentEmployee')) {
    if (orgBranch.nCurrentEmployee < 0) {
      orgBranch.nCurrentEmployee = 0
    }
  }
  next()
})

ORGBranch.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sKey) {
    this._update.sKey = keygen(this._update.sName)
  }
  if (this._update.nCurrentEmployee) {
    if (this._update.nCurrentEmployee < 0) {
      this._update.nCurrentEmployee = 0
    }
  }
  next()
})

module.exports = ResourceManagementDB.model('orgbranches', ORGBranch)
