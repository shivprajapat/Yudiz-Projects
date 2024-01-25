const mongoose = require('mongoose')
const { eGender, eStatus, eDeletedBy } = require('../enums')
const socialLink = require('../sociallinks')

const user = new mongoose.Schema(
  {
    sFullName: {
      type: String,
      trim: true
    },
    sEmail: {
      type: String,
      unique: true,
      trim: true
    },
    sPassword: {
      type: String,
      trim: true
    },
    sUsername: {
      type: String,
      trim: true
    },
    sMobNum: {
      type: String,
      trim: true
    },
    sProPic: {
      type: String,
      trim: true
    },
    eGender: {
      type: String,
      enum: eGender.value
    },
    sCity: {
      type: String,
      trim: true
    },
    sCountryId: {
      type: String,
      trim: true
    },
    aSLinks: [socialLink],
    sBio: {
      type: String,
      trim: true
    },
    eStatus: {
      type: String,
      enum: eStatus.value,
      default: eStatus.default
    },
    dDOB: {
      type: Date
    },
    bIsEmailVerified: {
      type: Boolean,
      default: false
    },
    bIsMobVerified: {
      type: Boolean,
      default: false
    },
    bNormalLogin: { // for checking user have password filed or not
      type: Boolean,
      default: true
    },
    nBookmarkCount: {
      type: Number,
      default: 0
    },
    oDelete: {
      dDeletedOn: {
        type: Date
      },
      iDeletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },
      eDeletedBy: {
        type: String,
        enum: eDeletedBy.value
      },
      sReason: {
        type: String
      }
    }
  },
  {
    timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })

user.index({ eType: 1 })
user.index({ sUsername: 1 })
user.index({ sEmail: 1, eStatus: 1 })
user.index({ sMobNum: 1, eStatus: 1 })
user.index({ sMobNum: 1 })
user.index({ dCreated: 1 })

user.virtual('oCountry', {
  ref: 'countries',
  localField: 'sCountryId',
  foreignField: 'sId',
  justOne: true
})

module.exports = mongoose.model('users', user)
