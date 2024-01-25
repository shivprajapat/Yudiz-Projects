const router = require('express').Router()
const universityService = require('./services')
const { validate } = require('../../../middlewares/middleware')

router.get('/v1/university/get-all-university', validate, universityService.getAllUniversity)

module.exports = router
