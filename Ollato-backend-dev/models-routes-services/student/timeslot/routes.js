const router = require('express').Router()
const testServices = require('./services')
// const validators = require('./validators')
const { isStudentAuthenticated } = require('../../../middlewares/middleware')

router.get('/v1/student/time-slots', isStudentAuthenticated, testServices.getTimeSlot)

module.exports = router
