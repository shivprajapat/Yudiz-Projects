const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const enums = require('../enums')

const fantasyPlayers = new mongoose.Schema(
  {
    iMatchId: { type: ObjectId, ref: 'matches' },
    iPlayerId: { type: ObjectId, ref: 'players' },
    iTeamId: { type: ObjectId, ref: 'teams' },
    iArticleId: { type: ObjectId, ref: 'fantasyarticles' },
    ePlatformType: { type: String, enum: enums.ePlatformType.value },
    nRating: { type: Number, default: 8 },
    eRole: { type: String, enum: enums.ePlayingRole.value }
  },
  { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } }
)

fantasyPlayers.index({ iMatchId: 1 })
fantasyPlayers.index({ iTeamId: 1 })
fantasyPlayers.index({ iMatchId: 1, ePlatformType: 1 })

module.exports = mongoose.model('fantasyPlayers', fantasyPlayers)

fantasyPlayers.virtual('oMatch', {
  ref: 'matches',
  localField: 'iMatchId',
  foreignField: '_id',
  justOne: true
})

fantasyPlayers.virtual('oPlayer', {
  ref: 'players',
  localField: 'iPlayerId',
  foreignField: '_id',
  justOne: true
})

fantasyPlayers.virtual('oTeam', {
  ref: 'teams',
  localField: 'iTeamId',
  foreignField: '_id',
  justOne: true
})
