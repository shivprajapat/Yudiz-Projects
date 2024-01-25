const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { inquiryStatus } = require('../../data')
const adminModel = require('../admin/model')
const organizationModel = require('../organization/model')

const Inquiry = new mongoose.Schema(
  {
    iBranchId: { type: mongoose.Types.ObjectId, ref: organizationModel, required: true },
    iCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: adminModel },
    sPurpose: { type: String, required: true },
    sDescription: { type: String, required: true },
    sPreferredLocation: { type: String },
    sName: { type: String, required: true },
    sEmail: { type: String },
    sPhone: { type: String, required: true },
    sSecondaryPhone: { type: String },
    dFollowupDate: { type: Date, required: true },
    nVisitCount: { type: Number, default: 1 },
    eStatus: { type: String, enum: inquiryStatus, default: 'N' },
    dInquiryAt: { type: Date, required: true }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
Inquiry.index({ iBranchId: 1 })
Inquiry.index({ iCreatedBy: 1 })
module.exports = gymDBConnect.model('inquiry', Inquiry)
