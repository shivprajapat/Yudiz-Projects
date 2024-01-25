const { body } = require('express-validator')

const create = [
  body('question').notEmpty()
]

const update = [
  body('id').not().isEmpty()
]

const deleteQuestion = [
  body('id').not().isEmpty()
]

const getAllQuestion = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleQuestion = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  update,
  deleteQuestion,
  getAllQuestion,
  singleQuestion
}
