const { body, param } = require('express-validator')

const jobProfileCheckV1 = [
  body('sName').trim().not().isEmpty(),
  body('nLevel').not().isEmpty().isNumeric(),
  body('sPrefix').not().isEmpty().isIn(['Jr', 'Sr', 'Superior', 'Head', 'Lead', 'Other', 'Owner', 'Manager'])
]
const jobProfileCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updateJobProfilesCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty(),
  body('nLevel').not().isEmpty().isNumeric(),
  body('sPrefix').not().isEmpty().isIn(['Jr', 'Sr', 'Superior', 'Head', 'Lead', 'Other', 'Owner', 'Manager'])
]

module.exports = {
  jobProfileCheckV1,
  jobProfileCheckIdV1,
  updateJobProfilesCheckV1
}
