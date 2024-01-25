// @ts-check
const { body, query, param } = require('express-validator')
const { requestType, requestStatus } = require('../../enums')

const add = [
  body('iRequestTo').isMongoId(),
  body('sDescription').trim().notEmpty().optional()
]

const list = [
  query('eOperationType').trim().isIn(requestType?.value),
  query('eStatus').isIn(requestStatus?.value)
]
const update = [
  body('eOperationType').trim().isIn(requestStatus?.value),
  body('id').isMongoId()
]

const deleteRequest = [
  param('id').isMongoId()
]
module.exports = { add, list, deleteRequest, update }
