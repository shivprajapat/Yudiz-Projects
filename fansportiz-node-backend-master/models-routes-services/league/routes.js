const router = require('express').Router()
const leagueServices = require('./services')
const validators = require('./validators')
const { validateAdmin } = require('../../middlewares/middleware')

router.post('/admin/league/v1', validators.adminAddLeague, validateAdmin('LEAGUE', 'W'), leagueServices.add)
router.get('/admin/league/v1', validators.adminLeagueList, validateAdmin('LEAGUE', 'R'), leagueServices.leagueList)
router.get('/admin/league/full-list/v2', validators.fullLeagueListV2, validateAdmin('LEAGUE', 'R'), leagueServices.fullLeagueListV2)
router.get('/admin/league/list/v1', validators.adminLeagueList, validateAdmin('LEAGUE', 'R'), leagueServices.list)
router.get('/admin/league/:id/v1', validateAdmin('LEAGUE', 'R'), leagueServices.get)
router.put('/admin/league/:id/v1', validators.adminUpdateLeague, validateAdmin('LEAGUE', 'W'), leagueServices.update)
router.delete('/admin/league/:id/v1', validateAdmin('LEAGUE', 'W'), leagueServices.remove)
router.post('/admin/league/copy/:id/v1', validators.adminCopyLeague, validateAdmin('LEAGUE', 'W'), leagueServices.copyLeague)

router.post('/admin/league/pre-signed-url/v1', validators.adminGetLeagueSignedUrl, validateAdmin('LEAGUE', 'W'), leagueServices.getSignedUrl)
router.post('/admin/league/:id/prize-breakup/v1', validators.adminAddPrizeBreakup, validateAdmin('LEAGUE', 'W'), leagueServices.addPrizeBreakup)
router.get('/admin/league/:id/prize-breakup/v1', validateAdmin('LEAGUE', 'R'), leagueServices.listPrizeBreakup)
router.get('/admin/league/:id/prize-breakup/:pid/v1', validateAdmin('LEAGUE', 'R'), leagueServices.getPrizeBreakup)
router.put('/admin/league/:id/prize-breakup/:pid/v1', validators.adminUpdatePrizeBreakup, validateAdmin('LEAGUE', 'W'), leagueServices.updatePrizeBreakup)
router.delete('/admin/league/:id/prize-breakup/:pid/v1', validateAdmin('LEAGUE', 'W'), leagueServices.removePrizeBreakup)
router.get('/admin/league/:id/analytics/v1', validators.analytics, validateAdmin('LEAGUE', 'R'), leagueServices.leagueAnalytics)

module.exports = router
