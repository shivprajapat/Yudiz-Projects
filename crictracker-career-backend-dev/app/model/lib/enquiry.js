const mongoose = require('mongoose')
const enums = require('../enums')

const enquiry = new mongoose.Schema(
  {
    iJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'job_posts' },
    sJobTitle: { type: String },
    eDesignation: { type: String, enum: enums.eDesignation.value },
    sFullName: { type: String, required: true, trim: true },
    sEmail: { type: String, required: true, trim: true },
    sPhone: { type: String, required: true, trim: true },
    sCurrentEmployer: { type: String, trim: true },
    sCurrentCTC: { type: String, required: true },
    sExpectedCTC: { type: String, required: true },
    sCurrentLocation: { type: String },
    iPreferredLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'locations', required: true },
    sTotalExperience: { type: String, required: true },
    sUploadCV: { type: String },
    sUploadSample: { type: String },
    sMessage: { type: String, required: true, trim: true },
    iProcessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    eStatus: { type: String, enum: enums.eStatus.value, default: enums.eStatus.default },
    sReference: String
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sName: 1, sEmail: 1 })

enquiry.virtual('oPreferredLocation', {
  ref: 'locations',
  localField: 'iPreferredLocationId',
  foreignField: '_id',
  justOne: true
})

enquiry.virtual('oJobData', {
  ref: 'job_posts',
  localField: 'iJobId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('enquiries', enquiry)
