const router = require('express').Router()
const ProjectTagService = require('./services')
const validators = require('./validators')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')

router
  .use(setLanguage, isAuthenticated)
  .get('/projectTags/v1', ProjectTagService.getProjectTags)
  .post('/projectTags/v1', isAuthorized('CREATE_PROJECT_TAG'), validators.projectTagCheckV1, validate, ProjectTagService.addProjectTag)
  .delete('/projectTags/:id/v1', isAuthorized('DELETE_PROJECT_TAG'), validators.projectTagCheckIdV1, validate, ProjectTagService.deleteProjectTags)
  .patch('/projectTags/:id/v1', isAuthorized('UPDATE_PROJECT_TAG'), validators.updateProjectTagsCheckV1, validate, ProjectTagService.updateProjectTags)
module.exports = router
