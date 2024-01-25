const { body, query, param } = require('express-validator')
const { maritalStatus, foodType } = require('../../../data')

const add = [
  body('customerId').isMongoId(),
  body('maritalStatus').trim().notEmpty().isIn(maritalStatus).optional(),
  body('foodInfo.type').notEmpty().trim().isIn(foodType).optional(),
  body('sleepInfo.bedTime').isISO8601().optional(),
  body('sleepInfo.wakeUpTime').isISO8601().optional(),
  body('smokeInfo.isSmoking').isBoolean().optional(),
  body('workInfo.workingTime.startTime').isISO8601().optional(),
  body('workInfo.workingTime.endTime').isISO8601().optional()
]

const get = [
  query('customerId').isMongoId(),
  query('id').isMongoId().optional()
]

const update = [
  param('id').isMongoId(),
  body('customerId').isMongoId().optional(),
  body('maritalStatus').trim().notEmpty().isIn(maritalStatus).optional(),
  body('foodInfo.type').notEmpty().trim().isIn(foodType).optional(),
  body('sleepInfo.bedTime').isISO8601().optional(),
  body('sleepInfo.wakeUpTime').isISO8601().optional(),
  body('smokeInfo.isSmoking').isBoolean().optional(),
  body('workInfo.workingTime.startTime').isISO8601().optional(),
  body('workInfo.workingTime.endTime').isISO8601().optional()
]

module.exports = {
  add,
  get,
  update
}
