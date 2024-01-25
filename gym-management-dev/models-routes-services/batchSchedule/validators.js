const { body, param, query } = require('express-validator')

const add = [
  body('sTitle').notEmpty().trim(),
  body('sDescription').notEmpty().trim().optional(),
  body('sStartTime').notEmpty().trim(),
  body('sEndTime').notEmpty().trim(),
  body('iBranchId').isMongoId().optional()
]

const update = [
  param('id').isMongoId(),
  body('sTitle').notEmpty().trim().optional(),
  body('sDescription').notEmpty().trim().optional(),
  body('sStartTime').notEmpty().trim(),
  body('sEndTime').notEmpty().trim(),
  body('iBranchId').isMongoId().optional()
]

const deleteBatch = [
  param('id').isMongoId()
]

const get = [
  param('id').isMongoId()
]

const list = [
  query('iBranchId').isMongoId().optional()
]

module.exports = { add, update, deleteBatch, get, list }
