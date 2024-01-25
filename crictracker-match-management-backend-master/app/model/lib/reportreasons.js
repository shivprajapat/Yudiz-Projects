const mongoose = require('mongoose')
const enums = require('../enums')

const reportreasons = new mongoose.Schema(
  {
    sTitle: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    eType: {
      type: String,
      enum: enums.eReportReasonType.value,
      default: enums.eReportReasonType.default
    },
    iSubmittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins'
    },
    iProcessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins'
    },
    nSort: { type: Number },
    eStatus: {
      type: String,
      enum: enums.eStatus.value,
      default: enums.eStatus.default
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ eStatus: 1 })

module.exports = mongoose.model('reportreasons', reportreasons)
