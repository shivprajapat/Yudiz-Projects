const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { status } = require('../../data')

const Organization = new mongoose.Schema(
  {
    sName: { type: String, required: true },
    sLogo: { type: String, default: '' },
    sMobile: { type: String, required: true },
    sEmail: { type: String },
    sSecondaryMobile: { type: String, default: '' },
    sLocation: { type: String, required: true },
    isBranch: { type: Boolean, required: true, default: false },
    iOrganizationId: { type: mongoose.Types.ObjectId, ref: 'organization' },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)

module.exports = gymDBConnect.model('organization', Organization)
