const mongoose = require('mongoose')

const homePagePriority = new mongoose.Schema({
  iId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  sName: {
    type: String,
    required: true
  },
  eType: {
    type: String,
    required: true
  },
  nSort: {
    type: Number,
    required: true
  },
  bFutureSeries: {
    type: Boolean,
    default: false
  }
},
{ timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

module.exports = mongoose.model('homepagepriority', homePagePriority)
