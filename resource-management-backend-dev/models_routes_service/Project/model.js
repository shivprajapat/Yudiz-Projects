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

Project.pre('save', async function (next) {
  const project = this
  if (project.isModified('eProjectStatus')) {
    // console.log('project.eProjectStatus', project.eProjectStatus)

    if (['In Progress'].includes(project.eProjectStatus) && project.eProjectType === 'Fixed' && (project?.dStartDate == null || project?.dStartDate === undefined)) {
      project.dStartDate = new Date()
    } else {
      project.dStartDate = null
    }

    if (['In Progress'].includes(project.eProjectStatus) && project.eProjectType === 'Dedicated' && (project?.dContractStartDate == null || project?.dContractStartDate === undefined)) {
      project.dContractStartDate = new Date()
    } else {
      project.dContractStartDate = null
    }
  }
  next()
})

Project.pre('findOneAndUpdate', async function (next) {
  // console.log('==================================================00000000000000000000')

  // console.log(['On Hold', 'In Progress', 'Completed', 'Closed'].includes(this._update.eProjectStatus), this._update.eProjectStatus)

  // console.log(this._update.eProjectType === 'Fixed', this._update.eProjectType)

  // console.log((this._update.dStartDate == null || this._update.dStartDate === undefined), this._update.dStartDate)

  // console.log((this._update.dContractStartDate == null || this._update.dContractStartDate === undefined), this._update.dContractStartDate)

  if (['On Hold', 'In Progress', 'Completed', 'Closed'].includes(this._update.eProjectStatus) && this._update.eProjectType === 'Fixed' && (this._update.dStartDate == null || this._update.dStartDate === undefined)) {
    this._update.dStartDate = new Date()
    // console.log('===================================================')
  }

  if (['On Hold', 'In Progress', 'Completed', 'Closed'].includes(this._update.eProjectStatus) && this._update.eProjectType === 'Dedicated' && (this._update.dContractStartDate == null || this._update.dContractStartDate === undefined)) {
    this._update.dContractStartDate = new Date()
    // console.log('===================================================')
  }
  next()
}
  // next()
)

module.exports = ResourceManagementDB.model('projects', Project)
