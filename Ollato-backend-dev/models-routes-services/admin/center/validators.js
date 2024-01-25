const { body } = require('express-validator')

const deleteCenter = [
  body('id').not().isEmpty()
]

const getAllCenter = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sorting').not().isEmpty(),
  body('order').not().isEmpty()
]

const register = [
  body('title').not().isEmpty(),
  body('mobile').not().isEmpty(),
  body('email').not().isEmpty()
]

const singleCenter = [
  body('id').not().isEmpty().not().isString()
]

const updateCenter = [
  body('id').not().isEmpty(),
  body('title').not().isEmpty(),
  body('mobile').not().isEmpty(),
  body('email').not().isEmpty()
]

module.exports = {
  register,
  deleteCenter,
  getAllCenter,
  singleCenter,
  updateCenter
}
