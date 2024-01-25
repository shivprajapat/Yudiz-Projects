const mongoose = require('mongoose')

const country = new mongoose.Schema({
  sAbbr: { type: String, trim: true },
  sTitle: { type: String, trim: true },
  sISO: { type: String, trim: true }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ sISO: 1 })

const model = mongoose.model('country', country)
module.exports = model
