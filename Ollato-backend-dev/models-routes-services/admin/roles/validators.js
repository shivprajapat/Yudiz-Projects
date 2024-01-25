const { body } = require('express-validator')

const create = [
  // body('title').not().isEmpty().matches(`/^[A-Za-z0-9 .,'!&]+$/`),
  body('title').isString().notEmpty()
]

const deleteRole = [
  body('id').not().isEmpty()
]

const getAllRole = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleRole = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  deleteRole,
  getAllRole,
  singleRole
}
