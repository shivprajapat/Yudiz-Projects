const { body, param, query } = require('express-validator')
const { status } = require('../../../data')

const addInquiryVisit = [
  body('iInquiryID').trim().isMongoId(),
  body('sPurpose').trim().notEmpty(),
  body('sDescription').trim().notEmpty().optional(),
  body('dVisitedAt').notEmpty().isISO8601(),
  body('eStatus').trim().notEmpty().isIn(status).optional()
]

const getInquiryVisit = [
  param('id').isMongoId()
]

const updateInquiryVisit = [
  param('id').isMongoId(),
  body('iInquiryID').trim().isMongoId(),
  body('sPurpose').trim().notEmpty(),
  body('sDescription').trim().notEmpty().optional(),
  body('dVisitedAt').notEmpty().isISO8601(),
  body('eStatus').trim().notEmpty().isIn(status).optional()
]

const deleteInquiryVisit = [
  query('id').isMongoId(),
  query('inquiryId').isMongoId()
]

const listInquiryVisit = [
  query('id').isMongoId(),
  query('page').isInt({ min: 0 }).optional(),
  query('limit').isInt({ min: 1 }).optional(),
  query('search').trim().notEmpty().optional(),
  query('order').trim().notEmpty().optional()
]

module.exports = {
  addInquiryVisit,
  getInquiryVisit,
  updateInquiryVisit,
  deleteInquiryVisit,
  listInquiryVisit
}
