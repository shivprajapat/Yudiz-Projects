const { body } = require('express-validator')

const create = [
  body('title').matches(/^[aA-zZ0-9\s]+$/)
]

const deleteUniversity = [
  body('id').not().isEmpty()
]

const getAllUniversity = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleUniversity = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  deleteUniversity,
  getAllUniversity,
  singleUniversity
}
