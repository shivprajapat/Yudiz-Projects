const { body, param } = require('express-validator')
const { status } = require('../../data')

const addOrganization = [
  body('sName').not().isEmpty(),
  body('sLocation').not().isEmpty(),
  body('sEmail').not().isEmpty().isEmail(),
  body('sLogo').not().isEmpty().optional(),
  body('sMobile').isMobilePhone().trim().notEmpty(),
  body('sSecondaryMobile').isMobilePhone().trim().notEmpty().custom((value, { req, loc, path }) => {
    if (value === req.body.sMobile) {
      throw new Error('Mobile and secondary mobile should not be same')
    } else {
      return value
    }
  }),
  body('iOrganizationId').isMongoId().optional(),
  body('isBranch').isBoolean().optional()
]

const updateOrganization = [
  body('sEmail').not().isEmpty().isEmail(),
  body('sLocation').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('sLogo').not().isEmpty().optional(),
  body('sMobile').isMobilePhone().trim().notEmpty(),
  body('sSecondaryMobile').isMobilePhone().trim().notEmpty().custom((value, { req, loc, path }) => {
    if (value === req.body.sMobile) {
      throw new Error('Mobile and secondary mobile should not be same')
    } else {
      return value
    }
  }),
  body('iOrganizationId').isMongoId().optional(),
  body('eStatus').optional().isIn(status),
  body('isBranch').isBoolean().optional()
]

const deleteOrganization = [
  param('id').isMongoId()
]

module.exports = { addOrganization, updateOrganization, deleteOrganization }
