const mongoose = require('mongoose')
const enums = require('../enums')
const { ObjectId } = mongoose.Schema.Types

const imageType = {
  sText: { type: String, trim: true },
  sCaption: { type: String, trim: true },
  sAttribute: { type: String, trim: true },
  sUrl: { type: String, trim: true }
}

const ranking = new mongoose.Schema(
  {
    nRank: {
      type: Number,
      required: true
    },
    sName: {
      type: String,
      required: true,
      trim: true
    },
    sTeam: {
      type: String
    },
    nRating: {
      type: Number,
      required: true
    },
    nPoints: {
      type: Number
    },
    eRankType: {
      type: String,
      enum: enums.eRankType.value
    },
    eMatchType: {
      type: String,
      enum: enums.eMatchType.value
    },
    sPlayerKey: { type: String, trim: true },
    oPlayer: {
      iPlayerId: { type: ObjectId, ref: 'players' },
      sAbout: { type: String, trim: true }, // from admin
      sShortName: { type: String, trim: true },
      sFullName: { type: String, trim: true }, // from admin panel || sTitle from ES
      sCountry: { type: String, trim: true },
      oImg: {
        type: imageType
      }
    },
    oJersey: { type: imageType },
    sTeamKey: { type: String, time: true },
    oTeams: {
      iTeamId: { type: ObjectId, ref: 'teams' },
      sTitle: { type: String, time: true },
      sAbbr: { type: String, time: true },
      sCountry: { type: String, time: true },
      oImg: {
        type: imageType
      }
    },
    eGender: {
      type: String,
      enum: enums.eGender.value
    }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
).index({ sTitle: 1 })

ranking.index({ nRank: 1 })

module.exports = mongoose.model('icc_rankings', ranking)
