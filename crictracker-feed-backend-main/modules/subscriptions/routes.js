const router = require('express').Router()
const SubscriptionService = require('./services')
// const { isFeedSubscriptionAccessible } = require('./middleware')
const { isClientAuthenticated } = require('../clients/middleware')

router.get('/active', isClientAuthenticated, SubscriptionService.fetchActiveSubscription)

module.exports = router
