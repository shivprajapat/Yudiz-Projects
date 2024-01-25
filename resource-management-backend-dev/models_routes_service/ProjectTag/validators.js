const { body, param } = require('express-validator')

const projectTagCheckV1 = [
  body('sName').trim().not().isEmpty()
]
const projectTagCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updateProjectTagsCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty()
]

module.exports = {
  projectTagCheckV1,
  projectTagCheckIdV1,
  updateProjectTagsCheckV1
}
