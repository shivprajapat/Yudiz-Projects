const mongoose = require('mongoose')
const { MatchManagementDBConnect } = require('../../../db_services/mongoose')

const enums = new mongoose.Schema({
  sKey: { type: String, trim: true }, // 1
  sValue: { type: String, trim: true }, // ODI (One Day International)
  eType: { type: String, trim: true }, // Format, MatchStatusCode, wagon, commentary,domestic, toss, role, Match Squad
  sDescription: { type: String, trim: true }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ sKey: 1 })

const model = MatchManagementDBConnect.model('enums', enums)
module.exports = model

// msc - match status code
// isc - inning status code
// irc - inning result code
// w - wagon
// c - commentry
// lmsc - (match state code) live match status code
// mfc - match format code
// mdc - Match Domestic Codes
// mtd - Match Toss Decision
// pr - Playing Role
// msr - Match Squad Role
