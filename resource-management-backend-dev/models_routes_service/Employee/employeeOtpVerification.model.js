const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')

const EmployeeOtps = new Schema({
  sLogin: String,
  sType: String,
  sCode: { type: String, default: '' },
  sVerificationToken: { type: String, default: '' },
  dStartAt: { type: Date },
  dCreatedAt: { type: Date }
})

// crete index for dCreatedAt for expire time

EmployeeOtps.index({ dCreatedAt: 1 }, { expireAfterSeconds: 0 })

module.exports = ResourceManagementDB.model('employeeOtps', EmployeeOtps)
