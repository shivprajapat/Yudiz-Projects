const { query } = require('express-validator')
const { PAGINATION_LIMIT } = require('../../config/common')

const myMatchesValidator = [
  query('sportsType').not().isEmpty(),
  query('type').not().isEmpty().toUpperCase().isIn(['U', 'L', 'CMP']),
  query('limit').optional().isInt({ max: PAGINATION_LIMIT })
]

const limitValidator = [
  query('limit').optional().isInt({ max: PAGINATION_LIMIT })
]

module.exports = {
  myMatchesValidator,
  limitValidator
}
