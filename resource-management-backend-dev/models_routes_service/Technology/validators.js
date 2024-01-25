const { body, param } = require('express-validator')

const technologyCheckV1 = [
  body('sName').trim().not().isEmpty()
]
const technologyCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updateTechnologyCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty()
]

const preSignedUrlValidate = [
  body('sFileName').trim().not().isEmpty(),
  body('sContentType').trim().not().isEmpty()
]

module.exports = {
  technologyCheckV1,
  technologyCheckIdV1,
  updateTechnologyCheckV1,
  preSignedUrlValidate
}
