const { body } = require('express-validator')

const getAllCity = [
  body('state_id').not().isEmpty().not().isString()
]

module.exports = {
  getAllCity
}
