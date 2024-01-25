const router = require('express').Router()
const cronServices = require('./services')
const { isCronAuthenticated } = require('../../middlewares/middleware')

// Last Pending Deposit Payment processing every 1 hour...
router.get('/admin/cron/process-payment/v1', isCronAuthenticated, cronServices.processDepositPayment)

// Pending Cashfree Payout processing every 1 hour...
router.get('/admin/cron/process-initiated-payouts/v1', isCronAuthenticated, cronServices.processInitiatedPayouts)

module.exports = router
