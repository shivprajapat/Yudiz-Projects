const { body } = require('express-validator')

const register = [
  body('first_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('last_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('mobile').not().isEmpty(),
  body('country_id').not().isEmpty(),
  body('city_id').not().isEmpty(),
  body('high_qualification_id').not().isEmpty(),
  body('high_university_id').not().isEmpty(),
  body('last_qualification_id').not().isEmpty(),
  body('last_university_id').not().isEmpty(),
  body('certificate_qualification_id').not().isEmpty(),
  body('certificate_university_id').not().isEmpty(),
  body('state_id').not().isEmpty()
]

const updateCounsellor = [
  body('counsellor_id').not().isEmpty(),
  body('first_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('last_name').custom((value) => {
    return value.match(/^[a-zA-z]+([\s][a-zA-Z]+)*$/)
  }),
  body('mobile').not().isEmpty(),
  body('password').not().isEmpty(),
  body('country_id').not().isEmpty(),
  body('city_id').not().isEmpty(),
  body('high_qualification_id').not().isEmpty(),
  body('high_university_id').not().isEmpty(),
  body('last_qualification_id').not().isEmpty(),
  body('last_university_id').not().isEmpty(),
  body('certificate_qualification_id').not().isEmpty(),
  body('certificate_university_id').not().isEmpty(),
  body('state_id').not().isEmpty()
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
  // body('sNewPassword').not().isEmpty()
]

const changePassword = [
  body('sNewPassword').not().isEmpty()
]

const loginWithOTPVerify = [
  body('login').not().isEmpty(),
  body('otp').not().isEmpty()
]

const validateToken = [
  body('sPushToken').not().isEmpty(),
  body('sDeviceToken').not().isEmpty()
]

const validateOtpSend = [
  body('emailMobile').not().isEmpty()
]

const validateForgetPassword = [
  body('email_mobile').not().isEmpty()
]

const validateForgetPasswordOTPVerify = [
  body('otp').not().isEmpty(),
  body('token').not().isEmpty()
]

module.exports = {
  register,
  updateCounsellor,
  checkExist,
  loginWithPassword,
  loginWithOTP,
  resetPassword,
  changePassword,
  validateToken,
  checkExistV2,
  loginWithOTPVerify,
  validateOtpSend,
  validateForgetPassword,
  validateForgetPasswordOTPVerify
}
