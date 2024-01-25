const mongoose = require('mongoose')
const { eStatus } = require('../enums')

const role = new mongoose.Schema(
  {
    sName: { type: String, trim: true },
    aPermissions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'permissions'
    }],
    aParent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles'
    }],
    bIsDefault: {
      type: Boolean,
      default: false
    },
    eStatus: {
      type: String,
      enum: eStatus.value,
      default: eStatus.default
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sName: 1 })

module.exports = mongoose.model('roles', role)
