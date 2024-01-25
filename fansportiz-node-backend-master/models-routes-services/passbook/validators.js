const { query } = require('express-validator')
const { PAGINATION_LIMIT } = require('../../config/common')

const listValidator = [
  query('nLimit').optional().isInt({ max: PAGINATION_LIMIT })
]

const limitValidator = [
  query('limit').optional().isInt({ max: PAGINATION_LIMIT })
]

module.exports = {
  listValidator,
  limitValidator
}
