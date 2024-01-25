// sName, nHoursPerDay,nDayPerMonth

const { body, param } = require('express-validator')

const organizationDetailCheck = [
  body('sName').trim().not().isEmpty(),
  body('sName').trim().not().isEmpty(),
  body('nHoursPerDay').isEmpty().isNumeric().isDecimal(),
  body('nDayPerMonth').isEmpty().isNumeric().isDecimal(),
  body('sLogo').trim().not().isEmpty()
]
const organizationDetailCheckUpdate = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty(),
  body('nHoursPerDay').isEmpty().isNumeric().isDecimal(),
  body('nDayPerMonth').isEmpty().isNumeric().isDecimal(),
  body('sLogo').trim().not().isEmpty()
]

const preSignedUrlValidate = [
  body('sFileName').trim().not().isEmpty(),
  body('sContentType').trim().not().isEmpty()
]

// const updateJobProfilesCheckV1 = [
//   param('id').not().isEmpty().isMongoId(),
//   body('sName').trim().not().isEmpty()
// ]

module.exports = {
  organizationDetailCheck,
  organizationDetailCheckUpdate,
  preSignedUrlValidate
}
