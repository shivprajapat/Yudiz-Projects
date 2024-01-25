const router = require('express').Router()
const testNormDescServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/test-norm-descriptions/get-by-id', isAdminAuthenticated, validators.singleTestNormDesc, validate, testNormDescServices.getTestNormDescById)
router.post('/v1/admin/test-norm-descriptions/get-all', isAdminAuthenticated, validators.getAllTestNormDesc, validate, testNormDescServices.getAll)
router.post('/v1/admin/test-norm-descriptions/create', isAdminAuthenticated, validators.createTestNormDesc, validate, testNormDescServices.createTestNormDesc)
router.post('/v1/admin/test-norm-descriptions/update', isAdminAuthenticated, validators.updateTestNormDesc, validate, testNormDescServices.updateTestNormDesc)
router.post('/v1/admin/test-norm-descriptions/delete', isAdminAuthenticated, validators.deleteTestNormDesc, validate, testNormDescServices.deleteTestNormDesc)

module.exports = router
