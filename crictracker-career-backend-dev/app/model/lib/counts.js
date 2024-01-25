const mongoose = require('mongoose')
const { eCountType } = require('../enums')

const counts = new mongoose.Schema({
  eType: { type: String, enums: eCountType.value, required: true, unique: true },
  nJP: { type: Number }, // nJP - job post
  nER: { type: Number } // nER - Enquiry Received
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ eType: 1 })

module.exports = mongoose.model('counts', counts)
