const mongoose = require('mongoose')
const enums = require('../enums')

const jobPost = new mongoose.Schema(
  {
    sTitle: { type: String, required: true, unique: true, trim: true },
    eDesignation: { type: String, enum: enums.eDesignation.value },
    iLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'locations' },
    eOpeningFor: { type: String, enum: enums.eOpeningFor.value, default: enums.eOpeningFor.default },
    fExperienceFrom: { type: Number, required: true },
    fExperienceTo: { type: Number, required: true },
    fSalaryFrom: { type: Number },
    fSalaryTo: { type: Number },
    nOpenPositions: { type: Number, required: true },
    sDescription: { type: String, required: true, trim: true },
    nEnquiryCount: { type: Number, default: 0 },
    iSubmittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    iProcessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    eStatus: { type: String, enum: enums.eStatus.value, default: enums.eStatus.default }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sTitle: 1, eDesignation: 1 })

jobPost.index({ sTitle: 1, eDesignation: 1, eStatus: 1 })
jobPost.index({ sTitle: 1, eStatus: 1 })
jobPost.index({ _id: 1, eStatus: 1 })
jobPost.index({ sSlug: 1, eStatus: 1 })

jobPost.virtual('oLocation', {
  ref: 'locations',
  localField: 'iLocationId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('job_posts', jobPost)
