const router = require('express').Router()
const paymentServices = require('./services')
const validators = require('./validators')
const { isUserAuthenticated } = require('../../middlewares/middleware')

router.post('/user/payment/create/v1', isUserAuthenticated, validators.userPayment, paymentServices.createOrder)
router.post('/admin/payment/notify-url/v1', paymentServices.verifyOrder)
router.post('/admin/payment/return-url/v1', paymentServices.returnUrl)
router.post('/admin/payment/verify-app-payment/v1', paymentServices.verifyAppPayment)

router.post('/user/payment/create/v2', isUserAuthenticated, validators.userPayment, paymentServices.generatePayment)
router.all('/admin/payment/notify-url/v2', paymentServices.verifyOrderV2)
router.all('/admin/payment/return-url/v2', paymentServices.returnUrlV2)

router.all('/admin/payment/amazon-return-url/v1', paymentServices.amazonReturnUrl)

router.all('/admin/payment/amazonepay-webhook', paymentServices.amazonPayWebhook)

router.all('/user/payment/amazonpay-process-charge/v1', isUserAuthenticated, paymentServices.amazonPayProcessCharge)

router.all('/user/payment/amazonpay-charge-status/v1', isUserAuthenticated, paymentServices.amazonPayChargeStatus)

router.all('/user/payment/amazonpay-verify-signature/v1', isUserAuthenticated, paymentServices.amazonPayVerifySignature)

module.exports = router
