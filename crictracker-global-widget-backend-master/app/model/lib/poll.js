const mongoose = require('mongoose')
const enums = require('../enums')

const PollModel = new mongoose.Schema(
  {
    sTitle: { type: String },
    aField: [{
      sTitle: String,
      nVote: {
        type: Number,
        default: 0
      }
    }],
    nTotalVote: { type: Number, default: 0 },
    eStatus: {
      type: String,
      enum: enums.ePollStatus.value,
      default: enums.ePollStatus.default
    },
    dStartDate: {
      type: Date
    },
    dEndDate: {
      type: Date
    },
    sType: {
      type: String
    },
    sMatchPollTitle: {
      type: String
    }

  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

PollModel.index({ eStatus: -1, dStartDate: -1, sTitle: 1 })

module.exports = mongoose.model('poll', PollModel)
