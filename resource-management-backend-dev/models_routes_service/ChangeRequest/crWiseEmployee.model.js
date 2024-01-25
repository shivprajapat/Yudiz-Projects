const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const EmployeeModel = require('../Employee/model')

const { status, projectType } = require('../../data')

const CrWiseEmployee = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: 'ProjectModel' },
  eProjectType: { type: String, default: 'Fixed', enum: projectType },
  eStatus: { type: String, default: 'Y', enum: status },
  iCrId: { type: Schema.Types.ObjectId, ref: 'ChangeRequestModel' },
  iEmployeeId: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  nMinutes: { type: Number, default: 0 },
  nAvailabilityMinutes: { type: Number, default: 0 },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  nRemainingMinute: { type: Number, default: 0 },
  nRemainingCost: { type: Number, default: 0 },
  nNonBillableMinute: { type: Number, default: 0 },
  nNonBillableCost: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('crwiseemployees', CrWiseEmployee)
