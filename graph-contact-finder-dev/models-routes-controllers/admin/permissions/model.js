// @ts-check
const mongoose = require('mongoose')
const { GraphDBConnect } = require('../../../database/mongoose')
const Schema = mongoose.Schema
const { status } = require('../../../enums')

const Permissions = new Schema({
  sName: { type: String, required: true },
  sKey: { type: String, required: true },
  eStatus: { type: String, enum: status?.value, default: status?.default }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Permissions.index({ sKey: 1 })

module.exports = GraphDBConnect.model('Permissions', Permissions)
