// @ts-check
const { body, query, param } = require('express-validator')

const register = [
  body('iOTPId').isMongoId(),
  body('sName').trim().not().notEmpty(),
  body('sMobileNumber').trim().notEmpty().isMobilePhone('en-IN'),
  body('sPassword').trim().notEmpty()
]

const filterContact = [
  query('iLevel').isInt({ min: 1, max: 7 }).optional(),
  query('nPage').isInt({ min: 1 }).optional(),
  query('nLimit').isInt({ min: 1, max: 500 }).optional(),
  query('iProfessionIds').isMongoId(),
  query('iCityId').isMongoId().optional()
]

const login = [
  body('sMobileNumber').trim().isMobilePhone('en-IN'),
  body('sPassword').trim()
]

const validateContact = [
  param('id').isMongoId()
]

const updatePassword = [
  body('sOldPassword').trim().notEmpty(),
  body('sNewPassword').trim().notEmpty()
]
const resetPassword = [
  body('iOTPId').isMongoId(),
  body('sMobileNumber').isMobilePhone('en-IN'),
  body('sNewPassword').trim().notEmpty()
]

const updateUser = [
  body('sName').trim().not().notEmpty(),
  body('sMobileNumber').trim().notEmpty().isMobilePhone('en-IN')
]

const getAdminUserList = [
  query('nLimit').isInt({ min: 1, max: 500 }).optional(),
  query('nPage').isInt({ min: 1 }).optional(),
  query('bIsUser').isBoolean().optional(),
  query('nMaxRating').isInt({ min: 0, max: 5 }).optional(),
  query('nMinRating').isInt({ min: 0, max: 5 }).optional()
]

const syncContactList = [
  body('aList.*.sMobileNumber').isMobilePhone('en-IN'),
  body('aList.*.sName').trim().notEmpty()
]

const userProfile = [
  query('iContactUserId').isMongoId()
]

module.exports = {
  register,
  login,
  updatePassword,
  validateContact,
  filterContact,
  resetPassword,
  updateUser,
  getAdminUserList,
  userProfile,
  syncContactList
}
