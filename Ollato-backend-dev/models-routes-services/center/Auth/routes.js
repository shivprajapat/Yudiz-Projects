const router = require('express').Router()
const CenterServices = require('./services')
const validators = require('./validators')
const { validate, isCenterAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/center/login-with-password', validators.loginWithPassword, validate, CenterServices.loginWithPassword)
router.post('/v1/center/login-with-otp', validators.loginWithOTP, validate, CenterServices.loginWithOTP)
router.post('/v1/center/login-with-verify-otp', validators.loginWithOTPVerify, validate, CenterServices.loginWithOtpVerify)

router.post('/v1/center/forgot-password', validate, CenterServices.forgotPassword) // deprecated
router.post('/v1/center/otp-verification-forgot-password', validate, CenterServices.verifyOtpForForgotPassword) // deprecated
router.post('/v1/center/reset-password', validators.resetPassword, validate, CenterServices.resetPassword) // deprecated
router.post('/v1/center/change-password', isCenterAuthenticated, validators.changePassword, validate, CenterServices.changePassword)
router.get('/v1/center/logout', isCenterAuthenticated, CenterServices.logout)
module.exports = router
