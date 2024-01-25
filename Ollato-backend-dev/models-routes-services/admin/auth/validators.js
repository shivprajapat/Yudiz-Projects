const { body } = require('express-validator')

const loginWithPassword = [
  body('email').not().isEmpty(),
  body('password').not().isEmpty()
]

const loginWithOTP = [
  body('login').not().isEmpty()
]

const resetPassword = [
  // body('sNewPassword').not().isEmpty()
]

const changePassword = [
  body('password').not().isEmpty(),
  body('currentPassword').not().isEmpty(),
  body('confirmPassword').not().isEmpty()
]

const loginWithOTPVerify = [
  body('login').not().isEmpty(),
  body('otp').not().isEmpty()
]

const validateToken = [
  body('sPushToken').not().isEmpty(),
  body('sDeviceToken').not().isEmpty()
]

const createAdmin = [
  body('email').not().isEmpty(),
  body('mobile').not().isEmpty(),
  body('role_id').not().isEmpty()
]

const updateAdmin = [
  body('id').not().isEmpty(),
  body('email').not().isEmpty(),
  body('mobile').not().isEmpty(),
  body('role_id').not().isEmpty()
]

const getAllAdmin = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

module.exports = {
  loginWithPassword,
  loginWithOTP,
  resetPassword,
  changePassword,
  validateToken,
  loginWithOTPVerify,
  createAdmin,
  updateAdmin,
  getAllAdmin
}
