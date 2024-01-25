const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const { eProvider, eSeriesCategoryStatusEnum } = require('../enums')

const series = new mongoose.Schema({
  sSeriesKey: { type: String, time: true },
  sTitle: { type: String, time: true },
  sSrtTitle: { type: String },
  sAbbr: { type: String, time: true },
  sSeason: { type: String, time: true },
  dStartDate: { type: Date },
  dEndDate: { type: Date },
  nTotalMatches: { type: Number },
  nTotalRounds: { type: Number },
  nTotalTeams: { type: Number },
  sSeriesType: { type: String, time: true },
  sCategory: { type: String, time: true },
  sGameFormat: { type: String, time: true },
  sStatus: { type: String, time: true },
  sCountry: { type: String, time: true },
  sSquadType: { type: String, time: true },
  nTable: { type: Number },
  aRound: [{
    sRoundKey: { type: String, time: true },
    nOrder: { type: Number },
    sName: { type: String, time: true },
    sRoundType: { type: String, time: true },
    sMatchFormat: { type: String, time: true },
    dStartDate: { type: Date },
    dEndDate: { type: Date },
    sMatchesUrl: { type: String, time: true },
    sTeamsUrl: { type: String, time: true }
  }],
  nPriority: {
    type: Number,
    default: 0
  },
  isBlockedMini: { type: Boolean, default: false },
  eProvider: { type: String, enum: eProvider.value },
  bIsLeague: { type: Boolean, default: false },
  eCategoryStatus: { type: String, enum: eSeriesCategoryStatusEnum.value, default: eSeriesCategoryStatusEnum.default },
  iCategoryId: { type: ObjectId },
  aFormats: [{ type: String }]
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

series.index({ sSeriesKey: 1 }, { unique: true })
series.index({ sTitle: 1, eStatus: 1 })
series.index({ sTitle: 'text', sAbbr: 'text' })
series.index({ sGameFormat: 1 })
series.index({ sCategory: 1, dStartDate: 1 })
series.index({ sCategory: 1, bIsLeague: 1 })

module.exports = mongoose.model('series', series)
