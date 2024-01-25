const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status, projectType, projectStatus } = require('../../data')
const ProjectModel = require('../Project/model')

const ChangeRequest = Schema({
  sName: { type: String, default: '' },
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  eStatus: { type: String, default: 'Y', enum: status },
  sDescription: { type: String, default: '' },
  nTimeLineDays: { type: Number, default: 0 },
  nCost: { type: Number, default: 0 },
  dStartDate: { type: Date, default: Date.now },
  dEndDate: { type: Date, default: Date.now },
  eCrStatus: { type: String, enum: projectStatus, default: 'Pending' },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('changerequests', ChangeRequest)
