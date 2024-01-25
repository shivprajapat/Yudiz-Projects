const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const RuntimeCredential = Schema({
  sAccessToken: { type: String, trim: true },
  sRefreshToken: { type: String, trim: true },
  eStatus: { type: String, default: 'Y', enum: status },
  sScope: { type: String, trim: true },
  eToken_type: { type: String, trim: true },
  dExpireAt: { type: Number, default: 0 },
  sService: { type: String, trim: true },
  eType: { type: String, default: 'oAuth', enum: ['oAuth', 'serviceAccount'] }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

// OrganizationDetail.pre('save', async function (next) {
//   const organizationDetail = this
//   if (organizationDetail.isModified('nMaxHoursPerDay')) {
//     organizationDetail.nMaxMinutesPerDay = organizationDetail.nMaxHoursPerDay * 60
//   }
//   if (organizationDetail.isModified('nMaxHoursPerMonth')) {
//     organizationDetail.nMaxMinutesPerMonth = organizationDetail.nMaxHoursPerMonth * 60
//   }
//   next()
// })

// OrganizationDetail.pre('findOneAndUpdate', async function (next) {
//   if (this._update.nMaxHoursPerDay) {
//     this._update.nMaxMinutesPerDay = this._update.nMaxHoursPerDay * 60
//   }
//   if (this._update.nMaxHoursPerMonth) {
//     this._update.nMaxMinutesPerMonth = this._update.nMaxHoursPerMonth * 60
//   }

//   next()
// })

module.exports = ResourceManagementDB.model('runtimecredentials', RuntimeCredential)
