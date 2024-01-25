const router = require('express').Router()
const { FeedRouter } = require('./feeds')
const { AdminRouter } = require('./admins')
const { ClientRouter } = require('./clients')
const { SubscriptionRouter } = require('./subscriptions')
const { ApiLogsRouter } = require('./api-logs')

router.use('/feed', FeedRouter)
router.use('/admin', AdminRouter)
router.use('/client', ClientRouter)
router.use('/subscription', SubscriptionRouter)
router.use('/api-logs', ApiLogsRouter)

module.exports = router
