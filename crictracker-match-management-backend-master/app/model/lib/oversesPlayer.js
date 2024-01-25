const mongoose = require('mongoose')

const oversesplayer = new mongoose.Schema({
  sSeriesKey: { type: String, require: true },
  sHomeCountry: { type: String, require: true }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ sSeriesKey: 1 })

module.exports = mongoose.model('oversesplayer', oversesplayer)
