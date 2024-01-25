const { body } = require('express-validator')

const duration = [
  body('startDate').not().isEmpty(),
  body('endDate').not().isEmpty()
]

module.exports = {
  duration
}
