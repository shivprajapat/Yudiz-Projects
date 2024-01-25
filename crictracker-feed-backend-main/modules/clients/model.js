const mongoose = require('mongoose')
const { connection: { feedConnection } } = require('../../app/db')
const { ObjectId } = mongoose.Schema.Types
const enums = require('../common/enums')

const clients = new mongoose.Schema({
  sName: { type: String, require: true },
  sUsername: { type: String, require: true, lowercase: true, trim: true, unique: true },
  sEmail: { type: String, require: true, lowercase: true, trim: true, unique: true },
  aToken: [{ sToken: String, eStatus: { type: String, enum: enums.eStatus.value, default: enums.eStatus.default }, dValidTill: Date, iGeneratedBy: { type: ObjectId, ref: 'admins' }, dCreatedAt: Date }],
  iSubscriptionId: { type: ObjectId, ref: 'subscriptions' },
  sExclusiveSlug: { type: String, lowercase: true, trim: true, unique: true },
  sPassword: { type: String, trim: true, required: true },
  aJwtTokens: [{
    sToken: { type: String },
    sPushToken: { type: String, trim: true },
    dTimeStamp: { type: Date, default: Date.now }
  }],
  sVerificationToken: { type: String },
  eStatus: {
    type: String,
    enum: enums.eStatus.value,
    default: enums.eStatus.default
  },
  sTz: { type: String, default: 'Asia/Kolkata' }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

clients.index({ eStatus: 1 })

module.exports = feedConnection.model('clients', clients)
