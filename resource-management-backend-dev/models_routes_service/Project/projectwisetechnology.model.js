const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const TechnologyModel = require('../Technology/model')
const ProjectModel = require('../Project/model')
const { status, projectType } = require('../../data')

const ProjectWiseTechnology = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  iTechnologyId: { type: Schema.Types.ObjectId, ref: TechnologyModel },
  eStatus: { type: String, default: 'Y', enum: status },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

ProjectWiseTechnology.index({ iProjectId: 1 })
ProjectWiseTechnology.index({ iTechnologyId: 1 })

module.exports = ResourceManagementDB.model('projectWiseTechnologies', ProjectWiseTechnology)
