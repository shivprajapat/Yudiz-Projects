// @ts-check
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../database/mongoose')
const data = require('../../enums')
const RoleModel = require('./roles/model')

const adminSchema = new Schema({
  sName: { type: String },
  sMobileNumber: { type: String },
  sPassword: { type: String },
  iRoleId: { type: ObjectId, ref: RoleModel },
  // eField: { type: String, enum: data.fields, default: 'NA' },
  // eDesignation: { type: String, default: 'NA' },
  dLoginAt: { type: Date },
  dPasswordChangeAt: { type: Date },
  eStatus: { type: String, enum: data.adminStatus?.value, default: data.adminStatus?.default },
  eType: { type: String, enum: data.adminType?.value },
  aJwtTokens: [{
    sToken: { type: String },
    sPushToken: { type: String, trim: true },
    dTimeStamp: { type: Date, default: Date.now }
  }]
},
{
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})

adminSchema.index({ sMobileNumber: 1 })

adminSchema.statics.filterData = function (admin) {
  admin.__v = undefined
  admin.dLoginAt = undefined
  admin.aJwtTokens = undefined
  admin.sPassword = undefined
  admin.dUpdatedAt = undefined
  return admin
}

module.exports = GraphDBConnect.model('Admin', adminSchema)
