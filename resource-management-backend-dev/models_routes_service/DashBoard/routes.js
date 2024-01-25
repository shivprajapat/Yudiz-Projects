const router = require('express').Router()
const DashBoard = require('./services')
const { setLanguage, isAuthenticated, isAuthorized, isOtherPermission } = require('../../middlewares/middleware')
const validators = require('./validators')

router.use(setLanguage, isAuthenticated, isOtherPermission)
  .get('/dashboard/monthlyProjects/v1', isAuthorized('VIEW_DASHBOARD_MONTHLY_CHART'), DashBoard.monthlyProjects)
  .get('/dashboard/latestProjects/v1', isAuthorized('VIEW_DASHBOARD_LATEST_PROJECTS'), DashBoard.latestProjects)
  .get('/dashboard/employeeWithProjectNotCompletedOrCancelled/v1', isAuthorized('VIEW_DASHBOARD_FREE_RESOURCES'), DashBoard.freeResource2)
  .get('/dashboard/v1', isAuthorized('VIEW_DASHBOARD_STATISTICS'), DashBoard.getDetails)
  .get('/indicator/project/v1', isAuthorized('VIEW_PROJECT_OVERVIEW'), DashBoard.projectIndicator)
  .get('/indicator/cr/v1', isAuthorized('VIEW_DASHBOARD'), DashBoard.crIndicator)
  .put('/dashboard/projectStatus/:id/v1', isAuthorized('UPDATE_PROJECT'), validators.updateProjectStatus, DashBoard.updateProjectStatus)
  .get('/dashboard/projectLine/v1', isAuthorized('VIEW_DASHBOARD_PROJECT_LINE'), DashBoard.projectsNearToEnd)
  .get('/dashboardProjectYears/v1', isAuthorized('VIEW_DASHBOARD_MONTHLY_CHART'), DashBoard.dashboardProjectYears)

module.exports = router
