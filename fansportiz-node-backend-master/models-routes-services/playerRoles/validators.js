const { query, body, param } = require('express-validator')

const getPlayerRole = [
  query('sportsType').not().isEmpty()
]

const updatePlayerRole = [
  body('nMax').not().isEmpty().isInt(),
  body('nMin').not().isEmpty().isInt()
]
const updatePlayerRoleV2 = [
  body('sFullName').not().isEmpty(),
  body('nMax').not().isEmpty().isInt(),
  body('nMin').not().isEmpty().isInt()
]

const getMatchPlayerRole = [
  param('iMatchId').isMongoId()
]

module.exports = {
  getPlayerRole,
  updatePlayerRole,
  updatePlayerRoleV2,
  getMatchPlayerRole
}
