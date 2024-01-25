const { body, param } = require('express-validator')

const interviewDelete = [
  param('id').not().isEmpty().isMongoId()
]

const createInterviewCheckV1 = [
  body('iEmpId').not().isEmpty(),
  body('iClientId').not().isEmpty(),
  body('aTechnologyId').not().isEmpty(),
  body('iProjectId').not().isEmpty(),
  body('eInterviewStatus').not().isEmpty(),
  body('sJobDescriptions').not().isEmpty(),
  body('dInterviewDate').not().isEmpty(),
  body('sInterviewTime').not().isEmpty()
]
const updateInterviewCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  ...createInterviewCheckV1
]

module.exports = {
  interviewDelete,
  updateInterviewCheckV1,
  createInterviewCheckV1
}
