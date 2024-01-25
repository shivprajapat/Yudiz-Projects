const { body, param, query } = require('express-validator')
const { status } = require('../../../data')

const addInquiryHistory = [
  body('iInquiryID').trim().isMongoId(),
  body('sResponse').trim().notEmpty(),
  body('nFollowupInDay').isInt({ min: 1, max: 90 }).optional(),
  body('dFollowupAt').notEmpty().isISO8601(),
  body('eStatus').trim().notEmpty().isIn(status).optional(),
  body('iFollowupBy').isMongoId()
]

const getInquiryHistory = [
  param('id').isMongoId()
]

const updateInquiryHistory = [
  body('iInquiryID').trim().isMongoId(),
  body('sResponse').trim().notEmpty(),
  body('nFollowupInDay').isInt({ min: 1, max: 90 }).optional(),
  body('dFollowupAt').notEmpty().isISO8601(),
  body('eStatus').trim().notEmpty().isIn(status).optional(),
  body('iFollowupBy').isMongoId()
]

const deleteInquiryHistory = [
  param('id').isMongoId()
]

const listInquiryHistory = [
  query('id').isMongoId().optional(),
  query('page').isInt({ min: 0 }).optional(),
  query('limit').isInt({ min: 1 }).optional(),
  query('search').trim().notEmpty().optional(),
  query('order').trim().notEmpty().optional(),
  query('iFollowupBy').isMongoId().optional(),
  query('nextFollowupDayBefore').isInt({ min: 0 }).optional()
]

module.exports = {
  addInquiryHistory,
  getInquiryHistory,
  updateInquiryHistory,
  deleteInquiryHistory,
  listInquiryHistory
}
