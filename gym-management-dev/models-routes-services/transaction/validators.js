const { body, param } = require('express-validator')
const addTransaction = [
  body('nPrice').not().isEmpty().isInt({ min: 1 }),
  body('iSubscriptionId').isMongoId(),
  body('dTransactionDate').not().isEmpty().isISO8601(),
  body('sDescription').optional().trim().notEmpty().isLength({ max: 1000 })
]

const getTransaction = [
  param('id').isMongoId()
]

const updateTransaction = [
  param('id').isMongoId(),
  body('nPrice').not().isEmpty().isInt({ min: 1 }),
  body('iSubscriptionId').isMongoId(),
  body('dTransactionDate').not().isEmpty().isISO8601(),
  body('sDescription').optional().trim().notEmpty().isLength({ max: 1000 })
]

const deleteTransaction = [
  param('id').isMongoId()
]

const transactionReport = [
  body('dFrom').isDate().trim().notEmpty().optional(),
  body('dTo').isDate().trim().notEmpty().optional(),
  body('iCustomerId').isMongoId().optional()
]

module.exports = {
  addTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  transactionReport
}
