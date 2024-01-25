const router = require('express').Router()
const Service = require('./services')
const validators = require('./validators')
const { validate, isAuthenticated, setLanguage } = require('../../middlewares/middleware')

router
  .post('/filterInterview/v1', setLanguage, isAuthenticated, Service.filterInterview)
// employee and project list
  .get('/employeeList/v1', setLanguage, isAuthenticated, Service.employeeList)
  .get('/projectList/v1', setLanguage, isAuthenticated, Service.ProjectList)
// Get Interview details
  .get('/interviews/v1', setLanguage, isAuthenticated, Service.interviewSearch)
  .get('/interview/:id/v1', setLanguage, isAuthenticated, Service.interviewFind)
// create Interview
  .post('/availabilityHours/v1', validators.createInterviewCheckV1, validate, isAuthenticated, Service.availabilityHours)
  .post('/addInterview/v1', validators.createInterviewCheckV1, validate, isAuthenticated, Service.addInterviews)
// update Interview and update feedback
  .put('/updateFeedback/:id/v1', validate, isAuthenticated, Service.updateFeedBack)
  .put('/updateInterviews/:id/v1', validators.updateInterviewCheckV1, validate, isAuthenticated, Service.updateInterviews)
// Delete Interview
  .delete('/interview/:id/v1', validators.interviewDelete, validate, isAuthenticated, Service.deleteInterviews)
// Employee Interviews
  .get('/employeeInterviews/:id/v1', validate, isAuthenticated, Service.employeeInterviews)

module.exports = router
