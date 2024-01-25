const router = require('express').Router()
const schoolService = require('./services')
const { validate } = require('../../../middlewares/middleware')

router.get('/v1/school/get-all-school', validate, schoolService.getAllSchool)

module.exports = router
