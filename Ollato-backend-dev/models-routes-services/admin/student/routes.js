const router = require('express').Router()
const studentServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/student/get-by-id', validators.singleStudent, validate, isAdminAuthenticated, studentServices.getStudentById)
router.post('/v1/admin/student/get-all', validators.getAllStudent, validate, isAdminAuthenticated, studentServices.getAll)
router.post('/v1/admin/student/create', validators.createStudent, validate, isAdminAuthenticated, studentServices.createStudent)
router.post('/v1/admin/student/update', validators.updateStudent, validate, isAdminAuthenticated, studentServices.updateStudent)
router.post('/v1/admin/student/delete', validators.deleteStudent, validate, isAdminAuthenticated, studentServices.deleteStudent)

module.exports = router
