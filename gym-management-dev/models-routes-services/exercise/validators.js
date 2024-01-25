// @ts-check
const { body, param } = require('express-validator')
const { status } = require('../../data')

const add = [
  body('sName').trim().notEmpty(),
  body('sDescription').trim().notEmpty().optional()
]

const get = [
  param('id').isMongoId()
]

const update = [
  param('id').isMongoId(),
  body('sName').trim().notEmpty().optional(),
  body('sDescription').trim().notEmpty().optional(),
  body('eStatus').trim().isIn(status).optional()
]

const deleteRecord = [
  param('id').isMongoId()
]

module.exports = {
  add,
  get,
  update,
  deleteRecord
}
