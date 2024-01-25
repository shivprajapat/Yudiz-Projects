const { body } = require('express-validator')

const updateAdmin = [
  body('first_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('last_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('email').not().isEmpty(),
  body('mobile').not().isEmpty()
]

module.exports = {
  updateAdmin
}
