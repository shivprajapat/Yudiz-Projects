const router = require('express').Router()
const apiLogServices = require('./service')
const { validateAdmin } = require('../../middlewares/middleware')
const { limitValidator } = require('./validators')

router.get('/admin/api-logs/list/:id/v1', limitValidator, validateAdmin('MATCH', 'R'), apiLogServices.list)
router.get('/admin/api-logs/:id/v1', validateAdmin('MATCH', 'R'), apiLogServices.get)
router.get('/admin/pd-logs/:id/v1', validateAdmin('MATCHLEAGUE', 'R'), apiLogServices.getMatchLeagueLogs)
router.get('/admin/transaction-logs/:id/v1', limitValidator, validateAdmin('PASSBOOK', 'R'), apiLogServices.listTransactionLog)

module.exports = router
