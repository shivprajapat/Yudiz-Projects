const { body, param, query } = require('express-validator')
const { subscriptionStatus } = require('../../data')

const addSubscription = [
  body('iCustomerId').isMongoId(),
  body('nPrice').isInt({ min: 0 }),
  body('dStartDate').trim().not().isEmpty(),
  body('dEndDate').trim().not().isEmpty(),
  body('iTrainerId').isMongoId().optional(),
  body('iBranchId').isMongoId(),
  body('nPaymentCycle').isInt({ min: 1, max: 12 })
]

const getSubscription = [
  param('id').isMongoId()
]

const updateSubscription = [
  param('id').isMongoId(),
  body('nPrice').isInt({ min: 0 }),
  body('iCustomerId').isMongoId(),
  body('dStartDate').trim().not().isEmpty(),
  body('dEndDate').trim().not().isEmpty(),
  body('iTrainerId').isMongoId().optional(),
  body('iBranchId').isMongoId(),
  body('nPaymentCycle').isInt({ min: 1, max: 12 }).optional()
]

const deleteSubscription = [
  param('id').isMongoId()
]

const list = [
  query('nExpireInDay').isInt({ min: 1 }).optional(),
  query('iBranchId').isMongoId().optional(),
  query('iTrainerId').isMongoId().optional(),
  query('eStatus').notEmpty().trim().optional().isIn(subscriptionStatus)
]

module.exports = {
  addSubscription,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  list
}
