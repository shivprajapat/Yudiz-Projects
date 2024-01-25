const router = require('express').Router()
const CounsellorRevenueServices = require('./services')
const { isCounsellorAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/counsellor/get-revenue', validators.revenue, isCounsellorAuthenticated, CounsellorRevenueServices.getCounsellorRevenue)

module.exports = router
