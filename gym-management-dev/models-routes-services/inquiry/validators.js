const { body, param, query } = require('express-validator')
const { inquiryStatus } = require('../../data')

const addInquiry = [
  body('sPurpose').trim().notEmpty(),
  body('sDescription').not().isEmpty(),
  body('sPreferredLocation').trim().notEmpty(),
  body('sName').trim().notEmpty(),
  body('sEmail').trim().notEmpty().isEmail(),
  body('sPhone').trim().notEmpty().isMobilePhone(),
  body('dFollowupDate').isDate(),
  body('sSecondaryPhone').optional().isMobilePhone(),
  body('dInquiryAt').trim().isISO8601(),
  body('eStatus').trim().isIn(inquiryStatus).optional(),
  body('iBranchId').isMongoId()
]

const getInquiry = [
  query('id').isMongoId().optional(),
  query('sPhone').isMobilePhone().optional().trim()
]

const updateInquiry = [
  body('sPurpose').trim().notEmpty(),
  body('sDescription').not().isEmpty(),
  body('sPreferredLocation').trim().notEmpty(),
  body('sName').trim().notEmpty(),
  body('sEmail').trim().notEmpty().isEmail(),
  body('sPhone').trim().notEmpty().isMobilePhone(),
  body('dFollowupDate').isDate(),
  body('sSecondaryPhone').optional().isMobilePhone(),
  body('dInquiryAt').trim().isISO8601(),
  body('eStatus').trim().isIn(inquiryStatus).optional(),
  body('iBranchId').isMongoId()
]

const deleteInquiry = [
  param('id').isMongoId()
]

const listInquiry = [
  query('page').isInt({ min: 0 }).optional(),
  query('limit').isInt({ min: 1 }).optional(),
  query('search').trim().notEmpty().optional(),
  query('order').trim().notEmpty().optional(),
  query('iBranchId').isMongoId().optional()
]

module.exports = {
  addInquiry,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  listInquiry
}
