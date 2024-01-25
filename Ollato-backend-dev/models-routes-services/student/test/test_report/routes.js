const router = require('express').Router()
const testServices = require('./services')

router.get('/v1/student/test-report/:studentTestCustomId', testServices.getTestReport)

module.exports = router
