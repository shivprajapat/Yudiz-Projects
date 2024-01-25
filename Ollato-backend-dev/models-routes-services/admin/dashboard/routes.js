const router = require('express').Router()
const AdminServices = require('./services')
const { isAdminAuthenticated } = require('../../../middlewares/middleware')

router.get('/v1/admin/dashboard', isAdminAuthenticated, AdminServices.dashboardCounts)
router.get('/v1/admin/download-reports', isAdminAuthenticated, AdminServices.downloadReports)

module.exports = router
