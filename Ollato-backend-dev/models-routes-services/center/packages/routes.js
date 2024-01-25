const router = require('express').Router()
const centerServices = require('./services')
const validators = require('./validators')
const { validate, isCenterAuthenticated } = require('../../../middlewares/middleware')

router.get('/v1/center/packages', validate, isCenterAuthenticated, centerServices.getPackages)
router.post('/v1/center/packages/purchase', validators.purchasePackage, validate, isCenterAuthenticated, centerServices.purchasePackage)
router.get('/v1/center/packages/purchased-licence', validate, isCenterAuthenticated, centerServices.purchasedLicense)
router.post('/v1/center/purchase/success', validators.purchaseSuccess, isCenterAuthenticated, centerServices.purchaseSuccess)
router.get('/v1/center/purchased-package/invoice/:id', centerServices.getInvoice)
router.post('/v1/center/payment/payumoney', isCenterAuthenticated, centerServices.paymentPayumoney)
router.post('/v1/center/payment/payumoney/response', isCenterAuthenticated, centerServices.paymentPayumoneyResponse)
router.post('/v1/center/purchased-packages', isCenterAuthenticated, centerServices.getPurchasedPackage)
router.post('/v1/center/coupon/apply', validators.couponCode, validate, isCenterAuthenticated, centerServices.applyCoupon)

module.exports = router
