const { body, query } = require('express-validator')
const { PAGINATION_LIMIT } = require('../../config/common')

const adminAddMatchLeague = [
  body('iMatchId').not().isEmpty(),
  body('iLeagueId').isArray().not().isEmpty()
]

const adminAddMatchLeagueV2 = [
  body('iMatchId').not().isEmpty(),
  body('aLeagueId').isArray().not().isEmpty()
]

const adminBotCreate = [
  body('bBotCreate').not().isEmpty().isBoolean()
]

const list = [
  query('limit').optional().isInt({ max: PAGINATION_LIMIT })
]

module.exports = {
  adminAddMatchLeague,
  adminAddMatchLeagueV2,
  adminBotCreate,
  list
}
