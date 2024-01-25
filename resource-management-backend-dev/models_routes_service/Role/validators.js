const { body, param } = require('express-validator')

const roleCheckV1 = [
  body('sName').trim().not().isEmpty()
]
const roleCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updateRolesCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty()
]

module.exports = {
  roleCheckV1,
  roleCheckIdV1,
  updateRolesCheckV1
}
