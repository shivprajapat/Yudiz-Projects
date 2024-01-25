const router = require('express').Router()
const universityService = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/university/create', validators.create, validate, isAdminAuthenticated, universityService.createUniversity)
router.post('/v1/admin/university/update', validators.create, validate, isAdminAuthenticated, universityService.updateUniversity)
router.post('/v1/admin/university/delete', validators.deleteUniversity, isAdminAuthenticated, validate, universityService.deleteUniversity)
router.post('/v1/admin/university/get-all-university', validators.getAllUniversity, validate, isAdminAuthenticated, universityService.getAllUniversity)
router.post('/v1/admin/university/get-university-by-id', validators.singleUniversity, validate, isAdminAuthenticated, universityService.getUniversityById)

module.exports = router
