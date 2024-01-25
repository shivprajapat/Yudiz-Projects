const mongoose = require('mongoose')
const { ePermissionType, ePermissionsKeys, ePermissionDivisionType } = require('../enums')

const permissions = new mongoose.Schema(
  {
    eType: {
      type: String,
      enum: ePermissionType.value,
      required: true
    },
    eKey: {
      type: String,
      enum: ePermissionsKeys.value,
      required: true
    },
    sTitle: {
      type: String,
      required: true,
      trim: true
    },
    ePerType: {
      type: String,
      enum: ePermissionDivisionType.value
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ eKey: 1 })

module.exports = mongoose.model('permissions', permissions)
