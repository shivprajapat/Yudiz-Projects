const { body } = require('express-validator')

const register = [
  body('first_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('last_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  // body('email').not().isEmpty(),
  body('mobile').not().isEmpty(),
  body('password').not().isEmpty()
]

const checkExist = [
  body('sType').not().isEmpty(),
  body('sValue').not().isEmpty()
]

const checkExistV2 = [
  body('sUsername').not().isEmpty(),
  body('sEmail').not().isEmpty(),
  body('sMobNum').not().isEmpty()
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
  checkExist,
  loginWithPassword,
  loginWithOTP,
  resetPassword,
  changePassword,
  validateToken,
  checkExistV2,
  loginWithOTPVerify
}
