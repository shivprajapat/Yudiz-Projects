const router = require('express').Router()
const userAuthServices = require('./services')
const { validateAdmin } = require('../../../middlewares/middleware')
const { cacheRoute } = require('../../../helper/redis')

router.get('/admin/statistics/:id/v1', validateAdmin('STATISTICS', 'R'), userAuthServices.get)
router.post('/admin/leadership-board/v2', validateAdmin('LEADERSHIP_BOARD', 'W'), userAuthServices.calculateLeaderShipboardV2)

router.get('/admin/leadership-board/v2', validateAdmin('LEADERSHIP_BOARD', 'R'), userAuthServices.getLeaderShipboardV2)

router.post('/admin/leadership-board-add-season/v1', validateAdmin('LEADERSHIP_BOARD', 'W'), userAuthServices.addSeasonInLeadership)

router.get('/admin/system-user/statistics/:id/v1', validateAdmin('SYSTEM_USERS', 'R'), userAuthServices.get)

router.get('/user/leadership-board/v2', cacheRoute(60), userAuthServices.getLeaderShipboardV2)

router.get('/user/profile-statistics/:id/v1', cacheRoute(60), userAuthServices.getProfileStatistics)

module.exports = router
