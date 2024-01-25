const mongoose = require('mongoose')
const enums = require('../enums')

const footerMenu = new mongoose.Schema(
  {
    eType: {
      type: String,
      enum: enums.eFooterType.value,
      default: enums.eFooterType.default
    },
    aResults: [
      {
        sTitle: {
          type: String,
          required: true,
          trim: true
        },
        sUrl: {
          type: String,
          required: true
        }
      }
    ],
    eStatus: {
      type: String,
      enum: enums.eStatus.value,
      default: enums.eStatus.default
    },
    nPriority: {
      type: Number
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ eStatus: 1 })

footerMenu.index({ nPriority: 1 })

module.exports = mongoose.model('footer_menus', footerMenu)
