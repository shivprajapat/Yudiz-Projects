const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { projectType, costType, projectStatus, status } = require('../../data')
const EmployeeModel = require('../Employee/model')

const flagProject = {
  _id: false,
  1: { type: String },
  2: { type: String },
  3: { type: String }
}

const Project = Schema({
  sName: { type: String },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  iProjectManagerId: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  iCurrencyId: { type: Schema.Types.ObjectId, ref: 'currencies' },
  iBAId: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  iBDId: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  sLogo: { type: String, default: '' },
  eCostType: { type: String, enum: costType },
  sCost: { type: String },
  iEstimateBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  dBillingCycleDate: { type: Number, default: 0 },
  dNoticePeriodDate: { type: Number, default: 0 },
  nMaxHours: { type: Number, default: 0 },
  nMinHours: { type: Number, default: 0 },
  dContractStartDate: { type: Date },
  dContractEndDate: { type: Date },
  nTimeLineDays: { type: Number },
  dStartDate: { type: Date },
  dEndDate: { type: Date },
  sProjectDescription: { type: String, default: '' },
  eProjectStatus: { type: String, enum: projectStatus, default: 'Pending' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  eStatus: { type: String, default: 'Y', enum: status },
  flag: {
    type: new Schema(flagProject),
    default: {
      1: 'N', 2: 'N', 3: 'N'
    }
  },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: EmployeeModel }

}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Project.index({ sName: 1 })
Project.index({ iCreatedBy: 1 })
Project.index({ iLastUpdateBy: 1 })

module.exports = ResourceManagementDB.model('projects', Project)
