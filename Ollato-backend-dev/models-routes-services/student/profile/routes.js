const router = require('express').Router()
const { isStudentAuthenticated, validate } = require('../../../middlewares/middleware')
const profileService = require('./services')
const validator = require('./validators')

router.post('/v1/student/student-profile', isStudentAuthenticated, profileService.getLoginStudentDetails)
router.post('/v1/student/update-profile', validator.updateProfile, validate, isStudentAuthenticated, profileService.updateUserProfile)

module.exports = router
