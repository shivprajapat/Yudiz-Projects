const { body, query } = require('express-validator')

const add = [
  body('iWorkoutPlanId').isMongoId(),
  body('aPlanDetails.*.dWorkoutDate').isDate().trim().notEmpty(),
  body('aPlanDetails.*.sDescription').trim().notEmpty(),
  body('aPlanDetails.*.iExerciseId').isMongoId()
]

const get = [
  query('iWorkoutPlanId').isMongoId(),
  query('dFromDate').isDate(),
  query('dToDate').isDate()
]

const update = [
  body('iWorkoutPlanId').isMongoId(),
  body('aPlanDetails.*.id').isMongoId(),
  body('aPlanDetails.*.dWorkoutDate').isDate().trim().notEmpty(),
  body('aPlanDetails.*.sDescription').trim().notEmpty(),
  body('aPlanDetails.*.iExerciseId').isMongoId()
]

module.exports = { add, update, get }
