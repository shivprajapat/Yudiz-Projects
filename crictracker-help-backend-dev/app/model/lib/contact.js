const mongoose = require('mongoose')
const enums = require('../enums')

const contact = new mongoose.Schema(
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
      required: true,
      trim: true
    },
    sCompany: {
      type: String,
      trim: true
    },
    eQueryType: {
      type: String,
      enum: enums.eContactQueryType.value,
      default: enums.eContactQueryType.default
    },
    sCity: {
      type: String,
      trim: true
    },
    sSubject: {
      type: String,
      required: true,
      trim: true
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

module.exports = mongoose.model('contacts', contact)
