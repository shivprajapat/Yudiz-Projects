const router = require('express').Router()
const normsService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/norms/get-all-norms', validators.getAllNorms, validate, isAdminAuthenticated, normsService.getAllNorms)
router.post('/v1/admin/norms/get-norms-by-id', validators.singleNorm, validate, isAdminAuthenticated, normsService.getNormsById)
router.post('/v1/admin/norms/create', validators.create, validate, isAdminAuthenticated, normsService.createNorm)
router.post('/v1/admin/norms/update', validators.create, validate, isAdminAuthenticated, normsService.updateNorm)
router.post('/v1/admin/norms/delete', validators.deleteNorms, validate, isAdminAuthenticated, normsService.deleteNorms)
router.get('/v1/admin/norms/get-all-norms-frontend', isAdminAuthenticated, normsService.getAllNormsFrontend)

module.exports = router
