const mongoose = require('mongoose')
const { eUserTokenType, eSocialType } = require('../enums')

const tokens = new mongoose.Schema(
  {
    iId: {
      type: mongoose.Schema.Types.ObjectId
    },
    eType: {
      type: String,
      enum: eUserTokenType.value,
      default: 'a'
    },
    aToken: [
      {
        sJwt: String,
        sPush: String,
        _id: false
      }
    ],
    oSocial: {
      sType: { type: String, enum: eSocialType.value },
      sId: { type: String },
      sToken: { type: String }
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ iId: 1 })

module.exports = mongoose.model('tokens', tokens)
