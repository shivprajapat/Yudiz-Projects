const router = require('express').Router()
const CenterRevenueServices = require('./services')
const { isCenterAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/center/get-revenue', isCenterAuthenticated, CenterRevenueServices.getCenterRevenue)

module.exports = router
