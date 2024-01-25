const router = require('express').Router()
const testCategoryService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/test/test-sub-category/get-all', validators.getAllTestCategory, validate, isAdminAuthenticated, testCategoryService.getAllTestSubCategory)
router.post('/v1/admin/test/test-sub-category/get-by-id', validators.singleTestCategory, validate, isAdminAuthenticated, testCategoryService.getTestSubCategoryById)
router.post('/v1/admin/test/test-sub-category/create', validators.create, validate, isAdminAuthenticated, testCategoryService.createTestSubCategory)
router.post('/v1/admin/test/test-sub-category/update', validators.create, validate, isAdminAuthenticated, testCategoryService.updateTestSubCategory)
router.post('/v1/admin/test/test-sub-category/delete', validators.deleteTestCategory, validate, isAdminAuthenticated, testCategoryService.deleteTestSubCategory)
router.get('/v1/admin/test/test-sub-category/get-all-test-sub-category', isAdminAuthenticated, testCategoryService.getAllTestSubCategoryFront) // for front end without pagination
module.exports = router
