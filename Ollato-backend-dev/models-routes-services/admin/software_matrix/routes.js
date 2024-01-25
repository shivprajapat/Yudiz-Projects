const router = require('express').Router()
const SoftwareMetrixService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/software-metrixs', validators.getAllMatrix, validate, isAdminAuthenticated, SoftwareMetrixService.getAllSoftwareMetrics)
router.post('/v1/admin/software-metrix', validators.singleMatrix, validate, isAdminAuthenticated, SoftwareMetrixService.getSoftwareMetricsById)
router.post('/v1/admin/software-metrix/create', validators.create, validate, isAdminAuthenticated, SoftwareMetrixService.createSoftwareMetrics)
router.post('/v1/admin/software-metrix/update', validators.update, validate, isAdminAuthenticated, SoftwareMetrixService.updateSoftwareMetrics)
router.post('/v1/admin/software-metrix/delete', validators.deleteMatrix, validate, isAdminAuthenticated, SoftwareMetrixService.deletesoftwareMetrix)
router.post('/v1/admin/software-metrix-detail/delete', validators.deleteMatrix, validate, isAdminAuthenticated, SoftwareMetrixService.deletesoftwareMetrixDetails)

module.exports = router
