const { body, param } = require('express-validator')
const { modules } = require('../../data')
const permissionCheckV1 = [
  body('sName').trim().not().isEmpty(),
  body('sModule').trim().not().isEmpty().isIn(modules)
]
const permissionCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updatePermissionsCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty()
]

module.exports = {
  permissionCheckV1,
  permissionCheckIdV1,
  updatePermissionsCheckV1
}
