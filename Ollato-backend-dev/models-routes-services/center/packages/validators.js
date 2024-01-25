const { body } = require('express-validator')

const purchasePackage = [
  body('packageId').not().isEmpty().not().isString(),
  body('total_packages').not().isEmpty().not().isString()
]

const purchaseSuccess = [
  body('razorpay_payment_id').not().isEmpty(),
  body('razorpay_order_id').not().isEmpty(),
  body('razorpay_signature').not().isEmpty()
]

const couponCode = [
  body('coupon_code').not().isEmpty(),
  body('packageId').not().isEmpty().not().isString().isNumeric()
]

module.exports = {
  purchasePackage,
  purchaseSuccess,
  couponCode
}
