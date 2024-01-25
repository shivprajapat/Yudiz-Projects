const { query } = require('express-validator')
const { PAGINATION_LIMIT } = require('../../config/common')

const limitVaidator = [
  query('nLimit').optional().isInt({ max: PAGINATION_LIMIT })
]

module.exports = { limitVaidator }
