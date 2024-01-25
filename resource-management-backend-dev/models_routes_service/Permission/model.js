const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const { status, modules } = require('../../data')
const { camelCase, keygen } = require('../../helper/utilities.services')

const Permission = Schema({
  sName: { type: String },
  sKey: { type: String },
  sModule: { type: String, enum: modules, default: 'OTHERS' },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employee' },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  eStatus: { type: String, default: 'Y', enum: status },
  bIsActive: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Permission.index({ sName: 1 })
Permission.index({ sKey: 1 })
Permission.index({ iCreatedBy: 1 })
Permission.index({ iLastUpdateBy: 1 })

// Permission.pre('save', async function (next) {
//   console.log('Permission.pre save')
//   const permission = this
//   if (permission.isModified('sName')) {
//     permission.sName = permission.sName.toUpperCase()
//   }
//   if (permission.isModified('sKey')) {
//     permission.sKey = permission.sName.toUpperCase()
//   }
//   next()
// })

// Permission.pre('findOneAndUpdate', async function (next) {
//   if (this._update.sName) {
//     this._update.sName = this._update.sName.toUpperCase()
//   }
//   next()
// })

module.exports = ResourceManagementDB.model('permissions', Permission)
