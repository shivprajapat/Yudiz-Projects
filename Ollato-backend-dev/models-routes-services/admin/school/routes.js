const router = require('express').Router()
const schoolService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/school/get-all-school', validators.getAllSchool, validate, isAdminAuthenticated, schoolService.getAllSchool)
router.post('/v1/admin/school/get-school-by-id', validators.singleSchool, validate, isAdminAuthenticated, schoolService.getSchoolById)
router.post('/v1/admin/school/create', validators.create, validate, isAdminAuthenticated, schoolService.createSchool)
router.post('/v1/admin/school/update', validators.create, validate, isAdminAuthenticated, schoolService.updateSchool)
router.post('/v1/admin/school/delete', validators.deleteSchool, validate, isAdminAuthenticated, schoolService.deleteSchool)

module.exports = router
