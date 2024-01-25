const router = require('express').Router()
const countryService = require('./services')
const { validate } = require('../../../middlewares/middleware')

router.get('/v1/country/get_all_country', validate, countryService.getAllCountry)

module.exports = router
