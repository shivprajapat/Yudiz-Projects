const { body } = require('express-validator')

const singleNormGrade = [
  body('id').not().isEmpty().not().isString()
]
const createNormGrade = [
  body('grade_id').isNumeric(),
  body('test_id').isNumeric(),
  body('test_detail_id').isNumeric(),
  body('norm_id').isNumeric(),
  body('min_marks').isNumeric(),
  body('max_marks').isNumeric()
]
const getAllNormGrade = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

const updateNormGrade = [
  body('id').isNumeric(),
  body('grade_id').isNumeric(),
  body('test_id').isNumeric(),
  body('test_detail_id').isNumeric(),
  body('norm_id').isNumeric(),
  body('min_marks').isNumeric(),
  body('max_marks').isNumeric()
]

const deleteNormGrade = [
  body('id').not().isEmpty().isArray()
]

module.exports = {
  createNormGrade,
  updateNormGrade,
  deleteNormGrade,
  singleNormGrade,
  getAllNormGrade
}
