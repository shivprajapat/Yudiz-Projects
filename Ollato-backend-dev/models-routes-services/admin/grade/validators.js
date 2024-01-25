const { body } = require('express-validator')

const createGrade = [
  body('title').matches(/^[aA-zZ0-9\s]+$/)
]

const deleteGrade = [
  body('id').not().isEmpty()
]

const getAllGrade = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleGrade = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  createGrade,
  deleteGrade,
  getAllGrade,
  singleGrade
}
