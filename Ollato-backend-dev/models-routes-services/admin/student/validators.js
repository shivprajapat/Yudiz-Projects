const { body } = require('express-validator')

const singleStudent = [
  body('id').not().isEmpty().not().isString()
]
const createStudent = [
  body('first_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('last_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  // body('email').not().isEmpty().isString(),
  body('mobile').not().isEmpty().isString(),
  body('country_id').not().isEmpty().isNumeric(),
  body('state_id').not().isEmpty().isNumeric(),
  body('city_id').not().isEmpty().isNumeric(),
  body('grade_id').not().isEmpty().isNumeric(),
  body('board_id').not().isEmpty().isNumeric()
]
const getAllStudent = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const updateStudent = [
  body('first_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('last_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  // body('email').not().isEmpty().isString(),
  body('mobile').not().isEmpty().isString(),
  body('country_id').not().isEmpty().isNumeric(),
  body('state_id').not().isEmpty().isNumeric(),
  body('city_id').not().isEmpty().isNumeric(),
  body('grade_id').not().isEmpty().isNumeric(),
  body('board_id').not().isEmpty().isNumeric(),
  body('id').not().isEmpty().isNumeric()
]

const deleteStudent = [
  body('id').not().isEmpty().isArray()
]

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  singleStudent,
  getAllStudent
}
