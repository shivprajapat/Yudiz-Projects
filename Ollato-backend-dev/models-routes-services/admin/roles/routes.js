const router = require('express').Router()
const roleService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/roles', validators.getAllRole, validate, isAdminAuthenticated, roleService.getAllRole)
router.post('/v1/admin/modules', validators.getAllRole, validate, isAdminAuthenticated, roleService.getAllModule)
router.post('/v1/admin/role/get-role-by-id', validators.singleRole, validate, isAdminAuthenticated, roleService.getRoleById)
router.post('/v1/admin/role/create', validators.create, validate, isAdminAuthenticated, roleService.createRole)
router.post('/v1/admin/role/update', validate, isAdminAuthenticated, roleService.updateRole)
router.post('/v1/admin/role/delete', validators.deleteRole, validate, isAdminAuthenticated, roleService.deleteRole)

router.get('/v1/admin/modules/get-all-frontend', isAdminAuthenticated, roleService.getAllModulesFront) // for front end without pagination
router.get('/v1/admin/role/get-all-frontend', isAdminAuthenticated, roleService.getAllRolesFront) // for front end without pagination

module.exports = router
