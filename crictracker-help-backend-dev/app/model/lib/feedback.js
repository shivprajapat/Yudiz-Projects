const mongoose = require('mongoose')
const enums = require('../enums')

const feedback = new mongoose.Schema(
  {
    sName: {
      type: String,
      required: true,
      trim: true
    },
    sEmail: {
      type: String,
      required: true,
      trim: true
    },
    sPhone: {
      type: String,
      trim: true
    },
    eQueryType: {
      type: String,
      enum: enums.eQueryType.value,
      default: enums.eQueryType.default
    },
    sSubject: {
      type: String,
      required: true,
      trim: true
    },
    sPageLink: {
      type: String
    },
    sMessage: {
      type: String,
      required: true,
      trim: true
    },
    eStatus: {
      type: String,
      enum: enums.eStatus.value,
      default: enums.eStatus.default
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sName: 1, sEmail: 1 })

module.exports = mongoose.model('feedbacks', feedback)
