const router = require('express').Router()
const LeaderBoardServices = require('./services')
const { isUserAuthenticated, validateAdmin, validate } = require('../../middlewares/middleware')
const { cacheRoute } = require('../../helper/redis')
const { limitVaidator } = require('./validators')

router.get('/user/leaderboard/my-teams/:id/v2', isUserAuthenticated, LeaderBoardServices.userTeamListV2)

router.get('/user/leaderboard/list/:id/v2', limitVaidator, validate, cacheRoute(5), LeaderBoardServices.allTeamListV2)

router.get('/admin/leaderboard/list/:id/v1', limitVaidator, validateAdmin('LEADERSHIP_BOARD', 'R'), cacheRoute(5), LeaderBoardServices.adminTeamList)

module.exports = router
