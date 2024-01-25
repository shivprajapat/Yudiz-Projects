const mongoose = require('mongoose')
const { gymDBConnect } = require('../../../database/mongoose')
const { status } = require('../../../data')
const inquiryModel = require('../model')
const adminModel = require('../../admin/model')
const employeeModel = require('../../employee/model')

const InquiryFollowup = new mongoose.Schema(
  {
    iInquiryID: { type: mongoose.Types.ObjectId, required: true, ref: inquiryModel },
    iCreatedBy: { type: mongoose.Types.ObjectId, required: true, ref: adminModel },
    iFollowupBy: { type: mongoose.Types.ObjectId, required: true, ref: employeeModel },
    sResponse: { type: String, required: true },
    nFollowupInDay: { type: Number },
    eStatus: { type: String, enum: status, default: 'Y' },
    dFollowupAt: { type: Date, required: true }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
InquiryFollowup.index({ iInquiryID: 1 })
InquiryFollowup.index({ iFollowupBy: 1 })
module.exports = gymDBConnect.model('inquiryFollowup', InquiryFollowup)
