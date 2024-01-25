const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const organizationModel = require('../organization/model')
const { status } = require('../../data')
const Admin = new mongoose.Schema(
  {
    sEmail: { type: String, required: true },
    sMobile: { type: String, required: true },
    sUserName: { type: String, required: true },
    sPassword: { type: String, required: true },
    iOrganizationId: { type: mongoose.Types.ObjectId, required: true, ref: organizationModel },
    iBranchId: { type: mongoose.Types.ObjectId, ref: organizationModel },
    aToken: [
      {
        sToken: { type: String },
        dTimeStamp: { type: Date, default: Date.now }
      }
    ],
    isAdmin: { type: Boolean, default: false },
    eStatus: { type: String, enum: status, default: 'Y' },
    iCreatedBy: { type: mongoose.Types.ObjectId, ref: 'admin' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
Admin.index({ sEmail: 1, sMobile: 1 })
module.exports = gymDBConnect.model('admin', Admin)
