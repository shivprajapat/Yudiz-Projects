const { body } = require('express-validator')

const revenue = [
  body('duration').isIn(['current_month', 'last_month', 'last_three_months', 'last_year'])
]

module.exports = {
  revenue
}
