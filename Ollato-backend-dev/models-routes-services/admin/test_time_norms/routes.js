const router = require('express').Router()
const testTimeNormsService = require('./services')
const validator = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/get-all-test-time-norms', isAdminAuthenticated, testTimeNormsService.getAllTestTimeNorms)
router.post('/v1/admin/get-test-time-norms', validator.getTestTimeNormsByIdValidator, validate, isAdminAuthenticated, testTimeNormsService.getTestTimeNormsById)
router.post('/v1/admin/create-test-time-norms', validator.createTestTimeNormsValidator, validate, isAdminAuthenticated, testTimeNormsService.createTestTimeNorms)
router.post('/v1/admin/delete-test-time-norms', validator.deleteTestTimeNormsByIdValidator, validate, isAdminAuthenticated, testTimeNormsService.deleteTestTimeNorms)
router.post('/v1/admin/update-test-time-norms', validate, isAdminAuthenticated, testTimeNormsService.updateTestTimeNorms)
router.post('/v1/admin/sub-test-detail-by-id', validator.deleteTestTimeNormsByIdValidator, validate, isAdminAuthenticated, testTimeNormsService.subTest)
router.get('/v1/admin/get-sub-test-detail', isAdminAuthenticated, testTimeNormsService.getSubTest)

module.exports = router
