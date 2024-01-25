const { body } = require('express-validator')

const create = [
  body('title').not().isEmpty(),
  body('sort_order').not().isEmpty().isNumeric(),
  body('code').not().isEmpty().isString()
]

const deleteNorms = [
  body('id').not().isEmpty()
]

const getAllNorms = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleNorm = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  deleteNorms,
  getAllNorms,
  singleNorm
}
