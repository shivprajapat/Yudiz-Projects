const mongoose = require('mongoose')
const socialLink = require('../sociallinks')
const { eGender, eDesignation, eUserType, eStatus } = require('../enums')

const admin = new mongoose.Schema(
  {
    // sFName => Fullname
    sFName: {
      type: String,
      required: true,
      trim: true
    },
    sEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    sPassword: {
      type: String,
      required: true,
      trim: true
    },
    // sUName => Username
    sUName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    sDisplayName: {
      type: String,
      trim: true
    },
    sNumber: {
      type: String,
      required: true,
      trim: true
    },
    eGender: {
      type: String,
      enum: eGender.value
    },
    eDesignation: {
      type: String,
      enum: eDesignation.value,
      default: eDesignation.default,
      trim: true
    },
    sCity: {
      type: String,
      trim: true
    },
    bIsVerified: {
      type: Boolean,
      default: false
    },
    sAddress: {
      type: String,
      trim: true
    },
    sBio: {
      type: String,
      trim: true
    },
    eType: {
      type: String,
      enum: eUserType.value,
      default: eUserType.default
    },
    // aSLinks: Social links
    aSLinks: [socialLink],
    eStatus: {
      type: String,
      enum: eStatus.value,
      default: eStatus.default
    },
    eDisplayStatus: {
      type: String,
      enum: eStatus.value,
      default: eStatus.default
    },
    sUrl: {
      type: String, // profile picture
      trim: true
    },
    bIsCustom: {
      type: Boolean,
      default: false
    },
    nArticleCount: {
      type: Number,
      default: 0
    },
    nViewCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ nArticleCount: 1, nViewCount: 1 })

// admin.pre('save', (next) => {
//   if (this.sFName) {
//     this.sFName = this.sFName.charAt(0).toUpperCase() + this.slice(1)
//   }
//   next()
// })

module.exports = mongoose.model('admins', admin)
