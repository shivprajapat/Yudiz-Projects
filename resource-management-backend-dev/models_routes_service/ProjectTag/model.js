const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const ProjectTag = Schema({
  sName: { type: String },
  sKey: { type: String },
  sBackGroundColor: { type: String },
  sTextColor: { type: String },
  eStatus: { type: String, default: 'Y', enum: status },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

ProjectTag.index({ sName: 1 })
ProjectTag.index({ sKey: 1 })
ProjectTag.index({ iCreatedBy: 1 })
ProjectTag.index({ iLastUpdateBy: 1 })

ProjectTag.pre('save', async function (next) {
  const projectTag = this

  if (projectTag.isModified('sName')) {
    projectTag.sName = camelCase(projectTag.sName)
  }
  if (projectTag.isModified('sKey')) {
    projectTag.sKey = keygen(projectTag.sName)
  }
  next()
})

ProjectTag.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sKey) {
    this._update.sKey = keygen(this._update.sName)
  }
  next()
})

module.exports = ResourceManagementDB.model('projectTags', ProjectTag)
