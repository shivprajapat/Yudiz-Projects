const router = require('express').Router()
const counsellorServices = require('./services')
const validators = require('./validators')
const { validate, isCounsellorAuthenticated } = require('../../middlewares/middleware')

router.post('/v1/counsellor/register', validators.register, validate, counsellorServices.register)

router.post('/v1/counsellor/email-otp-send', validators.validateOtpSend, validate, counsellorServices.registerEmailOtpSend)
router.post('/v1/counsellor/email-otp-verify', validators.loginWithOTPVerify, validate, counsellorServices.registerEmailOtpVerify)

router.post('/v1/counsellor/login-with-password', validators.loginWithPassword, validate, counsellorServices.loginWithPassword)
router.post('/v1/counsellor/login-with-otp', validators.loginWithOTP, validate, counsellorServices.loginWithOTP)
router.post('/v1/counsellor/login-with-verify-otp', validators.loginWithOTPVerify, validate, counsellorServices.loginWithOtpVerify)

router.post('/v1/counsellor/forgot-password', validators.validateForgetPassword, validate, counsellorServices.forgotPassword)
router.post('/v1/counsellor/otp-verification-forgot-password', validators.validateForgetPasswordOTPVerify, validate, counsellorServices.verifyOtpForForgotPassword)

router.post('/v1/counsellor/reset-password', validators.resetPassword, validate, counsellorServices.resetPassword)
router.post('/v1/counsellor/change-password', validators.changePassword, validate, isCounsellorAuthenticated, counsellorServices.changePassword)

router.post('/v1/counsellor/update', validators.register, validate, isCounsellorAuthenticated, counsellorServices.updateCounsellor)

router.get('/v1/counsellor/dashboard', isCounsellorAuthenticated, counsellorServices.dashboard)
router.get('/v1/counsellor/get-counsellor', isCounsellorAuthenticated, counsellorServices.getCounsellor)
router.get('/v1/counsellor/get_qualification', counsellorServices.getQualification)
router.get('/v1/counsellor/get_all_university', counsellorServices.getAllUniversity)
router.get('/v1/counsellor/logout', isCounsellorAuthenticated, counsellorServices.logout)

module.exports = router
