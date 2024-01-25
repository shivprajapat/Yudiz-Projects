const router = require('express').Router()
const technologyService = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const validators = require('./validators')

router
  .use(setLanguage, isAuthenticated)
  .post('/technologies/v1', isAuthorized('CREATE_TECHNOLOGY'), validators.technologyCheckV1, validate, technologyService.addTechnology)
  .delete('/technologies/:id/v1', isAuthorized('DELETE_TECHNOLOGY'), validators.technologyCheckIdV1, validate, technologyService.deleteTechnologies)
  .put('/technologies/:id/v1', isAuthorized('UPDATE_TECHNOLOGY'), validators.updateTechnologyCheckV1, validate, technologyService.updateTechnologies)
  .get('/technologies/v1', isAuthorized('VIEW_TECHNOLOGY'), validate, technologyService.search)
  .get('/technologies/:id/v1', isAuthorized('VIEW_TECHNOLOGY'), validators.technologyCheckIdV1, technologyService.getTechnologyById)
  .post('/technologies/pre-signed-url/v1', isAuthorized('CREATE_TECHNOLOGY'), validators.preSignedUrlValidate, technologyService.getSignedUrl)

module.exports = router
