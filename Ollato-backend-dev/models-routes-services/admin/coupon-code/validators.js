const { body } = require('express-validator')

const singleCouponCode = [
  body('id').not().isEmpty().not().isString()
]
const createCouponCode = [
  body('title').not().isEmpty(),
  body('from_date').not().isEmpty(),
  body('to_date').not().isEmpty(),
  body('number_time_use').not().isEmpty()
]
const getAllCouponCode = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const updateCouponCode = [
  body('title').not().isEmpty(),
  body('from_date').not().isEmpty(),
  body('to_date').not().isEmpty(),
  body('number_time_use').not().isEmpty(),
  body('id').not().isEmpty().isNumeric()
]

const deleteCouponCode = [
  body('id').not().isEmpty().isArray()
]

module.exports = {
  createCouponCode,
  updateCouponCode,
  deleteCouponCode,
  singleCouponCode,
  getAllCouponCode
}
