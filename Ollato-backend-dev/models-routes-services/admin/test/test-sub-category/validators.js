const { body } = require('express-validator')

const create = [
  body('title').not().isEmpty(),
  body('sort_order').not().isEmpty()
]

const deleteTestCategory = [
  body('id').not().isEmpty()
]

const getAllTestCategory = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleTestCategory = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  deleteTestCategory,
  getAllTestCategory,
  singleTestCategory
}
