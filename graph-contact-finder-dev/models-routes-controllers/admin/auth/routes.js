// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const adminAuthControllers = require('./controllers')
const { validateAdmin, validation, verifyIsAdminLoggedIn } = require('../../../middleware/middleware')

router.post('/admin/auth/login', validators.login, validation, adminAuthControllers.login)
router.post('/admin/auth/sub-admin', validateAdmin('SUBADMIN', 'W'), validators.createSubAdmin, validation, adminAuthControllers.createSubAdmin)
router.put('/admin/auth/logout', verifyIsAdminLoggedIn, adminAuthControllers.logout)
router.get('/admin/auth/create', adminAuthControllers.createAdmin)

module.exports = router
