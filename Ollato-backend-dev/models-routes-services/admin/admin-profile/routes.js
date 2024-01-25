const router = require('express').Router()
const adminServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.get('/v1/admin/admin-profile', isAdminAuthenticated, adminServices.getAdminProfile)

router.post('/v1/admin/admin-profile/update', validators.updateAdmin, validate, isAdminAuthenticated, adminServices.updateAdminProfile)

module.exports = router
