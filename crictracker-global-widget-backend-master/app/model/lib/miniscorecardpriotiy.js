const mongoose = require('mongoose')

const miniScoreCardPriority = new mongoose.Schema({
  iSeriesId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  nPriority: {
    type: Number,
    required: true
  },
  sTitle: {
    type: String,
    required: true
  },
  sSrtTitle: {
    type: String,
    required: true
  }
},
{ timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

module.exports = mongoose.model('miniscorecardpriority', miniScoreCardPriority)
