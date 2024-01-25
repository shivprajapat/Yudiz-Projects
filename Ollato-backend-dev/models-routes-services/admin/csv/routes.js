const router = require('express').Router()
const AdminServices = require('./services')
const { validate } = require('../../../middlewares/middleware')
const validators = require('./validators')
const { isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/csv-center', validators.duration, validate, isAdminAuthenticated, AdminServices.csvCenter)
router.post('/v1/admin/csv-student', validators.duration, validate, isAdminAuthenticated, AdminServices.csvStudent)
router.post('/v1/admin/csv-counsellor', validators.duration, validate, isAdminAuthenticated, AdminServices.csvCounsellor)

module.exports = router
