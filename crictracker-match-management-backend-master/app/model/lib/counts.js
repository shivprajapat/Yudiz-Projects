const mongoose = require('mongoose')
const { eCountType } = require('../enums')

const counts = new mongoose.Schema({
  eType: { type: String, enums: eCountType.value, required: true },
  nAll: { type: Number }, // nAll - All - common of player & team
  nP: { type: Number }, //  nP - Pending - common of player & team
  nAp: { type: Number }, // nAp - Approved - common of player & team
  nR: { type: Number }, //  nR - Rejected - common of player & team
  nUM: { type: Number }, // nUM - Upcoming Matches
  nCM: { type: Number }, // nCM - Completed Matches
  nT: { type: Number }, // nT - Trash Matches articles
  nPending: { type: Number },
  nApproved: { type: Number },
  nSpam: { type: Number },
  nRejected: { type: Number },
  nTrash: { type: Number }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ eType: 1 })

module.exports = mongoose.model('counts', counts)
