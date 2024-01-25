const router = require('express').Router()
const jobProfileService = require('./services')
const validators = require('./validators')
const { validate, setLanguage, isAuthenticated, paginationValue, isAuthorized } = require('../../middlewares/middleware')

router.use(setLanguage, isAuthenticated)
  .get('/job-profile/v1', isAuthorized('VIEW_JOB_PROFILE'), jobProfileService.getJobProfiles)
  .post('/job-profile/v1', isAuthorized('CREATE_JOB_PROFILE'), validators.jobProfileCheckV1, validate, jobProfileService.addJobProfiles)
  .delete('/job-profile/:id/v1', isAuthorized('DELETE_JOB_PROFILE'), validators.jobProfileCheckIdV1, validate, jobProfileService.deleteJobProfiles)
  .put('/job-profile/:id/v1', isAuthorized('UPDATE_JOB_PROFILE'), validators.updateJobProfilesCheckV1, validate, jobProfileService.updateJobProfiles)
  .get('/job-profile/employee/v1', isAuthorized('VIEW_JOB_PROFILE'), paginationValue, jobProfileService.getJobProfilesByflag)
  .get('/getBaEmployee/v1', jobProfileService.getBaEmployee)
  .get('/getBdeEmployee/v1', jobProfileService.getBdeEmployee)
  .get('/getPmEmployee/v1', jobProfileService.getPmEmployee)
  .get('/job-profile/:id/v1', isAuthorized('VIEW_JOB_PROFILE'), validators.jobProfileCheckIdV1, validate, jobProfileService.getJobProfileById)

module.exports = router
