const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const EmployeeModel = require('../Employee/model')
const { action, path, empType } = require('../../data')

const Logs = Schema({
  eActionBy: {
    eType: {
      type: String,
      trim: true,
      enum: empType
    },
    iId: {
      type: Schema.Types.ObjectId,
      ref: 'employees'
    }
  },
  iId: { type: Schema.Types.ObjectId },
  eModule: {
    type: String,
    trim: true,
    enum: path
  },
  sService: String,
  eAction: {
    type: String,
    trim: true,
    enum: action
  },
  sName: { type: String },
  sEmail: { type: String },
  sEmpId: { type: String },
  sJobProfile: { type: String },
  sDepartment: { type: String },
  aRole: [{
    iRoleId: { type: Schema.Types.ObjectId, ref: 'roles' },
    sName: { type: String },
    sKey: { type: String }
  }],
  iJobProfileId: { type: Schema.Types.ObjectId },
  iDepartmentId: { type: Schema.Types.ObjectId },
  oOldFields: { type: Object },
  oNewFields: { type: Object },
  eStatus: { type: String, default: 'Y' },
  oBody: { type: Object },
  oParams: { type: Object },
  oQuery: { type: Object },
  sToken: { type: String }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Logs.index({ eModule: 1 })
Logs.index({ sService: 1 })
Logs.index({ eAction: 1 })
Logs.index({ dCreatedAt: 1 })

Logs.pre('save', async function (next) {
  const logs = this
  if (logs.isModified('eActionBy.iId')) {
    const employee = await EmployeeModel.findById({ _id: logs.eActionBy.iId }, { _id: 1, sName: 1, sEmpId: 1, sEmail: 1, aRole: 1, iJobProfileId: 1, iDepartmentId: 1 }).populate({
      path: 'iJobProfileId',
      select: 'sName sKey'
    }).populate({
      path: 'iDepartmentId',
      select: 'sName sKey'
    })

    logs.sName = employee?.sName || 'unknown'
    logs.sEmail = employee?.sEmail || 'unknown999@gmail.com'
    logs.sEmpId = employee?.sEmpId || '0000'
    logs.aRole = employee?.aRole || []
    logs.sDepartment = employee?.iDepartmentId?.sName || 'unknown'
    logs.sJobProfile = employee?.iJobProfileId?.sName || 'unknown'
    logs.iDepartmentId = employee?.iDepartmentId?._id || null
    logs.iJobProfileId = employee?.iJobProfileId?._id || null
  }
  next()
})

module.exports = Logs
