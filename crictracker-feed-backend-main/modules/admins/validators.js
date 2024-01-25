const { body, validationResult } = require('express-validator')
const { messages } = require('../../global/index')

const adminRegister = [
  body('sUsername').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('sEmail').isEmail(),
  body('sPassword').not().isEmpty(),
  body('eType').not().isEmpty(),
  body('sSecret').not().isEmpty(), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(messages.status.statusUnprocessableEntity).jsonp({ status: messages.status.statusUnprocessableEntity, errors: errors.array() })
    return next()
  }
]

module.exports = {
  adminRegister
}
