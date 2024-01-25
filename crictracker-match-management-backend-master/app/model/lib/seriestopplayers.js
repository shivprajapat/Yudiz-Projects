const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { eProvider, eTopPlayerType, eTopPlayersType } = require('../enums')
const SeriesModel = require('./series')
const SeriesStatsModel = require('./series.stats')
const PlayerModel = require('./players')
const TeamModel = require('./teams')
const SeriesStatsTypesModel = require('./series.stats.types')

const SeriesTopPlayers = new mongoose.Schema({
  iSeriesId: { type: ObjectId, ref: SeriesModel },
  iSeriesStatsId: { type: ObjectId, ref: SeriesStatsModel },
  iSeriesStatsTypeId: { type: ObjectId, ref: SeriesStatsTypesModel },
  iPlayerId: { type: ObjectId, ref: PlayerModel },
  iTeamId: { type: ObjectId, ref: TeamModel },
  eFullType: { type: String, enum: eTopPlayersType.value },
  sBestInning: { type: String },
  nWickets: { type: Number },
  nRuns: { type: Number },
  nHighest: { type: Number },

  eType: { type: String, enum: eTopPlayerType.value },
  eProvider: {
    type: String,
    enum: eProvider.value
  }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }).index({ iSeriesId: 1 })

SeriesTopPlayers.virtual('oTeam', {
  ref: TeamModel,
  localField: 'iTeamId',
  foreignField: '_id',
  justOne: true
})

SeriesTopPlayers.virtual('oPlayer', {
  ref: PlayerModel,
  localField: 'iPlayerId',
  foreignField: '_id',
  justOne: true
})

SeriesTopPlayers.virtual('oSeries', {
  ref: SeriesModel,
  localField: 'iSeriesId',
  foreignField: '_id',
  justOne: true
})

SeriesTopPlayers.virtual('oSeriesStatsTypes', {
  ref: SeriesStatsTypesModel,
  localField: 'iSeriesStatsTypeId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('seriestopplayers', SeriesTopPlayers)
