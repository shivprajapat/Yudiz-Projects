// @ts-check
const router = require('express').Router()
const { validateAdmin } = require('../../../middleware/middleware')
const subAdminControllers = require('./controllers')
const validators = require('./validators')

router.get('/admin/sub-admin/list', validateAdmin('SUBADMIN', 'R'), subAdminControllers.list)
router.get('/admin/sub-admin/:id', validateAdmin('SUBADMIN', 'R'), subAdminControllers.get)
router.put('/admin/sub-admin/:id', validateAdmin('SUBADMIN', 'W'), validators.updateSubAdmin, subAdminControllers.updateSubAdmin)
router.get('/admin/sub-admin-ids', validateAdmin('SUBADMIN', 'R'), subAdminControllers.getAdminIds)

module.exports = router
