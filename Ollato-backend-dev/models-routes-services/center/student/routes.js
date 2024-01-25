const router = require('express').Router()
const studentServices = require('./services')
const validators = require('./validators')
const { validate, isCenterAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/center/student/get-by-id', validators.singleStudent, validate, isCenterAuthenticated, studentServices.getStudentById)
router.post('/v1/center/student/get-all', validators.getAllStudent, validate, isCenterAuthenticated, studentServices.getAll)
router.post('/v1/center/student/create', validators.createStudent, validate, isCenterAuthenticated, studentServices.createStudent)
router.post('/v1/center/student/update', validators.updateStudent, validate, isCenterAuthenticated, studentServices.updateStudent)
router.post('/v1/center/student/delete', validators.deleteStudent, validate, isCenterAuthenticated, studentServices.deleteStudent)

module.exports = router
