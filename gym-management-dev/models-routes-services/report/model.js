const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { status, reportType } = require('../../data')

const Report = new mongoose.Schema(
  {
    sType: { type: String, enum: reportType, required: true },
    sFileName: { type: String, required: true },
    sPath: { type: String },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)

module.exports = gymDBConnect.model('report', Report)
