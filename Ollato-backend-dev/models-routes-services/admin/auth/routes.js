const router = require('express').Router()
const adminServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/login-with-password', validators.loginWithPassword, validate, adminServices.loginWithPassword)
router.post('/v1/admin/forgot-password', validate, adminServices.forgotPassword)
router.post('/v1/admin/otp-verification', validators.loginWithOTPVerify, validate, adminServices.loginWithOtpVerify)
router.post('/v1/admin/otp-verification-forgot-password', validate, adminServices.verifyOtpForForgotPassword)
router.post('/v1/admin/reset-password', validators.resetPassword, validate, adminServices.resetPassword)
router.post('/v1/admin/change-password', isAdminAuthenticated, validators.changePassword, validate, adminServices.changePassword)
router.get('/v1/admin/logout', isAdminAuthenticated, adminServices.logout)

// role-admin
router.post('/v1/admin/role-admin/list', validators.getAllAdmin, validate, isAdminAuthenticated, adminServices.listRoleAdmin)
router.post('/v1/admin/role-admin/create', validators.createAdmin, validate, isAdminAuthenticated, adminServices.createRoleAdmin)
router.post('/v1/admin/role-admin/update', validators.updateAdmin, validate, isAdminAuthenticated, adminServices.updateRoleAdmin)
router.post('/v1/admin/role-admin/get-by-id', isAdminAuthenticated, adminServices.getRoleAdmin)
router.post('/v1/admin/role-admin/delete', isAdminAuthenticated, adminServices.deleteRoleAdmin)

// router.post('/v1/admin/change-password', validators.changePassword, validate, adminServices.changePassword)

module.exports = router
