// @ts-check
const mongoose = require('mongoose')
const { GraphDBConnect } = require('../../database/mongoose')
const Schema = mongoose.Schema
const enums = require('../../enums')
const UserModel = require('../user/model')
const OTPSchema = new Schema({
  sLogin: { type: String },
  iUserId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
  sCode: { type: String, required: true },
  sType: { type: String, enum: enums.otpType?.value, required: true },
  sAuth: { type: String, enum: enums.otpAuth?.value, required: true },
  bIsVerify: { type: Boolean, default: false },
  bIsOperationCompleted: { type: Boolean, default: false }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})
OTPSchema.index({ iUserId: 1, sLogin: 1 })
module.exports = GraphDBConnect.model('otpVerifications', OTPSchema)
