const router = require('express').Router()
const clientService = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const validators = require('./validators')

router.use(setLanguage, isAuthenticated)
  .get('/clients/v1', isAuthorized('VIEW_CLIENT'), clientService.getClients)
  .get('/client/:id/v1', isAuthorized('VIEW_CLIENT'), validators.clientCheckIdV1, validate, clientService.getClient)
  .post('/client/v1', isAuthorized('CREATE_CLIENT'), validators.clientCheckV1, validate, clientService.addClients)
  .delete('/client/:id/v1', isAuthorized('DELETE_CLIENT'), validators.clientCheckIdV1, validate, clientService.deleteClients)
  .put('/client/:id/v1', isAuthorized('UPDATE_CLIENT'), validators.updateClientsCheckV1, validate, clientService.updateClients)
  .get('/client/:id/projects', isAuthorized('VIEW_CLIENT'), validators.clientCheckIdV1, validate, clientService.getClientProjects)
module.exports = router
