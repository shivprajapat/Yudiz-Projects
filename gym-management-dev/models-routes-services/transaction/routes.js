const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized, checkRouteRateLimitStatus } = require('../../middlewares/middleware')
const services = require('./services')

router.put('/add', validators.addTransaction, validate, isAdminAuthorized, services.add)
router.get('/upcoming', isAdminAuthorized, services.upcomingTransaction)
router.get('/:id', validators.getTransaction, validate, isAdminAuthorized, services.get)
// router.patch('/edit/:id', validators.updateTransaction, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deleteTransaction, validate, isAdminAuthorized, services.delete)
router.get('/list/all', isAdminAuthorized, services.list)
router.post('/report', validators.transactionReport, validate, (req, res, next) => {
  const cacheKey = 'transaction:report'
  checkRouteRateLimitStatus(req, res, next, cacheKey)
}, isAdminAuthorized, services.report)
module.exports = router
