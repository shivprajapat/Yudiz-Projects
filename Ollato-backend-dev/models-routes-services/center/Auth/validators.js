const { body } = require('express-validator')

const register = [
  body('first_name').not().isEmpty(),
  body('email').not().isEmpty(),
  body('mobile').not().isEmpty(),
  body('password').not().isEmpty()
]

const loginWithPassword = [
  body('login').not().isEmpty(),
  body('password').not().isEmpty()
]

const loginWithOTP = [
  body('login').not().isEmpty()
]

const resetPassword = [
  body('password').not().isEmpty(),
  body('confirm_password').not().isEmpty(),
  body('token').not().isEmpty()
]

const changePassword = [
  body('password').not().isEmpty(),
  body('currentPassword').not().isEmpty(),
  body('confirmPassword').not().isEmpty()
]

const validateToken = [
  body('sPushToken').not().isEmpty(),
  body('sDeviceToken').not().isEmpty()
]

const loginWithOTPVerify = [
  body('login').not().isEmpty(),
  body('otp').not().isEmpty()
]

module.exports = {
  register,
  loginWithPassword,
  loginWithOTP,
  resetPassword,
  changePassword,
  validateToken,
  loginWithOTPVerify
}
