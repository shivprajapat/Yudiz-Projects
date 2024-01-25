const { body } = require('express-validator')

const singleTestNormDesc = [
  body('id').not().isEmpty().not().isString()
]
const createTestNormDesc = [
  body('test_id').isNumeric(),
  body('test_detail_id').isNumeric(),
  body('norm_id').isNumeric(),
  body('norm').isString(),
  body('description').isString(),
  body('plan_of_action').isString()
]
const getAllTestNormDesc = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const updateTestNormDesc = [
  body('id').isNumeric(),
  body('test_id').isNumeric(),
  body('test_detail_id').isNumeric(),
  body('norm_id').isNumeric(),
  body('norm').isString(),
  body('description').isString(),
  body('plan_of_action').isString()
]

const deleteTestNormDesc = [
  body('id').not().isEmpty().isArray()
]

module.exports = {
  createTestNormDesc,
  updateTestNormDesc,
  deleteTestNormDesc,
  singleTestNormDesc,
  getAllTestNormDesc
}
