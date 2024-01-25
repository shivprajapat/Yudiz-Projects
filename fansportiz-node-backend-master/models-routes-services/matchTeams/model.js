const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { FantasyTeamConnect } = require('../../database/mongoose')
const data = require('../../data')
const TeamModel = require('../team/model')
const MatchModel = require('../match/model')
const MatchPlayerModel = require('../matchPlayer/model')

const MatchTeams = new Schema({
  iMatchId: { type: Schema.Types.ObjectId, ref: MatchModel },
  aPlayers: [{
    iMatchPlayerId: { type: Schema.Types.ObjectId, ref: MatchPlayerModel },
    iTeamId: { type: Schema.Types.ObjectId, ref: TeamModel },
    nScoredPoints: { type: Number, default: 0 }
  }],
  nTotalPoint: { type: Number },
  nTotalCredit: { type: Number },
  sHash: { type: String, trim: true },
  eCategory: { type: String, enum: data.category, default: 'CRICKET' },
  eStatus: { type: String, enum: data.status, default: 'Y' }, // Y = Active, N = Inactive
  eType: { type: String, enum: data.userType, default: 'U' }, // U = USER B = BOT
  sExternalId: { type: String },
  bAdminRecomended: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

MatchTeams.index({ iMatchId: 1, sHash: 1 })
MatchTeams.index({ sHash: 1 })

MatchTeams.virtual('aPlayers.oMatchPlayer', {
  ref: MatchPlayerModel,
  localField: 'aPlayers.iMatchPlayerId',
  foreignField: '_id',
  justOne: true
})

MatchTeams.virtual('aPlayers.oTeams', {
  ref: TeamModel,
  localField: 'aPlayers.iTeamId',
  foreignField: '_id',
  justOne: true
})

const MatchTeamsModel = FantasyTeamConnect.model('matchteams', MatchTeams)

MatchTeamsModel.syncIndexes().then(() => {
  console.log('Match Teams Model Indexes Synced')
}).catch((err) => {
  console.log('Match Teams Model Indexes Sync Error', err)
})

module.exports = MatchTeamsModel
