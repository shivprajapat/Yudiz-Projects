const router = require('express').Router()
const counsellorAvailServices = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/sessions', isAdminAuthenticated, counsellorAvailServices.getAllCounsellorSessions)
router.post('/v1/admin/session', isAdminAuthenticated, validators.sessionDetail, validate, counsellorAvailServices.getSessionDetailById)

module.exports = router
