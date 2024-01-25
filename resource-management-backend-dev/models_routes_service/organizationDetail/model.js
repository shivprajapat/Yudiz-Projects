const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const OrganizationDetail = Schema({
  sName: { type: String, trim: true },
  sKey: { type: String },
  nHoursPerDay: { type: Number, default: 8 },
  nDaysPerMonth: { type: Number, default: 20 },
  eStatus: { type: String, default: 'Y', enum: status },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  nMaxHoursPerDay: { type: Number, default: 8 },
  nMaxHoursPerMonth: { type: Number, default: 160 },
  nMaxMinutesPerDay: { type: Number, default: 480 },
  nMaxMinutesPerMonth: { type: Number, default: 9600 },
  nFoundedYear: { type: Number, default: 1947 },
  sLogo: { type: String, defaul: 'https://picsum.photos/id/237/300/300' },
  sUrl: { type: String, default: 'https://picsum.photos/id/237/300/300' },
  sOrganizationUrl: { type: String, default: 'http://rmp.webdevprojects.cloud/login' },
  dRemoveNetworkLogsDate: { type: Date, default: new Date() },
  dRemoveOperationLogsDate: { type: Date, default: new Date() }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

OrganizationDetail.pre('save', async function (next) {
  const organizationDetail = this
  // if (organizationDetail.isModified('nMaxHoursPerDay')) {
  //   organizationDetail.nMaxMinutesPerDay = organizationDetail.nMaxHoursPerDay * 60
  // }
  // if (organizationDetail.isModified('nMaxHoursPerMonth')) {
  //   organizationDetail.nMaxMinutesPerMonth = organizationDetail.nMaxHoursPerMonth * 60
  // }
  if (organizationDetail.isModified('sLogo')) {
    organizationDetail.sUrl = 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + organizationDetail.sLogo
  }
  next()
})

OrganizationDetail.pre('findOneAndUpdate', async function (next) {
  // if (this._update.nMaxHoursPerDay) {
  //   this._update.nMaxMinutesPerDay = this._update.nMaxHoursPerDay * 60
  // }
  // if (this._update.nMaxHoursPerMonth) {
  //   this._update.nMaxMinutesPerMonth = this._update.nMaxHoursPerMonth * 60
  // }
  if (this._update.sLogo) {
    this._update.sUrl = 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + this._update.sLogo
  }

  next()
})

module.exports = ResourceManagementDB.model('organizationdetails', OrganizationDetail)
