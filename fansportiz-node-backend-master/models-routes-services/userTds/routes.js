const router = require('express').Router()
const { validateAdmin } = require('../../middlewares/middleware')
const tdsServises = require('./services')
const validators = require('./validators')

router.get('/admin/tds/list/v1', validators.limitValidator, validateAdmin('TDS', 'R'), tdsServises.adminList)
router.put('/admin/tds/:id/v1', validators.adminUpdateTdsValidator, validateAdmin('TDS', 'W'), tdsServises.update)
router.get('/admin/tds/counts/v1', validateAdmin('TDS', 'R'), tdsServises.getCounts)
router.get('/admin/tds/match-league-tds/:id/v1', validators.limitValidator, validateAdmin('TDS', 'R'), tdsServises.matchLeagueTdsList)
router.get('/admin/tds/match-league-tds/count/:id/v1', validateAdmin('TDS', 'R'), tdsServises.matchLeagueTdsCount)

module.exports = router
