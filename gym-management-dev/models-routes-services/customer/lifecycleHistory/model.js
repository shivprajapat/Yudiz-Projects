const mongoose = require('mongoose')
const { gymDBConnect } = require('../../../database/mongoose')
const { maritalStatus, foodType } = require('../../../data')
const CustomerModel = require('../model')
const LifeCycleHistory = new mongoose.Schema(
  {
    customerId: { type: mongoose.Types.ObjectId, ref: CustomerModel },
    height: { type: String },
    weight: { type: String },
    maritalStatus: { type: String, enum: maritalStatus },
    caste: { type: String },
    foodInfo: {
      type: { type: String, enum: foodType },
      description: { type: String }
    },
    sleepInfo: {
      wakeUpTime: { type: Date },
      bedTime: { type: Date },
      description: { type: String }
    },
    smokeInfo: {
      isSmoking: { type: Boolean },
      description: { type: String }
    },
    workInfo: {
      occupation: { type: String },
      designation: { type: String },
      workingTime: {
        startTime: { type: Date },
        endTime: { type: Date }
      },
      description: { type: String }
    },
    dietQuestions: {
      type: [
        {
          question: { type: String },
          answer: { type: String }
        }
      ]
    },
    medicalQuestions: {
      type: [
        {
          question: { type: String },
          answer: { type: String }
        }
      ]
    }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
LifeCycleHistory.index({ customerId: 1 })
module.exports = gymDBConnect.model('lifecycleHistory', LifeCycleHistory)
