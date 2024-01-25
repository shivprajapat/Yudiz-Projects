const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { subscriptionStatus, paymentStatus } = require('../../data')
const employeeModel = require('../employee/model')
const customerModel = require('../customer/model')
const organizationModel = require('../organization/model')
const adminModel = require('../admin/model')

const Subscription = new mongoose.Schema(
  {
    iBranchId: { type: mongoose.Types.ObjectId, ref: organizationModel, required: true },
    iCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: customerModel },
    iTrainerId: { type: mongoose.Schema.Types.ObjectId, ref: employeeModel },
    iCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: adminModel },
    nPaymentCycle: { type: Number },
    nPrice: { type: Number, required: true },
    dStartDate: { type: Date, required: true },
    dEndDate: { type: Date, required: true },
    ePaymentStatus: { type: String, enum: paymentStatus, default: 'P' },
    eStatus: { type: String, enum: subscriptionStatus, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
Subscription.index({ iBranchId: 1 })
Subscription.index({ iCustomerId: 1 })
Subscription.index({ iTrainerId: 1 })
module.exports = gymDBConnect.model('subscriptions', Subscription)
