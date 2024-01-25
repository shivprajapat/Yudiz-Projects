const router = require('express').Router()
const validators = require('./validators')
const OtpVerifications = require('./services')
const { validate, changeDeviceTokenField } = require('../../../middlewares/middleware')

router.post('/user/auth/send-otp/v1', validators.sendOTP, validate, OtpVerifications.sendOTP)
router.post('/user/auth/verify-otp/v2', validators.verifyOTPV2, validate, changeDeviceTokenField, OtpVerifications.verifyOTPV2)

// router.post('/user/auth/send-otp/v2', validators.sendOTPV2, validate, OtpVerifications.sendOTPV2)
// router.post('/user/auth/verify-otp/v3', validators.verifyOTPV3, validate, OtpVerifications.verifyOTPV3)

module.exports = router
