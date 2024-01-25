const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const DepartmentModel = require('../Department/model')
const ProjectModel = require('../Project/model')
const { status, projectType } = require('../../data')

const ProjectWiseDepartment = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  eProjectType: { type: String, default: 'Fixed', enum: projectType },
  iDepartmentId: { type: Schema.Types.ObjectId, ref: DepartmentModel },
  nMinutes: { type: Number, default: 0 },
  nCost: { type: Number, default: 0 },
  eStatus: { type: String, default: 'Y', enum: status },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  nCostInPercentage: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('projectWiseDepartments', ProjectWiseDepartment)
