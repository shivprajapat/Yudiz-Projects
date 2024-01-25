const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const miniscorecardheader = new mongoose.Schema({
  iSeriesId: { type: ObjectId, required: true, ref: 'series' },
  nPriority: { type: Number }
}, {
  timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' }
})

module.exports = mongoose.model('miniscorecardheader', miniscorecardheader)

miniscorecardheader.virtual('oSeries', {
  ref: 'series',
  localField: 'iSeriesId',
  foreignField: '_id',
  justOne: true
})
