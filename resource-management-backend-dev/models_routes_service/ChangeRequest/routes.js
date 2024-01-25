const router = require('express').Router()
const crService = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
// const validators = require('./validators')

router.use(setLanguage, isAuthenticated)
  .post('/cr/v1', isAuthorized('CREATE_CHANGE_REQUEST'), crService.addChangeRequest)
  .put('/cr/:id/v1', isAuthorized('UPDATE_CHANGE_REQUEST'), crService.updateChangeRequest)
  .delete('/cr/:id/v1', isAuthorized('DELETE_CHANGE_REQUEST'), crService.deleteChangeRequest)
  .get('/cr/v1', isAuthorized('VIEW_CHANGE_REQUEST'), crService.getChangeRequest)
  .get('/cr/:id/v1', isAuthorized('VIEW_CHANGE_REQUEST'), crService.getChangeRequestById)
  .get('/changerequest/:id/v1', isAuthorized('VIEW_CHANGE_REQUEST'), crService.getChangeRequestByCrId)
  .get('/projectcrs/:id/v1', isAuthorized('VIEW_CHANGE_REQUEST'), crService.getProjectCrs)// not in use
  .put('/updateCrDepartment/v1', isAuthorized('UPDATE_CHANGE_REQUEST'), crService.updateCrdepartment)// not in use
  .post('/addCrDepartment/v1', isAuthorized('UPDATE_CHANGE_REQUEST'), crService.addCrDepartment)// not in use
  .delete('/deleteProjectDepartment/v1', isAuthorized('UPDATE_CHANGE_REQUEST'), crService.deleteCrdepartments)// not in use
  .post('/addCrEmployee/v1', isAuthorized('UPDATE_CHANGE_REQUEST'), crService.addCrEmployee)// not in use
  .delete('/deleteCrEmployee/v1', isAuthorized('UPDATE_CHANGE_REQUEST'), crService.deleteCrEmployee)// not in use
  .put('/updateCrDepartments/:iCrId/v1', isAuthorized('UPDATE_CHANGE_REQUEST'), crService.updateCrdepartments)// not in use
  .get('/etc', crService.etc)// not in use

module.exports = router
