const { body } = require('express-validator')
const updateProfile = [
  body('firstName').not().isEmpty(),
  body('lastName').notEmpty(),
  // body('email').notEmpty(),
  body('motherName').notEmpty(),
  body('fatherName').notEmpty(),
  body('dob').notEmpty(),
  body('mobile').notEmpty(),
  body('nationality').notEmpty(),
  body('sPinCode').notEmpty(),
  body('sAddress2').notEmpty(),
  body('sAddress1').notEmpty(),
  body('pinCode').notEmpty(),
  body('countryId').notEmpty(),
  body('grade').notEmpty(),
  body('board').notEmpty(),
  body('cityId').notEmpty(),
  body('sCountryId').notEmpty(),
  body('school_name').notEmpty(),
  body('sStateId').notEmpty(),
  body('sCityId').notEmpty(),
  body('stateId').notEmpty()
]

module.exports = {
  updateProfile
}
