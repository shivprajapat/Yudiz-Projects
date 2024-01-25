// @ts-check
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../database/mongoose')
const { platform, adminLogTypes } = require('../../enums')
const AdminModel = require('./model')

const AdminAuthLogs = new Schema({
  iAdminId: { type: Schema.Types.ObjectId, ref: AdminModel },
  ePlatform: { type: String, enum: platform, required: true }, // A = Android, I = iOS, W = Web, O = Other, AD = Admin
  eType: { type: String, enum: adminLogTypes }, // L = Login, PC = Password Change, RP = Reset Password
  sDeviceToken: { type: String },
  sIpAddress: { type: String }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})

module.exports = GraphDBConnect.model('adminAuthLogs', AdminAuthLogs)
