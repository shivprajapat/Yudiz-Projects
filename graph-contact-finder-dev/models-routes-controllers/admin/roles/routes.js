// @ts-check
const router = require('express').Router()
const rolesControllers = require('./controllers')
const validators = require('./validators')
const { validateAdmin, validation } = require('../../../middleware/middleware')

router.post('/admin/role', validateAdmin('ADMIN_ROLE', 'W'), validators.roleAdd, validation, rolesControllers.add)
router.get('/admin/role', validateAdmin('ADMIN_ROLE', 'R'), rolesControllers.list)
router.get('/admin/role/list', validateAdmin('ADMIN_ROLE', 'R'), rolesControllers.adminList)
router.get('/admin/role/:id', validateAdmin('ADMIN_ROLE', 'R'), rolesControllers.getRole)
router.put('/admin/role/:id', validateAdmin('ADMIN_ROLE', 'W'), validators.roleUpdate, validation, rolesControllers.updateRole)
router.delete('/admin/role/:id', validateAdmin('ADMIN_ROLE', 'W'), rolesControllers.deleteRole)

module.exports = router
