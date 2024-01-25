const router = require('express').Router()
const DashboardService = require('./services')
const { isStudentAuthenticated } = require('../../../middlewares/middleware')

router.get('/v1/student/dashboard', isStudentAuthenticated, DashboardService.DashboardCount)
module.exports = router
