const mongoose = require('mongoose')
const { eStatus, eOtpVerificationType, eOtpVerificationAuthType } = require('../enums')

const OTPVerifications = new mongoose.Schema({
  sCode: {
    type: String, required: true
  },
  eType: {
    type: String,
    enum: eOtpVerificationType.value,
    default: eOtpVerificationType.default,
    required: true
  }, // Email | Mobile
  eAuth: {
    type: String,
    enum: eOtpVerificationAuthType.value,
    required: true
  }, // Register | ForgotPass | Verification
  sEmail: {
    type: String,
    trim: true
  },
  iUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  sLogin: { type: String, trim: true },
  bIsVerify: {
    type: Boolean, default: false
  },
  sExpiryToken: String,
  eStatus: {
    type: String,
    enum: eStatus.value,
    default: eStatus.default,
    required: true
  }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

module.exports = mongoose.model('otpverifications', OTPVerifications)
