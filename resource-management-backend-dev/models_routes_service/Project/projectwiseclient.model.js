const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const ClientModel = require('../Client/model')
const ProjectModel = require('../Project/model')
const { status, projectType } = require('../../data')

const ProjectWiseClient = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  iClientId: { type: Schema.Types.ObjectId, ref: ClientModel },
  eStatus: { type: String, default: 'Y', enum: status },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }

}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

ProjectWiseClient.index({ iProjectId: 1 })
ProjectWiseClient.index({ iClientId: 1 })

module.exports = ResourceManagementDB.model('projectWiseClients', ProjectWiseClient)
