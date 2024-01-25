// @ts-check
const { body, param } = require('express-validator')

const addProfessionValidator = [
  body('iProfessionId').isMongoId(),
  body('aCityIds.*').isMongoId().optional(),
  body('sMobile').trim().notEmpty().isMobilePhone('en-IN').optional(),
  body('sSecondaryMobile').trim().notEmpty().isMobilePhone('en-IN').optional(),
  body('sEmail').notEmpty().isEmail().trim().optional(),
  body('sWebsiteURL').trim().optional(),
  body('sTitle').trim().optional()
]

const updateProfessionValidator = [
  param('id').isMongoId(),
  body('iProfessionId').isMongoId(),
  body('aCityIds.*').isMongoId().optional(),
  body('sMobile').trim().notEmpty().isMobilePhone('en-IN').optional(),
  body('sSecondaryMobile').trim().notEmpty().isMobilePhone('en-IN').optional(),
  body('sEmail').notEmpty().isEmail().trim().optional(),
  body('sWebsiteURL').trim().optional(),
  body('sTitle').trim().optional()
]

const deleteProfessionValidator = [
  param('id').isMongoId()
]

module.exports = {
  addProfessionValidator,
  updateProfessionValidator,
  deleteProfessionValidator
}
