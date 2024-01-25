const { body } = require('express-validator')

const singlePackage = [
  body('id').not().isEmpty().not().isString()
]
const createPackage = [
  body('amount').not().isEmpty(),
  body('description').not().isEmpty(),
  body('package_number').not().isEmpty(),
  body('package_type').not().isEmpty(),
  body('test_report').not().isEmpty(),
  body('online_test').not().isEmpty(),
  body('video_call').not().isEmpty(),
  body('f2f_call').not().isEmpty(),
  body('title').not().isEmpty()
]
const getAllPackage = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const updatePackage = [
  body('amount').not().isEmpty(),
  body('description').not().isEmpty(),
  body('title').not().isEmpty(),
  body('package_number').not().isEmpty(),
  body('package_type').not().isEmpty(),
  body('test_report').not().isEmpty(),
  body('online_test').not().isEmpty(),
  body('video_call').not().isEmpty(),
  body('f2f_call').not().isEmpty(),
  body('id').not().isEmpty().isNumeric()
]

const deletePackage = [
  body('id').not().isEmpty().isArray()
]

module.exports = {
  createPackage,
  updatePackage,
  deletePackage,
  singlePackage,
  getAllPackage
}
