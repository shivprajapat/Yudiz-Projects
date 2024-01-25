const { body, param } = require('express-validator')

const departmentCheckV1 = [
  body('sName').trim().not().isEmpty()
]
const departmentCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updateDepartmentsCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty()
]

module.exports = {
  departmentCheckV1,
  departmentCheckIdV1,
  updateDepartmentsCheckV1
}
