const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const EmployeeModel = require('../Employee/model')
const ProjectModel = require('../Project/model')
const { status, projectType, costType } = require('../../data')

const ProjectWiseEmployee = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  iEmployeeId: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  iDepartmentId: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  nMinutes: { type: Number, default: 0 },
  nAvailabilityMinutes: { type: Number, default: 0 },
  sReview: { type: String, default: '' },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  eCostType: { type: String, enum: costType, default: 'Hourly' },
  nMaxMinutes: { type: Number, default: 0 },
  nMinMinutes: { type: Number, default: 0 },
  eStatus: { type: String, default: 'Y', enum: status },
  nRemainingMinute: { type: Number, default: 0 },
  nRemainingCost: { type: Number, default: 0 },
  nNonBillableMinute: { type: Number, default: 0 },
  nNonBillableCost: { type: Number, default: 0 },
  nOrgRemainingMinute: { type: Number, default: 0 },
  nOrgRemainingCost: { type: Number, default: 0 },
  nOrgNonBillableMinute: { type: Number, default: 0 },
  nOrgNonBillableCost: { type: Number, default: 0 },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  nCost: { type: Number, default: 0 },
  nClientCost: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

ProjectWiseEmployee.index({ iProjectId: 1 })
ProjectWiseEmployee.index({ iEmployeeId: 1 })

ProjectWiseEmployee.pre('save', async function (next) {
  const projectsEmployee = this
  // if (projectsEmployee.isModified('nMinutes')) {
  //   if (projectsEmployee.nMinutes < 0) {
  //     projectsEmployee.nMinutes = 0
  //   }
  // }
  // if (projectsEmployee.isModified('nRemainingMinute')) {
  //   if (projectsEmployee.nRemainingMinute < 0) {
  //     projectsEmployee.nRemainingMinute = 0
  //   }
  // }
  // if (projectsEmployee.isModified('nRemainingCost')) {
  //   if (projectsEmployee.nRemainingCost < 0) {
  //     projectsEmployee.nRemainingCost = 0
  //   }
  // }
  // if (projectsEmployee.isModified('nNonBillableMinute')) {
  //   if (projectsEmployee.nNonBillableMinute < 0) {
  //     projectsEmployee.nNonBillableMinute = 0
  //   }
  // }
  // if (projectsEmployee.isModified('nNonBillableCost')) {
  //   if (projectsEmployee.nNonBillableCost < 0) {
  //     projectsEmployee.nNonBillableCost = 0
  //   }
  // }
  // if (projectsEmployee.isModified('nOrgRemainingMinute')) {
  //   if (projectsEmployee.nOrgRemainingMinute < 0) {
  //     projectsEmployee.nOrgRemainingMinute = 0
  //   }
  // }
  // if (projectsEmployee.isModified('nOrgRemainingCost')) {
  //   if (projectsEmployee.nOrgRemainingCost < 0) {
  //     projectsEmployee.nOrgRemainingCost = 0
  //   }
  // }
  // if (projectsEmployee.isModified('nOrgNonBillableMinute')) {
  //   if (projectsEmployee.nOrgNonBillableMinute < 0) {
  //     projectsEmployee.nOrgNonBillableMinute = 0
  //   }
  // }
  // if (projectsEmployee.isModified('nOrgNonBillableCost')) {
  //   if (projectsEmployee.nOrgNonBillableCost < 0) {
  //     projectsEmployee.nOrgNonBillableCost = 0
  //   }
  // }
  next()
})

ProjectWiseEmployee.pre('findOneAndUpdate', async function (next) {
  // if (this._update.nMinutes) {
  //   if (this._update.nMinutes < 0) {
  //     this._update.nMinutes = 0
  //   }
  // }
  // if (this._update.nRemainingMinute) {
  //   if (this._update.nRemainingMinute < 0) {
  //     this._update.nRemainingMinute = 0
  //   }
  // }
  // if (this._update.nRemainingCost) {
  //   if (this._update.nRemainingCost < 0) {
  //     this._update.nRemainingCost = 0
  //   }
  // }
  // if (this._update.nNonBillableMinute) {
  //   if (this._update.nNonBillableMinute < 0) {
  //     this._update.nNonBillableMinute = 0
  //   }
  // }
  // if (this._update.nNonBillableCost) {
  //   if (this._update.nNonBillableCost < 0) {
  //     this._update.nNonBillableCost = 0
  //   }
  // }
  // if (this._update.nOrgRemainingMinute) {
  //   if (this._update.nOrgRemainingMinute < 0) {
  //     this._update.nOrgRemainingMinute = 0
  //   }
  // }
  // if (this._update.nOrgRemainingCost) {
  //   if (this._update.nOrgRemainingCost < 0) {
  //     this._update.nOrgRemainingCost = 0
  //   }
  // }
  // if (this._update.nOrgNonBillableMinute) {
  //   if (this._update.nOrgNonBillableMinute < 0) {
  //     this._update.nOrgNonBillableMinute = 0
  //   }
  // }
  // if (this._update.nOrgNonBillableCost) {
  //   if (this._update.nOrgNonBillableCost < 0) {
  //     this._update.nOrgNonBillableCost = 0
  //   }
  // }
  next()
})

module.exports = ResourceManagementDB.model('projectWiseEmployees', ProjectWiseEmployee)
