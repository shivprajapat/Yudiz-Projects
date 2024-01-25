const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { status } = require('../../data')

const Exercise = new mongoose.Schema(
  {
    sName: { type: String },
    sDescription: { type: String, default: '' },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)

module.exports = gymDBConnect.model('exercise', Exercise)
