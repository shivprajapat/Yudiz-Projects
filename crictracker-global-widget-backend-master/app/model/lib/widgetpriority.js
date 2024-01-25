const mongoose = require('mongoose')
const enums = require('../enums')

const widgetPriority = new mongoose.Schema(
  {
    eType: String,
    nPriority: Number,
    sPosition: String,
    mValue: mongoose.Schema.Types.Mixed, // field for showing widget like poll
    eStatus: {
      type: String,
      enum: enums.eStatus.value,
      default: enums.eStatus.default
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

module.exports = mongoose.model('widgetPriority', widgetPriority)
