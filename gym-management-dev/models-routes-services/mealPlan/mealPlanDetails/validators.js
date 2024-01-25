const { body, query } = require('express-validator')

const add = [
  body('aPlanDetails.*.dMealPlanDate').isDate().trim().notEmpty(),
  body('aPlanDetails.*.sDescription').trim().notEmpty(),
  body('iMealPlanId').trim().notEmpty().isMongoId()
]

const get = [
  query('iMealPlanId').isMongoId(),
  query('dFromDate').isDate(),
  query('dToDate').isDate()
]

const update = [
  body('aPlanDetails.*.dMealPlanDate').isDate().trim().notEmpty(),
  body('aPlanDetails.*.id').isMongoId(),
  body('iMealPlanId').trim().notEmpty().isMongoId(),
  body('aPlanDetails.*.sDescription').trim().notEmpty(),
  body('aPlanDetails.*.id').isMongoId()
]

module.exports = { add, update, get }
