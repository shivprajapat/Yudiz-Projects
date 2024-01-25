// @ts-check
const { body } = require('express-validator')
const { status, adminPermission } = require('../../../enums')

const permissionAdd = [
  body('sName').not().isEmpty(),
  body('sKey').not().isEmpty().isIn(adminPermission)
]

const permissionUpdate = [
  body('sName').not().isEmpty(),
  body('sKey').not().isEmpty().isIn(adminPermission),
  body('eStatus').not().isEmpty().toUpperCase().isIn(status?.value)
]
module.exports = {
  permissionAdd,
  permissionUpdate
}
