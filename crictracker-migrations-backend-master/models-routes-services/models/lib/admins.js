const mongoose = require('mongoose')
const socialLink = require('../sociallinks')
const { AuthenticationDBConnect } = require('../../../db_services/mongoose')

const admin = new mongoose.Schema(
  {
    // sFName => Fullname
    sFName: {
      type: String,
      required: true
    },
    sEmail: {
      type: String,
      required: true,
      unique: true
    },
    sPassword: {
      type: String,
      required: true
    },
    // sUName => Username
    sUName: {
      type: String,
      required: true,
      unique: true
    },
    sDisplayName: {
      type: String
    },
    sNumber: {
      type: String,
      required: true
    },
    eGender: {
      type: String
    },
    eDesignation: {
      type: String
    },
    sCity: {
      type: String
    },
    bIsVerified: {
      type: Boolean,
      default: false
    },
    sAddress: {
      type: String
    },
    sBio: {
      type: String
    },
    eType: {
      type: String
    },
    // aSLinks: Social links
    aSLinks: [socialLink],
    eStatus: {
      type: String
    },
    sUrl: {
      type: String // profile picture
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
)

// admin.pre('save', (next) => {
//   if (this.sFName) {
//     this.sFName = this.sFName.charAt(0).toUpperCase() + this.slice(1)
//   }
//   next()
// })

module.exports = AuthenticationDBConnect.model('admins', admin)
