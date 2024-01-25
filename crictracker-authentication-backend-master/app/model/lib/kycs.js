const mongoose = require('mongoose')
const { eStatus } = require('../enums')

const kyc = new mongoose.Schema(
  {
    iAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins'
    },
    // sPName => Pancard name
    sPName: {
      type: String,
      trim: true
    },
    sIfsc: {
      type: String,
      trim: true
    },
    // sANumber => Account Number
    sANumber: {
      type: String,
      trim: true
    },
    // sAName => Account name
    sAName: {
      type: String,
      trim: true
    },
    sUrl: {
      type: String, // pan image
      trim: true
    },
    eStatus: {
      type: String,
      enum: eStatus.value,
      default: eStatus.default
    },
    sPanNumber: { type: String, trim: true },
    sBankDetailPic: { type: String, trim: true },
    sBankName: { type: String, trim: true },
    sBranchName: { type: String, trim: true }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ iAdminId: 1, sPName: 1, sANumber: 1, sAName: 1 })

module.exports = mongoose.model('kycs', kyc)
