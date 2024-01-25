const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const ProjectTagModel = require('../ProjectTag/model')
const ProjectModel = require('../Project/model')
const { status, projectType } = require('../../data')

const ProjectWiseTag = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  iProjectTagId: { type: Schema.Types.ObjectId, ref: ProjectTagModel },
  eStatus: { type: String, default: 'Y', enum: status },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

ProjectWiseTag.index({ iProjectId: 1 })
ProjectWiseTag.index({ iProjectTagId: 1 })

module.exports = ResourceManagementDB.model('projectWiseTags', ProjectWiseTag)
