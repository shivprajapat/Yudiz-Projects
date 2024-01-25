// @ts-check
const mongoose = require('mongoose')
const { GraphDBConnect } = require('../../database/mongoose')
const { logOperationType } = require('../../enums')
const Schema = mongoose.Schema

const UserLogs = new Schema({
  eOperationType: { type: String, enum: logOperationType?.value, required: true },
  sOperationName: { type: String, required: true },
  oOldFields: { type: Object },
  oNewFields: { type: Object },
  sIpAddress: { type: String }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})

module.exports = GraphDBConnect.model('userLogs', UserLogs)
