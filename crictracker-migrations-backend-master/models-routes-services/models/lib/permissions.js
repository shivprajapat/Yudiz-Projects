const mongoose = require('mongoose')
const { ePermissionType, ePermissionsKeys } = require('../../enums')
const { AuthenticationDBConnect } = require('../../../db_services/mongoose')

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
      required: true
    },
    ePerType: {
      type: String
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

module.exports = AuthenticationDBConnect.model('permissions', permissions)
