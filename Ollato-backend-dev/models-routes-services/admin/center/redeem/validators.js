const { body } = require('express-validator')

const redeemRequest = [
  body('amount').not().isEmpty()
]

const redeemRequestList = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const redeemRequestbyId = [
  body('id').not().isEmpty().isInt()
]

module.exports = {
  redeemRequest,
  redeemRequestList,
  redeemRequestbyId
}
