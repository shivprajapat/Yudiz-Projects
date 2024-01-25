// @ts-check
const router = require('express').Router()
const { validateAdmin, validation } = require('../../../middleware/middleware')
const validators = require('./validators')
const permissionControllers = require('./controllers')

router.post('/admin/permission', validateAdmin('PERMISSION', 'W'), validators.permissionAdd, validation, permissionControllers.addPermission)
router.get('/admin/permission', validateAdmin('PERMISSION', 'R'), permissionControllers.list)
router.get('/admin/permission/list', validateAdmin('PERMISSION', 'R'), permissionControllers.adminList)
router.get('/admin/permission/:id', validateAdmin('PERMISSION', 'R'), permissionControllers.get)
router.put('/admin/permission/:id', validateAdmin('PERMISSION', 'W'), validators.permissionUpdate, validation, permissionControllers.update)

module.exports = router
