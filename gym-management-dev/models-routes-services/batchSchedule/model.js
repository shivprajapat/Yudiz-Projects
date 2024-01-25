const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { status } = require('../../data')
const OrganizationModel = require('../organization/model')

const batchScheduleSchema = new mongoose.Schema(
  {
    iBranchId: { type: mongoose.Schema.Types.ObjectId, ref: OrganizationModel },
    sTitle: { type: String },
    sDescription: { type: String },
    sStartTime: { type: String },
    sEndTime: { type: String },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)

module.exports = gymDBConnect.model('batchSchedule', batchScheduleSchema)
