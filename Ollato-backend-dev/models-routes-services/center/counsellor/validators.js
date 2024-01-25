const { body } = require('express-validator')

const deleteCounsellor = [
  body('id').not().isEmpty()
]

const getAllCounsellor = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sorting').not().isEmpty(),
  body('order').not().isEmpty()
]

const register = [
  body('first_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('last_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('mobile').not().isEmpty(),
  body('country_id').not().isEmpty(),
  body('city_id').not().isEmpty(),
  body('state_id').not().isEmpty()
]

const singleCounsellor = [
  body('id').not().isEmpty().not().isString()
]

const updateCounsellor = [
  body('counsellor_id').not().isEmpty(),
  body('first_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('last_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('mobile').not().isEmpty(),
  body('country_id').not().isEmpty(),
  body('city_id').not().isEmpty(),
  body('state_id').not().isEmpty()
]

module.exports = {
  register,
  deleteCounsellor,
  getAllCounsellor,
  singleCounsellor,
  updateCounsellor
}
