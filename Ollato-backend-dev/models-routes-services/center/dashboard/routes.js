const router = require('express').Router()
const CenterServices = require('./services')
const { isCenterAuthenticated } = require('../../../middlewares/middleware')

router.get('/v1/center/dashboard', isCenterAuthenticated, CenterServices.dashboardCounts)

module.exports = router
