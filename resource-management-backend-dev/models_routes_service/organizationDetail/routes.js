const router = require('express').Router()
const organizationDetailServices = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const validator = require('./validator')

router.use(setLanguage, isAuthenticated)
  .post('/organizationDetails/v1', isAuthorized('CREATE_ORGANIZATION_DETAILS'),
    validator.organizationDetailCheck
    , organizationDetailServices.addOrganizationDetails)
  .put('/organizationDetails/:id/v1', isAuthorized('UPDATE_ORGANIZATION_DETAILS'),
    validator.organizationDetailCheckUpdate
    , organizationDetailServices.updateOrganizationDetails)
  .get('/organizationDetails/v1', isAuthorized('VIEW_ORGANIZATION_DETAILS'), organizationDetailServices.getOrganizationDetails)
  .post('/organizationDetails/pre-signed-url/v1', isAuthorized('CREATE_ORGANIZATION_DETAILS'), validator.preSignedUrlValidate, organizationDetailServices.getSignedUrl)

module.exports = router
