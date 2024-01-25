const router = require('express').Router()
const stateServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/state/get', validators.singleState, validate, isAdminAuthenticated, stateServices.getStateById)
router.post('/v1/admin/states', validators.getAllState, validate, isAdminAuthenticated, stateServices.getAllState)
router.post('/v1/admin/state/create', validators.createState, validate, isAdminAuthenticated, stateServices.createState)
router.post('/v1/admin/state/update', validators.updateState, validate, isAdminAuthenticated, stateServices.updateState)
router.post('/v1/admin/state/delete', validators.deleteState, validate, isAdminAuthenticated, stateServices.deleteState)

module.exports = router
