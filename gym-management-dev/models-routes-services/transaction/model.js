const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { status } = require('../../data')
const subscriptionsModel = require('../subscription/model')
const Transaction = new mongoose.Schema(
  {
    nPrice: { type: Number, required: true },
    iSubscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: subscriptionsModel },
    sDescription: { type: String },
    dTransactionDate: { type: Date, required: true },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
Transaction.index({ iSubscriptionId: 1 })
Transaction.index({ dTransactionDate: 1 })
module.exports = gymDBConnect.model('transactions', Transaction)
