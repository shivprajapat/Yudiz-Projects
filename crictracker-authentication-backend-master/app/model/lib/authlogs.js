const mongoose = require('mongoose')
const { Schema } = mongoose
const { eAuthPlatform, eAuthType } = require('../enums')

const AuthLogs = new Schema({
  iUserId: { type: Schema.Types.ObjectId, ref: 'users' },
  ePlatform: { type: String, enum: eAuthPlatform.value, required: true }, // A = Android, I = iOS, W = Web, O = Other
  eType: { type: String, enum: eAuthType.value }, // R = Register, L = Login, CP = Change Password, RP = Reset Password
  sIpAddress: { type: String },
  dCreated: { type: Date, default: Date.now() }
},
{ timestamps: { createdAt: 'dCreated' } }
)
AuthLogs.index({ iUserId: 1 })

module.exports = mongoose.model('authlogs', AuthLogs)
