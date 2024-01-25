const { body } = require('express-validator')

const changePassword = [
  body('password').not().isEmpty(),
  body('currentPassword').not().isEmpty(),
  body('confirmPassword').not().isEmpty()
]

const createCounsellorSupport = [
  body('issue_category_id').not().isEmpty().isNumeric(),
  body('query_desc').not().isEmpty().isString()
]

module.exports = {
  changePassword,
  createCounsellorSupport
}
