const mongoose = require('mongoose')

const adminRoles = new mongoose.Schema(
  {
    iAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins'
    },
    aRoleId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles'
    }],
    aPermissions: [{
      _id: false,
      aRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles'
      }],
      iPermissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'permissions'
      }
    }]
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ iAdminId: 1, aRoleId: 1 })

module.exports = mongoose.model('adminroles', adminRoles)
