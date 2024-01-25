const { body } = require('express-validator')

const singlePackage = [
  body('id').not().isEmpty().not().isString()
]

const getAllPackage = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const couponCode = [
  body('coupon_code').not().isEmpty(),
  body('packageId').not().isEmpty().not().isString().isNumeric()
]

const purchaseSuccess = [
  body('razorpay_payment_id').not().isEmpty(),
  body('razorpay_order_id').not().isEmpty(),
  body('razorpay_signature').not().isEmpty()
]

module.exports = {
  singlePackage,
  getAllPackage,
  purchaseSuccess,
  couponCode
}
