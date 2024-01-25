// @ts-check
const mongoose = require('mongoose')
const { GraphDBConnect } = require('../../database/mongoose')
const Schema = mongoose.Schema
const enums = require('../../enums')

const userSchema = new Schema({
  sName: { type: String, trim: true, required: true },
  sMobileNumber: { type: String, required: true },
  bIsUser: { type: Boolean, default: true },
  sPassword: { type: String, trim: true, required: true },
  eStatus: { type: String, enum: enums.userStatus?.value, default: enums.userStatus?.default },
  nAvgRating: { type: Number, default: 0 },
  nTotalReview: { type: Number, default: 0 },
  aJwtTokens: [{
    sToken: { type: String },
    sPushToken: { type: String, trim: true },
    dTimeStamp: { type: Date, default: Date.now }
  }],
  iSyncBy: { type: mongoose.Schema.Types.ObjectId },
  dLoginAt: { type: Date },
  dPasswordChangeAt: { type: Date },
  dDeletedAt: { type: Date }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
})
userSchema.index({ sMobileNumber: 1 })

userSchema.statics.filterData = function (user) {
  user.bIsUser = undefined
  user.aJwtTokens = undefined
  user.sPassword = undefined
  user.dLoginAt = undefined
  user.dUpdatedAt = undefined
  user.dPasswordChangeAt = undefined
  user.__v = undefined
  return user
}

module.exports = GraphDBConnect.model('User', userSchema)
