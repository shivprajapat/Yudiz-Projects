const router = require('express').Router()
const studentServices = require('./services')
const validators = require('./validators')
const { validate, isStudentAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/student/register', validators.register, validate, studentServices.register)
router.post('/v1/student/email-otp-send', validate, studentServices.registerEmailOtpSend)
router.post('/v1/student/email-otp-verify', validate, studentServices.registerEmailOtpVerify)
router.post('/v1/student/login-with-password', validators.loginWithPassword, validate, studentServices.loginWithPassword)
router.post('/v1/student/login-with-otp', validators.loginWithOTP, validate, studentServices.loginWithOTP)
router.post('/v1/student/login-with-verify-otp', validators.loginWithOTPVerify, validate, studentServices.loginWithOtpVerify)
router.post('/v1/student/reset-password', validators.resetPassword, validate, studentServices.resetPassword) // deprecated
router.post('/v1/student/forgot-password', validate, studentServices.forgotPassword) // deprecated
router.post('/v1/student/otp-verification', validate, studentServices.verifyOtpForForgotPassword) // deprecated
router.post('/v1/student/change-password', isStudentAuthenticated, validators.changePassword, validate, studentServices.changePassword)
router.get('/v1/student/get_all_country', studentServices.getAllCountry)
router.get('/v1/student/get_all_state', studentServices.getAllStates)
router.get('/v1/student/get_all_grade', studentServices.getAllGrade)
router.get('/v1/student/get_all_cities', studentServices.getAllCities)
router.get('/v1/student/get_all_schools', studentServices.getAllSchools)
router.get('/v1/student/logout', isStudentAuthenticated, studentServices.logout)

module.exports = router
