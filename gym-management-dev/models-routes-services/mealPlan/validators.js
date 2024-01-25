const { body, query, param } = require('express-validator')
const { planType } = require('../../data')

const add = [
  body('dStartDate').isDate().trim().notEmpty().optional(),
  body('dEndDate').isDate().trim().notEmpty().optional(),
  body('iCustomerId').isMongoId().optional(),
  body('sTitle').trim().notEmpty(),
  body('sDescription').trim().notEmpty(),
  body('eType').optional().isIn(planType)
]
const get = [
  param('id').isMongoId()
]
const list = [
  query('iCustomerId').isMongoId().optional(),
  query('eType').notEmpty().optional().isIn(planType)
]

const update = [
  param('id').isMongoId(),
  body('dStartDate').isDate().trim().notEmpty().optional(),
  body('dEndDate').isDate().trim().notEmpty().optional(),
  body('iCustomerId').isMongoId().optional(),
  body('sTitle').trim().notEmpty(),
  body('sDescription').trim().notEmpty(),
  body('eType').optional().isIn(planType)
]

const deletePlan = [
  param('id').isMongoId()
]

module.exports = { add, update, list, get, deletePlan }
