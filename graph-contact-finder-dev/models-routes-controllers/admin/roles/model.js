// @ts-check
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { GraphDBConnect } = require('../../../database/mongoose')
const { status, adminPermission, adminPermissionType } = require('../../../enums')

const Roles = new Schema({
  sName: { type: String, required: true },
  aPermissions: [{
    sKey: { type: String, enum: adminPermission },
    eType: { type: String, enum: adminPermissionType?.value }
  }],
  eStatus: { type: String, enum: status?.value, default: status?.default }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Roles.index({ 'aPermissions.sKey': 1 })
Roles.index({ eStatus: 1 })

module.exports = GraphDBConnect.model('roles', Roles)
