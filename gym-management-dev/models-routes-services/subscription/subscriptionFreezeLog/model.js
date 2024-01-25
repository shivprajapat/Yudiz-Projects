const mongoose = require('mongoose')
const adminModel = require('../../admin/model')
const customerModel = require('../../customer/model')
const { gymDBConnect } = require('../../../database/mongoose')

const SubscriptionFreezeLog = new mongoose.Schema(
  {
    iSubscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: customerModel, required: true },
    iCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: adminModel },
    nDay: { type: Number, required: true }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
SubscriptionFreezeLog.index({ iSubscriptionId: 1 })
module.exports = gymDBConnect.model('subscriptionFreezeLog', SubscriptionFreezeLog)
