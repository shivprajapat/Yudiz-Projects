const { body } = require('express-validator')

const create = [
  body('title').not().isEmpty()
]

const deleteQualification = [
  body('id').not().isEmpty()
]

const getAllQualification = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleQualification = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  deleteQualification,
  getAllQualification,
  singleQualification
}
