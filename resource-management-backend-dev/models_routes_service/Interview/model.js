const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const Employee = require('../Employee/model')
const ProjectTagModel = require('../ProjectTag/model')
const { status, interviewStatus, projectType } = require('../../data')

const Interview = Schema({
  iEmpId: { type: Schema.Types.ObjectId, ref: 'employees' },
  iClientId: { type: Schema.Types.ObjectId, ref: 'clients' },
  iProjectId: { type: Schema.Types.ObjectId, ref: 'projects' },
  eInterviewStatus: { type: String, enum: interviewStatus, default: 'Profile shared' },
  dInterviewDate: { type: Date },
  sInterviewTime: { type: String },
  aTechnologyId: [{ type: Schema.Types.ObjectId, ref: 'technologies' }],
  aProjectTag: [{ _id: { type: Schema.Types.ObjectId, ref: ProjectTagModel }, sName: String, sBackGroundColor: String, sTextColor: String }],
  sJobDescriptions: { type: String, trim: true },
  sInterviewDescriptions: { type: String, trim: true },
  sInterviewFeedback: { type: String, trim: true },
  eStatus: { type: String, enum: status, default: 'Y' },
  sInterviewRound: { type: String, trim: true },
  iCreatedBy: { type: Schema.Types.ObjectId, ref: Employee },
  iLastUpdateBy: { type: Schema.Types.ObjectId, ref: Employee },
  eProjectType: { type: String, enum: projectType, default: 'Fixed' }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Interview.index({ iEmpId: 1 })
Interview.index({ iClientId: 1 })
Interview.index({ iProjectId: 1 })
Interview.index({ iCreatedBy: 1 })
Interview.index({ iLastUpdateBy: 1 })

module.exports = ResourceManagementDB.model('interviews', Interview)
