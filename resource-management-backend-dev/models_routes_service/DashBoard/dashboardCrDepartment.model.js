const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status, projectType } = require('../../data')
const DepartmentModel = require('../Department/model')
const ProjectModel = require('../Project/model')

const DashboardCrDepartment = Schema({
  iCrId: { type: Schema.Types.ObjectId, ref: 'ChangeRequestModel' },
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  eProjectType: { type: String, default: 'Fixed', enum: projectType },
  iDepartmentId: { type: Schema.Types.ObjectId, ref: DepartmentModel },
  nMinutes: { type: Number, default: 0 },
  nCost: { type: Number, default: 0 },
  nRemainingMinute: { type: Number, default: 0 },
  nRemainingCost: { type: Number, default: 0 },
  eStatus: { type: String, default: 'Y', enum: status },
  nNonBillableMinute: { type: Number, default: 0 },
  nNonBillableCost: { type: Number, default: 0 },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('dashboardcrdepartments', DashboardCrDepartment)
