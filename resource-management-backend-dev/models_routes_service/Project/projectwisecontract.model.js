const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const { contractNameFormate } = require('../../helper/utilities.services')
const ProjectModel = require('../Project/model')
const { status, projectType } = require('../../data')

const ProjectWiseContract = Schema({
  iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  sContract: { type: String, default: 'Add Contract' },
  sContentType: { type: String },
  sContentLength: { type: String },
  dLastModified: { type: Date },
  sName: { type: String },
  eStatus: { type: String, default: 'Y', enum: status },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  sDocumentName: { type: String }

  // iProjectId: { type: Schema.Types.ObjectId, ref: ProjectModel },
  // aContract: [{
  //   sContract: { type: String, default: 'Add Contract' },
  //   sName: { type: String },
  //   sContentType: { type: String },
  //   sContentLength: { type: String },
  //   dLastModified: { type: Date },
  //   eStatus: { type: String, default: 'Y', enum: status },
  //   iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  //   iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }
  // }],
  // dContractStartDate: { type: Date },
  // dContractEndDate: { type: Date },
  // eStatus: { type: String, default: 'Y', enum: status },
  // eProjectType: { type: String, enum: projectType, default: 'Fixed' },
  // iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  // iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' }

}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

ProjectWiseContract.index({ iProjectId: 1 })

ProjectWiseContract.pre('save', async function (next) {
  const contract = this
  if (contract.isModified('sContract')) {
    contract.sName = contractNameFormate(contract.sContract)
  }
  next()
})

ProjectWiseContract.pre('findOneAndUpdate', async function (next) {
  if (this._update.sContract) {
    this._update.sName = contractNameFormate(this._update.sContract)
  }
  next()
})

module.exports = ResourceManagementDB.model('projectWiseContracts', ProjectWiseContract)
