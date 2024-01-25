const mongoose = require('mongoose')
const { eStatus } = require('../../enums')
const { AuthenticationDBConnect } = require('../../../db_services/mongoose')

const role = new mongoose.Schema(
  {
    sName: String,
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
)

module.exports = AuthenticationDBConnect.model('roles', role)
