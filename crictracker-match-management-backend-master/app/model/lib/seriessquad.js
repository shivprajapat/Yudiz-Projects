const mongoose = require('mongoose')
const { eProvider } = require('../enums')

const seriessquad = new mongoose.Schema({
  sTitle: { type: String, time: true },
  iPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
  iSeriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'series' },
  iTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'teams' },
  sTeamKey: { type: String, time: true },
  sSeriesKey: { type: String, time: true },
  sPlayerKey: { type: String, time: true },
  bIsOverseas: { type: Boolean },
  eProvider: { type: String, enum: eProvider.value } // sting of match ids
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

seriessquad.index({ sSeriesKey: 1, sTeamKey: 1, sPlayerKey: 1 })
seriessquad.index({ iPlayerId: 1 })
seriessquad.index({ iSeriesId: 1 })
seriessquad.index({ iTeamId: 1 })

module.exports = mongoose.model('seriessquad', seriessquad)

seriessquad.virtual('oPlayer', {
  ref: 'players',
  localField: 'iPlayerId',
  foreignField: '_id',
  justOne: true
})

seriessquad.virtual('oTeam', {
  ref: 'teams',
  localField: 'iTeamId',
  foreignField: '_id',
  justOne: true
})
