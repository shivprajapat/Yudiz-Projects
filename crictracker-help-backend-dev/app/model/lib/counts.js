const mongoose = require('mongoose')
const { eCountType } = require('../enums')

const counts = new mongoose.Schema({
  eType: { type: String, enums: eCountType.value, required: true, unique: true },
  nES: { type: Number, enum: eCountType.value, default: 0 },
  nOE: { type: Number, enum: eCountType.value, default: 0 }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ eType: 1 })

module.exports = mongoose.model('counts', counts)
