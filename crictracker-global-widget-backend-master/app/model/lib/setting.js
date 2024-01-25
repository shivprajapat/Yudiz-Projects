const mongoose = require('mongoose')
const { Mixed } = mongoose.Schema.Types

const setting = new mongoose.Schema(
  {
    sKey: String,
    mValue: Mixed
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

setting.index({ sKey: 1 })

module.exports = mongoose.model('setting', setting)
