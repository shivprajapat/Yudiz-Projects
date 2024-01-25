const { body } = require('express-validator')

const create = [
  body('testAbb1').notEmpty(),
  body('testAbb2').notEmpty(),
  body('testAbb3').notEmpty()
]

const update = [
  body('id').not().isEmpty(),
  body('testAbb1').notEmpty(),
  body('testAbb2').notEmpty(),
  body('testAbb3').notEmpty()
]

const deleteMatrix = [
  body('id').not().isEmpty()
]

const getAllMatrix = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleMatrix = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  update,
  deleteMatrix,
  getAllMatrix,
  singleMatrix
}
