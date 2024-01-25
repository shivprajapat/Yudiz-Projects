const router = require('express').Router()
const packageServices = require('./services')
const validators = require('./validators')
const { validate, isStudentAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/student/packages/get', validators.singlePackage, validate, isStudentAuthenticated, packageServices.getPackageById)
router.post('/v1/student/packages', validate, isStudentAuthenticated, packageServices.getAllSub)
router.post('/v1/student/add-on-packages', validate, isStudentAuthenticated, packageServices.getAllAddOn)
router.post('/v1/student/packages/purchase', isStudentAuthenticated, packageServices.purchasePackage)
router.post('/v1/student/purchase/success', validators.purchaseSuccess, isStudentAuthenticated, packageServices.purchaseSuccess)
router.post('/v1/student/purchased-packages', isStudentAuthenticated, packageServices.getPurchasedPackage)
router.post('/v1/student/active-purchased-packages', isStudentAuthenticated, packageServices.getActivePurchasedPackage)
router.get('/v1/student/purchased-package/invoice/:id', packageServices.getInvoice)
router.post('/v1/student/payment/payumoney', isStudentAuthenticated, packageServices.paymentPayumoney)
router.post('/v1/student/payment/payumoney/response', isStudentAuthenticated, packageServices.paymentPayumoneyResponse)
router.post('/v1/student/coupon/apply', validators.couponCode, validate, isStudentAuthenticated, packageServices.applyCoupon)

module.exports = router
