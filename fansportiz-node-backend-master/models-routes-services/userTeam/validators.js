const { body, query, param } = require('express-validator')
const { PAGINATION_LIMIT } = require('../../config/common')

const addUserTeam = [
  body('iMatchId').not().isEmpty(),
  body('iCaptainId').not().isEmpty(),
  body('iViceCaptainId').not().isEmpty(),
  body('aPlayers').isArray().not().isEmpty(),
  body('aPlayers.*.iMatchPlayerId').not().isEmpty()
]

const addUserTeamV2 = [
  body('iMatchId').not().isEmpty(),
  body('iCaptainId').not().isEmpty(),
  body('iViceCaptainId').not().isEmpty(),
  body('aPlayers').isArray().not().isEmpty()
]

const updateUserTeam = [
  body('iMatchId').not().isEmpty(),
  body('iCaptainId').not().isEmpty(),
  body('iViceCaptainId').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('aPlayers').isArray().not().isEmpty(),
  body('aPlayers.*.iMatchPlayerId').not().isEmpty()
]

const updateUserTeamV2 = [
  body('iMatchId').not().isEmpty(),
  body('iCaptainId').not().isEmpty(),
  body('iViceCaptainId').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('aPlayers').isArray().not().isEmpty()
]

const matchWiseUserTeamList = [
  body('iMatchId').not().isEmpty(),
  body('iUserId').not().isEmpty()
]

const updateUserTeamV3 = [
  body('iMatchId').not().isEmpty(),
  body('iCaptainId').not().isEmpty(),
  body('iViceCaptainId').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('aPlayers').isArray().not().isEmpty()
]

const addUserTeamV3 = [
  body('iMatchId').not().isEmpty(),
  body('iCaptainId').not().isEmpty(),
  body('iViceCaptainId').not().isEmpty(),
  body('aPlayers').isArray().not().isEmpty()
]

const list = [
  query('limit').optional().isInt({ max: PAGINATION_LIMIT })
]

const baseTeamList = [
  param('id').not().isEmpty().isMongoId()
]

module.exports = {
  addUserTeam,
  addUserTeamV2,
  updateUserTeam,
  updateUserTeamV2,
  matchWiseUserTeamList,
  updateUserTeamV3,
  addUserTeamV3,
  list,
  baseTeamList
}
