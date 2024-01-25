// @ts-check
const { body } = require('express-validator')
const { otpType, otpAuth } = require('../../enums')

const send = [
  body('sLogin').trim().notEmpty(),
  body('sType').isIn(otpType?.value),
  body('sAuth').isIn(otpAuth?.value)
]

const verify = [
  body('sLogin').trim().notEmpty(),
  body('sType').isIn(otpType?.value),
  body('sAuth').isIn(otpAuth?.value),
  body('sCode').trim().notEmpty()
]

module.exports = { send, verify }
