const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status, projectType } = require('../../data')

const DashboardProjectIndicator = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: 'ProjectModel' },
  eStatus: { type: String, default: 'Y', enum: status },
  sCost: { type: String },
  nTimeLineDays: { type: Number },
  nMinutes: { type: Number },
  nRemainingMinute: { type: Number },
  nRemainingCost: { type: Number },
  nNonBillableMinute: { type: Number, default: 0 },
  nNonBillableCost: { type: Number, default: 0 },
  nOrgRemainingMinute: { type: Number, default: 0 },
  nOrgRemainingCost: { type: Number, default: 0 },
  nOrgNonBillableMinute: { type: Number, default: 0 },
  nOrgNonBillableCost: { type: Number, default: 0 },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('dashboardprojectindicators', DashboardProjectIndicator)
