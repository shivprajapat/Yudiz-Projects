// @ts-check
const mongoose = require('mongoose')
const CustomerModel = require('../customer/model')
const { gymDBConnect } = require('../../database/mongoose')
const { status, planType } = require('../../data')
const MealPlan = new mongoose.Schema(
  {
    iCustomerId: { type: mongoose.Types.ObjectId, ref: CustomerModel },
    sTitle: { type: String },
    sDescription: { type: String },
    dStartDate: { type: Date },
    dEndDate: { type: Date },
    eType: { type: String, enum: planType, default: 'C' },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
MealPlan.index({ iCustomerId: 1 })
module.exports = gymDBConnect.model('mealPlan', MealPlan)
