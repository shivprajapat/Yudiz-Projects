// @ts-check
const mongoose = require('mongoose')
const CustomerModel = require('../customer/model')
const { planType, status } = require('../../data')
const { gymDBConnect } = require('../../database/mongoose')
const WorkoutPlan = new mongoose.Schema(
  {
    iCustomerId: { type: mongoose.Types.ObjectId, ref: CustomerModel },
    sTitle: { type: String },
    sDescription: { type: String },
    dStartDate: { type: Date, required: true },
    dEndDate: { type: Date, required: true },
    eType: { type: String, enum: planType, default: 'C' },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
module.exports = gymDBConnect.model('workoutPlan', WorkoutPlan)
