const router = require('express').Router()
const userTeamServices = require('./services')
const dreamTeamService = require('./dreamTeam')
const pdService = require('./pd')
const validators = require('./validators')
const { validateAdmin, isUserAuthenticated, isSystemUserAuthenticated } = require('../../middlewares/middleware')
const { cacheRoute } = require('../../helper/redis')

router.post('/user/user-team/v3', validators.addUserTeamV3, isUserAuthenticated, userTeamServices.addV3)
router.post('/user/system-user-team/v2', validators.addUserTeamV3, isSystemUserAuthenticated, userTeamServices.addV3)

router.put('/user/user-team/:id/v3', validators.updateUserTeamV3, isUserAuthenticated, userTeamServices.updateV3)

router.get('/user/user-team/teams/:id/v3', isUserAuthenticated, userTeamServices.userTeamsV3)
router.get('/user/user-team/team-player-leaderboard/:iUserTeamId/v2', isUserAuthenticated, userTeamServices.userTeamPlayersForLeaderBoardV2) // Get all player's details in team by userTeamId ( used in native app )

router.get('/user/user-team/team-player-leaderboard/:iUserLeagueId/v3', isUserAuthenticated, userTeamServices.userTeamPlayersForLeaderBoardV3) // Get all player's details in team by userLeagueId with rank, sProPic, sUserName

router.get('/user/user-team-unique-players/:id/v1', isUserAuthenticated, userTeamServices.userUniqueTeamPlayers)
router.get('/user/user-team-unique-players-league/:id/v2', isUserAuthenticated, userTeamServices.userUniqueTeamPlayersLeagueV2)
router.get('/user/user-team-count/:id/v1', isUserAuthenticated, userTeamServices.userTeamCount)
router.get('/user/dream-team/:id/v1', cacheRoute(10), dreamTeamService.fetchDreamTeam)

// admin
router.get('/admin/user-team/score/:id/v1', validateAdmin('USERTEAM', 'R'), pdService.generateUserTeamScore)
router.get('/admin/user-team/rank/:id/v1', validateAdmin('USERTEAM', 'R'), pdService.generateUserTeamRank)
router.get('/admin/user-team/price-distribution/:id/v1', validateAdmin('USERTEAM', 'R'), pdService.prizeDistribution)
router.get('/admin/user-team/list/:id/v1', validators.list, validateAdmin('USERTEAM', 'R'), userTeamServices.list)

router.get('/admin/user-team/team-player/:id/v2', validateAdmin('USERTEAM', 'R'), userTeamServices.userTeamPlayersAdminV2)
router.get('/admin/copy-user-team/team-player/v1', validateAdmin('USERTEAM', 'R'), userTeamServices.userCopyTeams)

router.get('/admin/user-team/win-price-distribution/:id/v1', validateAdmin('USERTEAM', 'R'), pdService.winDistributionByLeague)
router.get('/admin/user-team-win-return/:id/v1', validateAdmin('USERTEAM', 'W'), pdService.winReturn)

router.post('/admin/user-team/v1', validators.matchWiseUserTeamList, validateAdmin('USERTEAM', 'R'), userTeamServices.matchWiseUserTeamList)

router.get('/admin/dream-team/:id/v1', validateAdmin('TEAM', 'R'), dreamTeamService.fetchDreamTeam)
router.post('/admin/dream-team/:id/v1', validateAdmin('TEAM', 'W'), dreamTeamService.createDreamTeam)

// pass Match Id in :id of api
router.get('/admin/user-team/base-team-list/:id/v1', validators.baseTeamList, validateAdmin('USERTEAM', 'R'), userTeamServices.baseTeamList)

module.exports = router
