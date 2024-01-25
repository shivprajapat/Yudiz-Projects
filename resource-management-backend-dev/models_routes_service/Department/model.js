const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const Department = Schema({
  sName: { type: String, trim: true },
  sKey: { type: String },
  eStatus: { type: String, default: 'Y', enum: status },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  sBackGroundColor: { type: String },
  sTextColor: { type: String },
  sDescription: { type: String },
  bIsSystem: { type: Boolean, default: false },
  iParentId: { type: Schema.Types.ObjectId, ref: 'DepartmentModel', default: null },
  nTotal: { type: Number, default: 0 },
  nMoved: { type: Number, default: 0 },
  aHeadId: [{ type: Schema.Types.ObjectId, ref: 'EmployeeModel' }]
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Department.index({ sName: 1 })
Department.index({ sKey: 1 })
Department.index({ iCreatedBy: 1 })
Department.index({ iLastUpdateBy: 1 })

Department.pre('save', async function (next) {
  const department = this
  if (department.isModified('sName')) {
    department.sName = camelCase(department.sName)
  }
  if (department.isModified('sKey')) {
    department.sKey = keygen(department.sName)
  }
  if (department.isModified('nTotal')) {
    if (department.nTotal < 0) {
      department.nTotal = 0
    }
  }
  next()
})

Department.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sKey) {
    this._update.sKey = keygen(this._update.sName)
  }
  if (this._update.nTotal) {
    if (this._update.nTotal < 0) {
      this._update.nTotal = 0
    }
  }
  next()
})

module.exports = ResourceManagementDB.model('departments', Department)
