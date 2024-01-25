const mongoose = require('mongoose')
const { connection: { feedConnection } } = require('../../app/db')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const saltRounds = 10
const salt = bcryptjs.genSaltSync(saltRounds)
const { Schema } = mongoose
const Sentry = require('@sentry/node')
const config = require('../../config')
const enums = require('../common/enums')

const Admins = new Schema({
  sName: { type: String, trim: true, required: true },
  sUsername: { type: String, trim: true, required: true },
  sEmail: { type: String, trim: true, required: true },
  sProPic: { type: String, trim: true },
  eType: { type: String, enum: enums.eAdminType.value, required: true },
  aPermissions: [{
    eKey: {
      type: String,
      enum: ['USERS']
    },
    eType: {
      type: String,
      enum: ['R', 'W', 'N', 'LA'] // R = READ W = WRITE N = NONE ,LA = LIMITED ACCESS
    }
  }],
  sPassword: { type: String, trim: true, required: true },
  eStatus: {
    type: String,
    enum: enums.eStatus.value,
    default: enums.eStatus.default
  },
  aJwtTokens: [{
    sToken: { type: String },
    sPushToken: { type: String, trim: true },
    dTimeStamp: { type: Date, default: Date.now }
  }]
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

Admins.pre('save', function (next) {
  var admin = this
  let i
  if (admin.isModified('sName')) {
    const { sName } = admin
    var splitFullName = sName.toLowerCase().split(' ')
    for (i = 0; i < splitFullName.length; i++) {
      splitFullName[i] = splitFullName[i].charAt(0).toUpperCase() + splitFullName[i].substring(1)
    }
    admin.sName = splitFullName.join(' ')
  }
  if (admin.isModified('sPassword')) {
    admin.sPassword = bcryptjs.hashSync(admin.sPassword, salt)
  }
  if (admin.isModified('sEmail')) {
    admin.sEmail = admin.sEmail.toLowerCase()
  }
  next()
})

Admins.statics.findByToken = function (token) {
  var admin = this
  var decoded
  try {
    decoded = jwt.verify(token, config.JWT_SECRET)
  } catch (e) {
    Sentry.captureMessage(e)
    return new Promise((resolve, reject) => {
      reject(e)
    })
  }
  var query = {
    _id: decoded._id,
    'aJwtTokens.sToken': token,
    eStatus: 'a'
  }
  return admin.findOne(query, { _id: 1, eType: 1 })
}

Admins.index({ eStatus: 1, sEmail: 1 })

module.exports = feedConnection.model('admins', Admins)
