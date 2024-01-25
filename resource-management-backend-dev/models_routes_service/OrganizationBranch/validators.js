// sName, nHoursPerDay,nDayPerMonth

const { body, param } = require('express-validator')

const organizationBranchDetailCheck = [
  body('sName').trim().not().isEmpty(),
  body('sAddress').trim().not().isEmpty(),
  // body('sLatitude').trim().not().isEmpty(),
  // body('sLongitude').trim().not().isEmpty(),
  body('iStateId').trim().not().isEmpty().isMongoId(),
  body('iCityId').trim().not().isEmpty().isMongoId(),
  body('iCountryId').trim().not().isEmpty().isMongoId(),
  body('bIsHeadquarter').trim().not().isEmpty().isBoolean(),
  body('nSeatingCapacity').trim().not().isEmpty().isNumeric().isDecimal()
]
const organizationBranchDetailCheckUpdate = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty(),
  body('sAddress').trim().not().isEmpty(),
  // body('sLatitude').trim().not().isEmpty(),
  // body('sLongitude').trim().not().isEmpty(),
  body('iStateId').trim().not().isEmpty().isMongoId(),
  body('iCityId').trim().not().isEmpty().isMongoId(),
  body('iCountryId').trim().not().isEmpty().isMongoId(),
  body('bIsHeadquarter').trim().not().isEmpty().isBoolean(),
  body('nSeatingCapacity').trim().not().isEmpty().isNumeric().isDecimal()
]

const organizationBranchDetailCheckDelete = [
  param('id').not().isEmpty().isMongoId()
]

// const updateJobProfilesCheckV1 = [
//   param('id').not().isEmpty().isMongoId(),
//   body('sName').trim().not().isEmpty()
// ]

module.exports = {
  organizationBranchDetailCheck,
  organizationBranchDetailCheckUpdate,
  organizationBranchDetailCheckDelete
}
