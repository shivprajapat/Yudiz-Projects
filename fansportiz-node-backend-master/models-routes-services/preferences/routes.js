const router = require('express').Router()
const preferenceServices = require('./services')
const { isUserAuthenticated, validateAdmin } = require('../../middlewares/middleware')

// removed add preference route adding at when user register

router.put('/admin/preferences/:id/v1', validateAdmin('PREFERENCES', 'W'), preferenceServices.update)
router.get('/admin/preferences/:id/v1', validateAdmin('PREFERENCES', 'R'), preferenceServices.get)

router.get('/user/preferences/v1', isUserAuthenticated, preferenceServices.get)
router.put('/user/preferences/v1', isUserAuthenticated, preferenceServices.update)

module.exports = router
