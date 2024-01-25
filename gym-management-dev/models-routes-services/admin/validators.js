const { body, query } = require('express-validator')

const login = [
  body('sEmail').not().isEmpty(),
  body('sPassword').not().isEmpty()
]

const profile = [
  query('id').isMongoId().optional()
]

const add = [
  body('sUserName').trim().notEmpty(),
  body('sMobile').trim().notEmpty().isMobilePhone(),
  body('sEmail').trim().notEmpty().isEmail(),
  body('sPassword').trim().notEmpty(),
  body('iOrganizationId').isMongoId(),
  body('iBranchId').isMongoId().optional()
]

const update = [
  body('sUserName').trim().notEmpty().optional(),
  body('sMobile').trim().notEmpty().isMobilePhone().optional(),
  body('sEmail').trim().notEmpty().isEmail().optional(),
  body('sPassword').trim().notEmpty().optional(),
  body('iOrganizationId').isMongoId().optional(),
  body('iBranchId').isMongoId().optional()
]

const deleteAdmin = [
  query('id').isMongoId().optional()
]

module.exports = { login, add, profile, deleteAdmin, update }
