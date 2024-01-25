// @ts-check
const mongoose = require('mongoose')
const { GraphDBConnect } = require('../../database/mongoose')
const Schema = mongoose.Schema
const { logOperationType } = require('../../enums')
const AdminModel = require('./model')

const AdminLogs = new Schema({
  eOperationType: { type: String, enum: logOperationType?.value, required: true },
  sOperationName: { type: String, required: true },
  iAdminId: { type: Schema.Types.ObjectId, ref: AdminModel },
  oOldFields: { type: Object },
  oNewFields: { type: Object },
  oDetails: { type: Object },
  sIpAddress: { type: String }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})

module.exports = GraphDBConnect.model('adminLogs', AdminLogs)
