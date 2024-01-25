const { body } = require('express-validator')

const createTestTimeNormsValidator = [
  body('testDetailId').isInt(),
  body('gradeId').isInt(),
  body('timeSec').notEmpty().isInt()
]
const getTestTimeNormsByIdValidator = [
  body('id').notEmpty().isInt()
]
const deleteTestTimeNormsByIdValidator = [
  body('id').notEmpty().isInt()
]

module.exports = {
  createTestTimeNormsValidator,
  getTestTimeNormsByIdValidator,
  deleteTestTimeNormsByIdValidator
}
