const { body } = require('express-validator')

const finishTest = [
  body('student_test_id').not().isEmpty().not().isString().isNumeric(),
  body('is_timeout').not().isEmpty()
]
const testCompletedDetails = [
  body('testId').not().isEmpty().not().isString().isNumeric(),
  body('completedTestId').not().isEmpty()
]
const TestSubCategory = [
  body('id').notEmpty()
]

module.exports = {
  finishTest,
  TestSubCategory,
  testCompletedDetails
}
