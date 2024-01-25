const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const adminModel = require('../admin/model')
const { operationType } = require('../../data')
const OperationLog = new mongoose.Schema(
  {
    iOperationBy: { type: mongoose.Types.ObjectId, ref: adminModel },
    sOperationType: { type: String, enum: operationType, required: true },
    sOperationName: { type: String },
    oOperationBody: { type: Object }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
module.exports = gymDBConnect.model('operationLog', OperationLog)
