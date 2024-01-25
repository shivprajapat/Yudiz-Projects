const router = require('express').Router()
const gradeService = require('./services')
const { validate } = require('../../../middlewares/middleware')
const validators = require('./validators')
const { isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/grade/get-all-grade', validators.getAllGrade, validate, isAdminAuthenticated, gradeService.getAllGrade)
router.post('/v1/admin/grade/get-grade-by-id', validators.singleGrade, validate, isAdminAuthenticated, gradeService.getGradeById)
router.post('/v1/admin/grade/create', validators.createGrade, validate, isAdminAuthenticated, gradeService.createGrade)
router.post('/v1/admin/grade/update', validators.createGrade, validate, isAdminAuthenticated, gradeService.updateGrade)
router.post('/v1/admin/grade/delete', validators.deleteGrade, validate, isAdminAuthenticated, gradeService.deleteGrade)

module.exports = router
