const router = require('express').Router()
const cityServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/city/get', validators.singleCity, validate, isAdminAuthenticated, cityServices.getCityById)
router.post('/v1/admin/cities', validators.getAllCity, validate, isAdminAuthenticated, cityServices.getAll)
router.post('/v1/admin/city/create', validators.createCity, validate, isAdminAuthenticated, cityServices.createCity)
router.post('/v1/admin/city/update', validators.updateCity, validate, isAdminAuthenticated, cityServices.updateCity)
router.post('/v1/admin/city/delete', validators.deleteCity, validate, isAdminAuthenticated, cityServices.deleteCity)

module.exports = router
