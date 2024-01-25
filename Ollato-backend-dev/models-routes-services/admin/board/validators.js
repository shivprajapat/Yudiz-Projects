const { body } = require('express-validator')

const create = [
  // body('title').matches(/^[aA-zZ0-9\s]+$/)
  body('title').isString().notEmpty()

]

const deleteBoard = [
  body('id').not().isEmpty()
]

const getAllBoard = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleBoard = [
  body('id').not().isEmpty().not().isString()
]
const updateBoard = [
  body('id').not().isEmpty().not().isString(),
  body('title').not().isEmpty()
]

module.exports = {
  create,
  deleteBoard,
  getAllBoard,
  singleBoard,
  updateBoard
}
