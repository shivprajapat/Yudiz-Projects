const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { FantasyTeamConnect } = require('../../database/mongoose')
const { category, userType, status } = require('../../data')
const UserModel = require('../user/model')
const MatchModel = require('../match/model')
const MatchPlayerModel = require('../matchPlayer/model')
const BackupMatchTeamsModel = require('../matchTeams/backupMatchTeams.model')

const UserTeam = new Schema({
  iMatchId: { type: Schema.Types.ObjectId, ref: MatchModel },
  iUserId: { type: Schema.Types.ObjectId, ref: UserModel },
  sName: { type: String, trim: true, required: true },
  iCaptainId: { type: Schema.Types.ObjectId, ref: MatchPlayerModel, required: true },
  iViceCaptainId: { type: Schema.Types.ObjectId, ref: MatchPlayerModel, required: true },
  nTotalPoints: { type: Number },
  sHash: { type: String, trim: true },
  bPointCalculated: { type: Boolean, default: false },
  eCategory: { type: String, enum: category, default: 'CRICKET' },
  eType: { type: String, enum: userType, default: 'U' }, // U = USER B = BOT
  eStatus: { type: String, enum: status, default: 'Y' }, // Y = Active, N = Inactive
  sExternalId: { type: String }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

UserTeam.index({ iMatchId: 1, sHash: 1 })
UserTeam.index({ iMatchId: 1, iUserId: 1 })

UserTeam.virtual('oMatchTeamHash', {
  ref: BackupMatchTeamsModel,
  localField: 'sHash',
  foreignField: 'sHash',
  justOne: true
})

module.exports = FantasyTeamConnect.model('backupuserteams', UserTeam)
