const router = require('express').Router()
const cityService = require('./services')
const { validate } = require('../../../middlewares/middleware')
const validators = require('./validator')

router.post('/v1/city/get_all_cities', validators.getAllCity, validate, cityService.getAllCities)

module.exports = router
