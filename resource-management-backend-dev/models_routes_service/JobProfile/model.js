const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const JobProfile = Schema({
  sName: { type: String },
  sKey: { type: String },
  sPrefix: { type: String, default: 'Other', enum: ['Jr', 'Sr', 'Superior', 'Head', 'Lead', 'Other', 'Owner', 'Manager'] },
  eStatus: { type: String, default: 'Y', enum: status },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  bIsSystem: { type: Boolean, default: false },
  nTotal: { type: Number, default: 0 },
  nLevel: { type: Number, default: 0 },
  sLevel: { type: String, default: '' },
  sDescription: { type: String, default: '' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

JobProfile.index({ sName: 1 })
JobProfile.index({ sKey: 1 })
JobProfile.index({ iCreatedBy: 1 })
JobProfile.index({ iLastUpdateBy: 1 })

const obj = {
  1: 'CEO',
  2: 'CTO',
  3: 'FM',
  4: 'TL',
  5: 'EMP'
}

JobProfile.pre('save', async function (next) {
  const jobProfile = this
  if (jobProfile.isModified('sName')) {
    jobProfile.sName = camelCase(jobProfile.sName)
  }
  if (jobProfile.isModified('sKey')) {
    jobProfile.sKey = keygen(jobProfile.sName)
  }
  if (jobProfile.isModified('nLevel')) {
    jobProfile.sLevel = obj[jobProfile.nLevel]
  }
  if (jobProfile.isModified('nTotal')) {
    if (jobProfile.nTotal < 0) {
      jobProfile.nTotal = 0
    }
  }
  next()
})

JobProfile.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sKey) {
    this._update.sKey = keygen(this._update.sName)
  }
  if (this._update.nLevel) {
    this._update.sLevel = obj[this._update.nLevel]
  }
  if (this._update.nTotal) {
    if (this._update.nTotal < 0) {
      this._update.nTotal = 0
    }
  }
  next()
})

module.exports = ResourceManagementDB.model('jobprofiles', JobProfile)
