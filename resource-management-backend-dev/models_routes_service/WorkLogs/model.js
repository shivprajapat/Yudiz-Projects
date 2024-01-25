const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const { status, projectType, currencyTakenFlag } = require('../../data')

const WorkLogs = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: 'projects' },
  iCrId: { type: Schema.Types.ObjectId, ref: 'crs' },
  iEmployeeId: { type: Schema.Types.ObjectId, ref: 'employees' },
  iDepartmentId: { type: Schema.Types.ObjectId, ref: 'departments' },
  dTaskStartTime: { type: Date },
  dTaskEndTime: { type: Date },
  nCost: { type: Number },
  nTimeLineDays: { type: Number },
  nMinutes: { type: Number },
  sTaskDetails: { type: String },
  eStatus: { type: String, default: 'Y', enum: status },
  aTaskTag: [{
    iTaskTag: { type: Schema.Types.ObjectId, ref: 'worklogtags' },
    sName: { type: String }
  }],
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employees' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'employees' },
  eWorkLogsType: { type: String, default: 'P' },
  bIsNonBillable: { type: Boolean, default: true },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  eCurrencyTakenFlag: { type: String, default: 'G', enum: currencyTakenFlag },
  sCurrencyName: { type: String },
  sCurrencySymbol: { type: String },
  nCurrencyValue: { type: Number },
  nClientCost: { type: Number },
  nOrgCost: { type: Number }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

module.exports = ResourceManagementDB.model('worklogs', WorkLogs)
