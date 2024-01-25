const { body } = require('express-validator')

const create = [
  // body('title').not().isEmpty().matches(`/^[A-Za-z0-9 .,'!&]+$/`),
  body('title').matches(/^[aA-zZ0-9\s]+$/),
  body('address_1').not().isEmpty(),
  body('address_2').not().isEmpty(),
  body('pin_code').matches(/^[0-9\s]+$/),
  body('county_id').not().isEmpty().not().isString(),
  body('state_id').not().isEmpty().not().isString(),
  body('city_id').not().isEmpty().not().isString()
]

const deleteSchool = [
  body('id').not().isEmpty()
]

const getAllSchool = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleSchool = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  deleteSchool,
  getAllSchool,
  singleSchool
}
