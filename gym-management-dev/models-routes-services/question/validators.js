const { body, param, query } = require('express-validator')
const { questionCategory } = require('../../data')

const add = [
  body('eCategory').notEmpty().trim().optional().isIn(questionCategory),
  body('sQuestion').notEmpty().trim()
]

const update = [
  param('id').isMongoId(),
  body('eCategory').notEmpty().trim().optional().isIn(questionCategory),
  body('sQuestion').notEmpty().trim()
]

const deleteQuestion = [
  param('id').isMongoId()
]

const getQuestion = [
  param('id').isMongoId()
]

const list = [
  query('eCategory').isIn(questionCategory).optional()
]

module.exports = { add, update, deleteQuestion, list, getQuestion }
