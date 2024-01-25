const { body, query } = require('express-validator')
const { PAGINATION_LIMIT } = require('../../config/common')

const list = [
  query('limit').optional().isInt({ max: PAGINATION_LIMIT })
]
const adminAddLeagueCategory = [
  body('sTitle').not().isEmpty(),
  body('nPosition').not().isEmpty().isNumeric()
]

const adminAddFilterCategory = [
  body('sTitle').not().isEmpty()
]

const getSignedUrl = [
  body('sFileName').not().isEmpty(),
  body('sContentType').not().isEmpty()
]

module.exports = {
  list,
  adminAddLeagueCategory,
  adminAddFilterCategory,
  getSignedUrl
}
