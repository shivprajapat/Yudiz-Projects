const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types
const { eProvider } = require('../../enums')
const { MatchManagementDBConnect } = require('../../../db_services/mongoose')

const series = new mongoose.Schema({
  sSeriesKey: { type: String, time: true, unique: true },
  sTitle: { type: String, time: true },
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
  nPriority: {
    type: Number,
    default: 0
  },
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
  eProvider: { type: String, enum: eProvider.value },
  bIsLeague: { type: Boolean, default: false },
  eCategoryStatus: { type: String },
  iCategoryId: { type: ObjectId }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

module.exports = MatchManagementDBConnect.model('series', series)
