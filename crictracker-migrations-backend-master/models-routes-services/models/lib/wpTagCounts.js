const mongoose = require('mongoose')
const { MigrationDBConnect } = require('../../../db_services/mongoose')

const wptagcounts = new mongoose.Schema({
  eType: { type: String }, // m - migration
  nS: { type: Number }, // nS - Simple tag
  nP: { type: Number }, //  nP - Player tag
  nT: { type: Number }, // nT - Team tag
  nA: { type: Number }, //  nA - Assigned tags
  nV: { type: Number } //  nV - Venue tags
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ eType: 1 })

module.exports = MigrationDBConnect.model('wptagcounts', wptagcounts)
