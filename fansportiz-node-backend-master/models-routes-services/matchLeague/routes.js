const router = require('express').Router()
const matchLeagueServices = require('./services')
const validators = require('./validators')
const { validateAdmin } = require('../../middlewares/middleware')
const { cacheRoute } = require('../../helper/redis')

router.get('/user/match-league/:id/list/v2', cacheRoute(2), matchLeagueServices.upComingLeagueListV2)

router.get('/user/match-league/:id/v1', cacheRoute(5), matchLeagueServices.leagueInfo)

// admin
router.post('/admin/match-league/v2', validators.adminAddMatchLeagueV2, validateAdmin('MATCHLEAGUE', 'W'), matchLeagueServices.addV2)

router.get('/admin/match-league/:id/v1', validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.get)
router.get('/admin/single-match-league/:id/v1', validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.getSingleLeague)
router.get('/admin/upcoming-match-league/:id/v1', validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.getUpcomingLeague)

router.get('/admin/match-league/:id/cashback-details/v2', validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.cashbackDetailsV2)

router.get('/admin/check-fair-play/:id/v1', validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.checkFairPlayDetails)

router.get('/admin/final-league-count/:id/v1', validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.getFinalLeagueCount)

router.get('/admin/match-league/:id/list/v1', validators.list, validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.list)
router.get('/admin/match-league/:id/report/v1', validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.leagueReport)
router.get('/admin/match-league/:id/get-process-count/v1', validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.getProcessedCount)

router.put('/admin/match-league/:id/cancel/v1', validateAdmin('MATCHLEAGUE', 'W'), matchLeagueServices.cancelMatchLeague.bind(matchLeagueServices))
router.put('/admin/match-league/bot-create/:id/v1', validators.adminBotCreate, validateAdmin('MATCHLEAGUE', 'W'), matchLeagueServices.botCreateUpdate)

router.put('/admin/match-league/:id/copy-bot/v1', validateAdmin('MATCHLEAGUE', 'W'), matchLeagueServices.updateCopyBotCreation)

router.get('/admin/match-league/:id/promo-usage/v1', validators.list, validateAdmin('MATCHLEAGUE', 'R'), matchLeagueServices.getPromoUsage)

module.exports = router
