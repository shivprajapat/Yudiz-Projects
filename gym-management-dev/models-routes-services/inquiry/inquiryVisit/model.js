const mongoose = require('mongoose')
const { gymDBConnect } = require('../../../database/mongoose')
const { status } = require('../../../data')
const inquiryModel = require('../model')
const adminModel = require('../../admin/model')

const InquiryVisit = new mongoose.Schema(
  {
    iInquiryID: { type: mongoose.Types.ObjectId, required: true, ref: inquiryModel },
    iCreatedBy: { type: mongoose.Types.ObjectId, ref: adminModel },
    sPurpose: { type: String, required: true },
    sDescription: { type: String },
    dVisitedAt: { type: Date, required: true },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
InquiryVisit.index({ iInquiryID: 1 })
module.exports = gymDBConnect.model('inquiryVisit', InquiryVisit)
