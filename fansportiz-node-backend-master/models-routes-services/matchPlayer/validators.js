const { body, query, param } = require('express-validator')
const { role } = require('../../data')
const { PAGINATION_LIMIT } = require('../../config/common')

const adminAddMatchPlayers = [
  body('iMatchId').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('iTeamId').not().isEmpty(),
  body('nScoredPoints').not().isEmpty().isNumeric(),
  body('bShow').not().isEmpty().isBoolean(),
  body('sportsType').not().isEmpty()
]
const adminAddMatchPlayersV2 = [
  body('iMatchId').not().isEmpty(),
  body('iTeamId').not().isEmpty(),
  body('nScoredPoints').not().isEmpty().isNumeric(),
  body('bShow').not().isEmpty().isBoolean(),
  body('sportsType').not().isEmpty()
]

const adminMatchPlayerSignedUrl = [
  body('sFileName').not().isEmpty(),
  body('sContentType').not().isEmpty()
]

const adminScorePointUpdate = [
  body('aPointBreakup').isArray().not().isEmpty(),
  body('aPointBreakup.*._id').not().isEmpty(),
  body('aPointBreakup.*.nScoredPoints').not().isEmpty().isNumeric()
]

const adminMatchPlayerUpdate = [
  body('iMatchId').not().isEmpty(),
  body('eRole').not().isEmpty().toUpperCase().isIn(role),
  body('sportsType').not().isEmpty()
]

const adminMatchPlayerRemove = [
  query('iMatchId').not().isEmpty().isMongoId()
]

const adminMatchPlayerReset = [
  param('id').isMongoId()
]

const list = [
  query('limit').optional().isInt({ max: PAGINATION_LIMIT })
]

const calculateSeasonPoint = [
  body('id').optional().not().isEmpty().isMongoId()
]

const fetchLastMatchPlayer = [
  param('id').isMongoId().not().isEmpty()
]

const updateCombinationBotPlayers = [
  body('players').isArray(),
  body('players.*.iPlayerId').not().isEmpty(),
  body('players.*.selected').optional().isBoolean(),
  body('players.*.isCaptain').optional().isBoolean()
]

module.exports = {
  adminAddMatchPlayers,
  adminMatchPlayerSignedUrl,
  adminScorePointUpdate,
  adminMatchPlayerUpdate,
  adminAddMatchPlayersV2,
  adminMatchPlayerRemove,
  adminMatchPlayerReset,
  list,
  calculateSeasonPoint,
  fetchLastMatchPlayer,
  updateCombinationBotPlayers
}
