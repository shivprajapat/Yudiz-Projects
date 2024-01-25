const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status, projectType } = require('../../data')

const DashboardCrIndicator = Schema({
  iCrId: { type: Schema.Types.ObjectId, ref: 'ChangeRequestModel' },
  iProjectId: { type: Schema.Types.ObjectId, ref: 'ProjectModel' },
  eProjectType: { type: String, default: 'Fixed', enum: projectType },
  eStatus: { type: String, default: 'Y', enum: status },
  nCost: { type: Number },
  nTimeLineDays: { type: Number },
  nMinutes: { type: Number },
  nRemainingMinute: { type: Number },
  nRemainingCost: { type: Number },
  nNonBillableMinute: { type: Number, default: 0 },
  nNonBillableCost: { type: Number, default: 0 },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('dashboardcrindicators', DashboardCrIndicator)
