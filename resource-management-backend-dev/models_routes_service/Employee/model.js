const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const JobProfileModel = require('../JobProfile/model')
const DepartmentModel = require('../Department/model')
const skillModel = require('../Skill/model')
const { grade, status, score, devType, availabilityStatus, empType, showAllProjects } = require('../../data')
const { camelCase } = require('../../helper/utilities.services')

const Employee = Schema({
  sName: { type: String },
  sEmpId: { type: String },
  sMobNum: { type: String },
  eGrade: { type: String, enum: grade }, // client grade
  eStatus: { type: String, default: 'Y', enum: status },
  sPassword: { type: String, trim: true },
  sEmail: { type: String, trim: true },
  iJobProfileId: { type: Schema.Types.ObjectId, ref: JobProfileModel },
  iDepartmentId: { type: Schema.Types.ObjectId, ref: DepartmentModel },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: 'employees' },
  nExperience: { type: Number, trim: true },
  nAvailabilityHours: { type: Number },
  eAvailabilityStatus: { type: String, enum: availabilityStatus },
  sResumeLink: { type: String, trim: true },
  aSkills: [{
    iSkillId: { type: Schema.Types.ObjectId, ref: skillModel },
    sName: { type: String },
    eScore: { type: Number, enum: score, default: 0 }
  }],
  aRole: [{
    iRoleId: { type: Schema.Types.ObjectId, ref: 'roles' },
    sName: { type: String },
    sKey: { type: String },
    sBackGroundColor: { type: String },
    sTextColor: { type: String }
  }],
  aTotalPermissions: [
    {
      sKey: {
        type: String
      },
      aRoleId: [{ type: Schema.Types.ObjectId, ref: 'roles' }]
    }
  ],
  aJwtTokens: [{
    sToken: { type: String },
    sPushToken: { type: String },
    dTimeStamp: { type: Date, default: Date.now() }
  }],
  sProfilePic: { type: String, trim: true },
  eEmpType: { type: String, enum: empType, default: 'E' },
  eDevType: {
    type: String,
    enum: devType,
    default: 'Dedicated'
  },
  sReview: { type: String, trim: true },
  nPerhoursRate: { type: Number, default: 0 },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: 'EmployeeModel' },
  nPaid: { type: Number, default: 10 },
  iBranchId: { type: Schema.Types.ObjectId, ref: 'orgbranches' },
  eShowAllProjects: { type: String, enum: showAllProjects, default: 'OWN' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Employee.index({ sMobNum: 1 })
Employee.index({ sEmail: 1 })
Employee.index({ iCreatedBy: 1 })
Employee.index({ iLastUpdateBy: 1 })
Employee.index({ 'aJwtTokens.sToken': 1 })

Employee.pre('save', async function (next) {
  const employee = this
  if (employee.isModified('sName')) {
    employee.sName = camelCase(employee.sName)
  }
  if (employee.isModified('sEmail')) {
    employee.sEmail = employee.sEmail.toLowerCase()
  }
  next()
})

Employee.pre('findOneAndUpdate', async function (next) {
  if (this._update.sName) {
    this._update.sName = camelCase(this._update.sName)
  }
  if (this._update.sEmail) {
    this._update.sEmail = this._update.sEmail.toLowerCase()
  }

  next()
})

module.exports = ResourceManagementDB.model('employees', Employee)
