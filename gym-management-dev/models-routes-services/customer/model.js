const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { gender, status, referUserType } = require('../../data')
const organizationModel = require('../organization/model')
const adminModel = require('../admin/model')
const batchScheduleModel = require('../batchSchedule/model')
const Customer = new mongoose.Schema(
  {
    iBranchId: { type: mongoose.Schema.Types.ObjectId, ref: organizationModel, required: true },
    iBatchScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: batchScheduleModel },
    iCreateBy: { type: mongoose.Schema.Types.ObjectId, ref: adminModel },
    oReferInfo: {
      sUserType: { type: String, enum: referUserType },
      iUserId: { type: mongoose.Schema.Types.ObjectId },
      sName: { type: String },
      sMobile: { type: String }
    },
    sName: { type: String, required: true, trim: true },
    sEmail: { type: String, required: true },
    sMobile: { type: String, required: true },
    dBirthDate: { type: Date },
    dAnniversaryDate: { type: Date },
    nAge: { type: Number, required: true },
    eGender: { type: String, enum: gender },
    sAddress: { type: String, required: true },
    sFitnessGoal: { type: String },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
Customer.index({ sMobile: 1, sEmail: 1 })
Customer.index({ iBranchId: 1 })
Customer.index({ eStatus: 1 })
module.exports = gymDBConnect.model('customers', Customer)
