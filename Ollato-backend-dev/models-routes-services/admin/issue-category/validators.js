const { body } = require('express-validator')

const createIssue = [
  body('title').not().isEmpty()
]

const updateIssue = [
  body('id').not().isEmpty().isNumeric(),
  body('title').not().isEmpty()
]

const deleteIssue = [
  body('id').not().isEmpty()
]

module.exports = {
  createIssue,
  updateIssue,
  deleteIssue
}
