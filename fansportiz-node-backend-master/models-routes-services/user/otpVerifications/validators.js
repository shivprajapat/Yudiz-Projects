const { body } = require('express-validator')

const sendOTP = [
  body('sLogin').not().isEmpty(),
  body('sAuth').not().isEmpty(),
  body('sType').not().isEmpty()
]

const verifyOTP = [
  body('sLogin').not().isEmpty(),
  body('sAuth').not().isEmpty(),
  body('sType').not().isEmpty(),
  body('sCode').isNumeric()
]

const verifyOTPV2 = [
  body('sLogin').not().isEmpty(),
  body('sAuth').not().isEmpty(),
  body('sType').not().isEmpty(),
  body('sCode').isNumeric()
]

module.exports = {
  sendOTP,
  verifyOTP,
  verifyOTPV2
}
