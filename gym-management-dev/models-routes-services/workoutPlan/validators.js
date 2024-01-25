const { body, param, query } = require('express-validator')

const add = [
  body('dStartDate').isDate().trim().notEmpty(),
  body('dEndDate').isDate().trim().notEmpty(),
  body('iCustomerId').isMongoId().optional(),
  body('sDescription').trim().notEmpty(),
  body('sTitle').trim().notEmpty()
]

const get = [
  param('id').isMongoId()
]

const list = [
  query('iCustomerId').isMongoId().optional()
]

const update = [
  body('dStartDate').isDate().trim().notEmpty(),
  body('dEndDate').isDate().trim().notEmpty(),
  body('iCustomerId').isMongoId().optional(),
  body('sDescription').trim().notEmpty(),
  body('sTitle').trim().notEmpty(),
  param('id').isMongoId()
]

const deletePlan = [
  param('id').isMongoId()
]

module.exports = { add, update, get, list, deletePlan }
