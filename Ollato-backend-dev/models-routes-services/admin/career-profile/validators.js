const { body } = require('express-validator')

const create = [
  // body('title').not().isEmpty(),
  // body('sort_order').not().isEmpty()
]

const update = [
  // body('title').not().isEmpty(),
  // body('sort_order').not().isEmpty()
]

const deleteCareer = [
  body('id').not().isEmpty()
]

const getAllCareerProfile = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const singleCareerProfile = [
  body('id').not().isEmpty().not().isString()
]

module.exports = {
  create,
  update,
  deleteCareer,
  getAllCareerProfile,
  singleCareerProfile
}
