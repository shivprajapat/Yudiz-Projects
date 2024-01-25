const { body } = require('express-validator')

const singleCity = [
  body('id').not().isEmpty().not().isString()
]
const createCity = [
  body('countyId').not().isEmpty(),
  body('stateId').not().isEmpty(),
  body('title').matches(/^[aA-zZ0-9\s]+$/)
]
const getAllCity = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const updateCity = [
  body('title').not().isEmpty(),
  body('countyId').not().isEmpty().isNumeric(),
  body('stateId').not().isEmpty().isNumeric(),
  body('id').not().isEmpty().isNumeric()
]

const deleteCity = [
  body('id').not().isEmpty().isArray()
]

module.exports = {
  createCity,
  updateCity,
  deleteCity,
  singleCity,
  getAllCity
}
