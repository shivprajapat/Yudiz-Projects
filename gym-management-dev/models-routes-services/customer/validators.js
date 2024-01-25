const { body, param, query } = require('express-validator')
const { gender, referUserType, eventType } = require('../../data')

const addCustomer = [
  body('sName').trim().not().isEmpty(),
  body('sEmail').not().isEmpty().isEmail(),
  body('sMobile').not().isEmpty().isMobilePhone(),
  body('nAge').not().isEmpty().isInt({ min: 17, max: 100 }),
  body('eGender').not().isEmpty().isIn(gender),
  body('sAddress').trim().not().isEmpty(),
  body('dBirthDate').optional().isDate(),
  body('dAnniversaryDate').optional().isDate(),
  body('iBranchId').isMongoId(),
  body('oReferInfo.iUserId').isMongoId().optional(),
  body('oReferInfo.sName').trim().notEmpty().optional(),
  body('oReferInfo.sUserType').trim().notEmpty().optional().isIn(referUserType),
  body('oReferInfo.sMobile').isMobilePhone().trim().notEmpty().optional(),
  body('iBatchScheduleId').isMongoId()
]

const getCustomer = [
  param('id').isMongoId()
]

const updateCustomer = [
  param('id').isMongoId(),
  body('sName').trim().not().isEmpty().optional(),
  body('sEmail').not().isEmpty().isEmail().optional(),
  body('sMobile').not().isEmpty().isMobilePhone().optional(),
  body('nAge').not().isEmpty().isInt({ min: 17, max: 100 }).optional(),
  body('eGender').not().isEmpty().isIn(gender).optional(),
  body('sAddress').trim().not().isEmpty().optional(),
  body('dBirthDate').optional().trim(),
  body('dAnniversaryDate').optional().trim(),
  body('iBranchId').isMongoId().optional(),
  body('iBatchScheduleId').isMongoId().optional()
]

const deleteCustomer = [
  param('id').isMongoId()
]
const getCustomerList = [
  query('iBranchId').isMongoId().optional(),
  query('eGender').notEmpty().trim().isIn(gender).optional(),
  query('iReferBy').isMongoId().optional(),
  query('sEventType').isIn(eventType).optional(),
  query('iEventBeforeDay').isInt({ min: 0 }).optional()
]

module.exports = {
  addCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerList
}
