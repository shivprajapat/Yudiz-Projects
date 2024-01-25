const router = require('express').Router()
const qualificationService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/qualification/get-all-qualification', validators.getAllQualification, validate, isAdminAuthenticated, qualificationService.getAllQualification)
router.post('/v1/admin/qualification/get-qualification-by-id', validators.singleQualification, validate, isAdminAuthenticated, qualificationService.getQualificationById)
router.post('/v1/admin/qualification/create', validators.create, validate, isAdminAuthenticated, qualificationService.createQualification)
router.post('/v1/admin/qualification/update', validators.create, validate, isAdminAuthenticated, qualificationService.updateQualification)
router.post('/v1/admin/qualification/delete', validators.deleteQualification, validate, isAdminAuthenticated, qualificationService.deleteQualification)

module.exports = router
