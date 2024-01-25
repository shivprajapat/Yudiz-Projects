const router = require('express').Router()
const permissionService = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const validators = require('./validators')

router.use(setLanguage, isAuthenticated)
  .post('/permission/v1', isAuthorized('CREATE_PERMISSION'), validators.permissionCheckV1, validate, permissionService.addPermission) // add global permission
  .delete('/permission/:id/v1', isAuthorized('DELETE_PERMISSION'), validators.permissionCheckIdV1, validate, permissionService.deletePermission) // delete global permission
  .put('/permission/:id/v1', isAuthorized('UPDATE_PERMISSION'), validators.updatePermissionsCheckV1, validate, permissionService.updatePermission) // update Permission
  .get('/permission/v1', permissionService.getPermissions) // get all permission isAuthorized('VIEW_PERMISSION')
  .put('/updatePermissions/v1', isAuthorized('UPDATE_PERMISSION'), permissionService.updatePermissions) // update permission
  .put('/updateUserPermission/v1', isAuthorized('UPDATE_PERMISSION'), permissionService.updateUserPermission) // update user permission

module.exports = router
