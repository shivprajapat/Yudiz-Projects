const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const EmployeeModel = require('../Employee/model')
const ProjectModel = require('../Project/model')
const { status, projectType } = require('../../data')

const ProjectWiseReview = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  iEmployeeId: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  sReview: { type: String, default: 'Add Review' },
  eStatus: { type: String, default: 'Y', enum: status },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

ProjectWiseReview.index({ iProjectId: 1 })
ProjectWiseReview.index({ iEmployeeId: 1 })

module.exports = ResourceManagementDB.model('projectWiseTags', ProjectWiseReview)
