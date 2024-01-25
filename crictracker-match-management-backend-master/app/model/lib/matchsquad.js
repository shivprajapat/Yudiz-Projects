const mongoose = require('mongoose')
const { eProvider } = require('../enums')

const matchsquad = new mongoose.Schema({
  iMatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'matches' }, // ref to matches
  iPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'players' }, // ref to players
  iTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'teams' },
  sTeamKey: { type: String, trim: true },
  sPlayerKey: { type: String, trim: true },
  sMatchKey: { type: String, trim: true },
  iRoleId: { type: mongoose.Schema.Types.ObjectId, ref: 'enums' }, // bat-Batsman, bowl-Bowler, all-All Rounder, WK-Wicketkeeper, cap-Captain of playing XI,wkcap-wicketkeeper and captain,squad-Player is not selected in Playing XI and benched
  sRoleStr: { type: String, trim: true }, // (C) - cap , (WK) - WK
  bPlaying11: { type: Boolean }, // is player in playing 11
  bSubstitute: { type: Boolean },
  sName: { type: String, trim: true },
  eProvider: { type: String, enum: eProvider.value },
  bIsOverseas: { type: Boolean },
  bOut: { type: Boolean },
  bIn: { type: Boolean },
  nPriority: { type: Number },
  sSplRoleStr: { type: String }
}, {
  timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

matchsquad.index({ iMatchId: 1 })
matchsquad.index({ sTeamKey: 1 })
matchsquad.index({ sMatchKey: 1 })
matchsquad.index({ sPlayerKey: 1 })
matchsquad.index({ sMatchKey: 1, sTeamKey: 1, sPlayerKey: 1 }, { unique: true })
matchsquad.index({ iPlayerId: -1 })

matchsquad.virtual('oMatch', {
  ref: 'matches',
  localField: 'iMatchId',
  foreignField: '_id',
  justOne: true
})

matchsquad.virtual('oTeam', {
  ref: 'teams',
  localField: 'iTeamId',
  foreignField: '_id',
  justOne: true
})

matchsquad.virtual('oPlayer', {
  ref: 'players',
  localField: 'iPlayerId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('matchsquad', matchsquad)
