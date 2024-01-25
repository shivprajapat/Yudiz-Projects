const router = require('express').Router()
const testCategoryService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/test/test-category/get-all', validators.getAllTestCategory, validate, isAdminAuthenticated, testCategoryService.getAllTestCategory)
router.post('/v1/admin/test/test-category/get-by-id', validators.singleTestCategory, validate, isAdminAuthenticated, testCategoryService.getTestCategoryById)
router.post('/v1/admin/test/test-category/create', validators.create, validate, isAdminAuthenticated, testCategoryService.createTestCategory)
router.post('/v1/admin/test/test-category/update', validators.create, validate, isAdminAuthenticated, testCategoryService.updateTestCategory)
router.post('/v1/admin/test/test-category/delete', validators.deleteTestCategory, validate, isAdminAuthenticated, testCategoryService.deleteTestCategory)
router.get('/v1/admin/test/test-category/get-all-test-category', isAdminAuthenticated, testCategoryService.getAllTestCategoryFront) // for front end without pagination

module.exports = router
