const mongoose = require('mongoose')
const { CareerDBConnect } = require('../../../db_services/mongoose')

const jobPost = new mongoose.Schema(
  {
    sTitle: { type: String, required: true, unique: true },
    eDesignation: { type: String },
    iLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'locations' },
    eOpeningFor: { type: String },
    fExperienceFrom: { type: Number, required: true },
    fExperienceTo: { type: Number, required: true },
    fSalaryFrom: { type: Number },
    fSalaryTo: { type: Number },
    nOpenPositions: { type: Number, required: true },
    sDescription: { type: String, required: true },
    nEnquiryCount: { type: Number, default: 0 },
    iSubmittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    iProcessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    eStatus: { type: String }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

jobPost.virtual('oLocation', {
  ref: 'locations',
  localField: 'iLocationId',
  foreignField: '_id',
  justOne: true
})

module.exports = CareerDBConnect.model('job_posts', jobPost)
