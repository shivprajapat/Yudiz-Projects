const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogYear = Schema({
  sName: { type: String },
  sYear: { type: String },
  uId: { type: String }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

LogYear.index({ sName: 1 })
LogYear.index({ sYear: 1 })
LogYear.index({ dCreatedAt: 1 })

module.exports = LogYear
