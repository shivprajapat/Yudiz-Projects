const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const Role = Schema({
  sName: { type: String },
  sKey: { type: String },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employee' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  eStatus: { type: String, default: 'Y', enum: status },
  aPermissions: [{ type: Schema.Types.ObjectId, ref: 'permissions' }],
  sBackGroundColor: { type: String },
  sTextColor: { type: String },
  bIsDefault: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Role.index({ sName: 1 })
Role.index({ sKey: 1 })
Role.index({ iCreatedBy: 1 })
Role.index({ iLastUpdateBy: 1 })

Role.pre('save', async function (next) {
  const skill = this
  if (skill.isModified('sName')) {
    skill.sName = camelCase(skill.sName)
  }
  if (skill.isModified('sKey')) {
    skill.sKey = keygen(skill.sName)
  }
  next()
})

Role.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sKey) {
    this._update.sKey = keygen(this._update.sName)
  }
  next()
})

module.exports = ResourceManagementDB.model('roles', Role)
