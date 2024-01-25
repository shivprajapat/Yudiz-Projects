const router = require('express').Router()
const orgbranchServices = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const validator = require('./validators')

router.use(setLanguage, isAuthenticated)
  .post('/orgbranch/v1', isAuthorized('CREATE_ORGANIZATION_BRANCH'), validator.organizationBranchDetailCheck, orgbranchServices.addOrganizationBranchDetails)
  .put('/orgbranch/:id/v1', isAuthorized('UPDATE_ORGANIZATION_BRANCH'), validator.organizationBranchDetailCheckUpdate, orgbranchServices.updateOrganizationBranchDetails)
  .get('/orgbranch/v1', isAuthorized('VIEW_ORGANIZATION_BRANCH'), orgbranchServices.getOrganizationBranchDetails)
  .get('/orgbranch/:id/v1', isAuthorized('VIEW_ORGANIZATION_BRANCH'), orgbranchServices.getOrganizationBranchDetailsById)
  .delete('/orgbranch/:id/v1', isAuthorized('DELETE_ORGANIZATION_BRANCH'), validator.organizationBranchDetailCheckDelete, orgbranchServices.deleteOrganizationBranchDetailsById)
  .get('/countries/v1', orgbranchServices.getCountryDetails)
  .get('/states/v1', orgbranchServices.getStateDetails)
  .get('/cities/v1', orgbranchServices.getCityDetails)

module.exports = router
