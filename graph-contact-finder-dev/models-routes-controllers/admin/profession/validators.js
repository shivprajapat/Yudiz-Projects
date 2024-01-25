// @ts-check
const { body, param, query } = require('express-validator')

const add = [
  body('sName').trim().notEmpty(),
  body('iProfessionId').isMongoId().optional()
]
const deleteProfession = [
  param('id').isMongoId()
]

const list = [
  query('iProfessionId').isMongoId().optional(),
  query('sSearch').trim().optional()
]

const update = [
  param('id').isMongoId(),
  body('iProfessionId').isMongoId().optional(),
  body('sName').trim().notEmpty()
]

module.exports = { add, deleteProfession, update, list }
