const router = require('express').Router()
const normGradesServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/norm-grades/get-by-id', validators.singleNormGrade, validate, isAdminAuthenticated, normGradesServices.getNormGradesById)
router.post('/v1/admin/norm-grades/get-all', validators.getAllNormGrade, validate, isAdminAuthenticated, normGradesServices.getAll)
router.post('/v1/admin/norm-grades/create', validators.createNormGrade, validate, isAdminAuthenticated, normGradesServices.createNormGrade)
router.post('/v1/admin/norm-grades/update', validators.updateNormGrade, validate, isAdminAuthenticated, normGradesServices.updateNormGrade)
router.post('/v1/admin/norm-grades/delete', validators.deleteNormGrade, validate, isAdminAuthenticated, normGradesServices.deleteNormGrade)

module.exports = router
