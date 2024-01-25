const { body, param } = require('express-validator')

const skillCheckV1 = [
  body('sName').trim().not().isEmpty()
]
const skillCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updateSkillsCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty()
]

module.exports = {
  skillCheckV1,
  skillCheckIdV1,
  updateSkillsCheckV1
}
