const { body } = require('express-validator')

const singleState = [
  body('id').not().isEmpty().not().isString()
]
const createState = [
  body('countyId').not().isEmpty(),
  body('title').matches(/^[aA-zZ0-9\s]+$/),
  body('abbreviation').not().isEmpty()
]
const getAllState = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const updateState = [
  body('countyId').not().isEmpty(),
  body('title').not().isEmpty(),
  body('abbreviation').not().isEmpty(),
  body('id').not().isEmpty().isNumeric()
]

const deleteState = [
  body('id').not().isEmpty().isArray()
]

module.exports = {
  createState,
  updateState,
  deleteState,
  singleState,
  getAllState
}
