
const router = require('express').Router()
const currencyService = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const { currencyCheckV1, currencyCheckIdV1 } = require('./validators')

router
  .use(setLanguage, isAuthenticated)
  .post('/globcurrency/v1', isAuthorized('CREATE_CURRENCY'), currencyCheckV1, validate, currencyService.addCurrency)
  .get('/globcurrency/:id/v1', isAuthorized('VIEW_CURRENCY'), currencyCheckIdV1, validate, currencyService.getCurrency)
  .delete('/globcurrency/:id/v1', isAuthorized('DELETE_CURRENCY'), currencyCheckIdV1, validate, currencyService.deleteCurrency)
  .get('/globcurrency/v1', isAuthorized('VIEW_CURRENCY'), validate, currencyService.search)
  .get('/globcurrency/currency/v1', isAuthorized('VIEW_CURRENCY'), validate, currencyService.getCurrencies)

module.exports = router
