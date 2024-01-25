const router = require('express').Router()
const roleService = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const validators = require('./validators')

router.use(setLanguage, isAuthenticated)
  .post('/role/v1', isAuthorized('CREATE_ROLE'), validators.roleCheckV1, validate, roleService.addRole)
  .delete('/role/:id/v1', isAuthorized('DELETE_ROLE'), validators.roleCheckIdV1, validate, roleService.deleteRole)
  .put('/role/:id/v1', isAuthorized('UPDATE_ROLE'), validators.updateRolesCheckV1, validate, roleService.updateRole)
  .get('/role/v1', isAuthorized('VIEW_ROLE'), roleService.getRoles)
  // .post('/updateRoles', setLanguage, isAuthenticated, roleService.updateRoles)

module.exports = router
