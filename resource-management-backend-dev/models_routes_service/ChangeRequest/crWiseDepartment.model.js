const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status, projectType } = require('../../data')
const EmployeeModel = require('../Employee/model')
const DepartmentModel = require('../Department/model')
const ProjectModel = require('../Project/model')

const CrWiseDepartment = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  eProjectType: { type: String, default: 'Fixed', enum: projectType },
  eStatus: { type: String, default: 'Y', enum: status },
  iCrId: { type: Schema.Types.ObjectId, ref: 'ChangeRequestModel' },
  iDepartmentId: { type: Schema.Types.ObjectId, ref: DepartmentModel },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  nMinutes: { type: Number, default: 0 },
  nCost: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('crwisedepartments', CrWiseDepartment)
