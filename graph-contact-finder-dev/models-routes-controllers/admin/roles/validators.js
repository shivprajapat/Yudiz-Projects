// @ts-check
const { body } = require('express-validator')
const { status } = require('../../../enums')

const roleAdd = [
  body('sName').not().isEmpty(),
  body('aPermissions').not().isEmpty().isArray()
]

const roleUpdate = [
  body('sName').not().isEmpty(),
  body('eStatus').not().isEmpty().toUpperCase().isIn(status?.value),
  body('aPermissions').not().isEmpty().isArray()
]

module.exports = {
  roleAdd,
  roleUpdate
}
