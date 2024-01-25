const mongoose = require('mongoose')
const { gymDBConnect } = require('../../database/mongoose')
const { trainerType, status, gender, userType } = require('../../data')
const organizationModel = require('../organization/model')
const adminModel = require('../admin/model')
const Employee = new mongoose.Schema(
  {
    aBranchId: { type: [mongoose.Types.ObjectId], ref: organizationModel },
    iCreatedBy: { type: mongoose.Types.ObjectId, ref: adminModel },
    sName: { type: String, required: true, trim: true },
    eUserType: { type: String, enum: userType, default: 'S', required: true },
    sEmail: { type: String, required: true },
    sMobile: { type: String, required: true },
    nAge: { type: Number, required: true },
    eGender: { type: String, enum: gender },
    sAddress: { type: String, required: true },
    eType: { type: String, enum: trainerType },
    nExpertLevel: { type: Number },
    sExperience: { type: String },
    eStatus: { type: String, enum: status, default: 'Y' },
    nCharges: { type: Number },
    nCommission: { type: Number },
    dBirthDate: { type: Date },
    dAnniversaryDate: { type: Date }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
Employee.index({ sMobile: 1, sEmail: 1 })
Employee.index({ iBranchId: 1 })
Employee.index({ eStatus: 1 })
module.exports = gymDBConnect.model('employee', Employee)
