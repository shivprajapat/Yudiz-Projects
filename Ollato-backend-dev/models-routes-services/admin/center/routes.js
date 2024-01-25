const router = require('express').Router()
const centerService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.get('/v1/admin/center/get-all-frontend', isAdminAuthenticated, centerService.getAllCenterFront) // for front end without pagination

router.post('/v1/admin/center/get-by-id', validators.singleCenter, validate, isAdminAuthenticated, centerService.getCenterById)
router.post('/v1/admin/center/get-all', validators.getAllCenter, validate, isAdminAuthenticated, centerService.getAll)
router.post('/v1/admin/center/create', validators.register, validate, isAdminAuthenticated, centerService.createCenter)
router.post('/v1/admin/center/update', validators.updateCenter, validate, isAdminAuthenticated, centerService.updateCenter)
router.post('/v1/admin/center/delete', validators.deleteCenter, validate, isAdminAuthenticated, centerService.deleteCenter)

module.exports = router
