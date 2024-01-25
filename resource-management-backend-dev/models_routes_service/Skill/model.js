const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const Skill = Schema({
  sName: { type: String },
  sKey: { type: String },
  sProgressColor: { type: String },
  eStatus: { type: String, default: 'Y', enum: status },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employee' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Skill.index({ sName: 1 })
Skill.index({ sKey: 1 })
Skill.index({ iCreatedBy: 1 })
Skill.index({ iLastUpdateBy: 1 })

Skill.pre('save', async function (next) {
  const skill = this
  if (skill.isModified('sName')) {
    skill.sName = camelCase(skill.sName)
  }
  if (skill.isModified('sKey')) {
    skill.sKey = keygen(skill.sName)
  }
  next()
})

Skill.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sKey) {
    this._update.sKey = keygen(this._update.sName)
  }
  next()
})

module.exports = ResourceManagementDB.model('skills', Skill)
