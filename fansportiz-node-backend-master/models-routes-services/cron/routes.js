const router = require('express').Router()
const cronServices = require('./services')
const { validate, isCronAuthenticated, validateAdmin } = require('../../middlewares/middleware')
const validators = require('./validators')

router.post('/admin/cron/v1', isCronAuthenticated, cronServices.calculateMatchPlayerSetBy)

router.post('/admin/cron/match-live/v1', isCronAuthenticated, cronServices.matchLive.bind(cronServices))

router.post('/admin/cron/bonus-expire/v1', isCronAuthenticated, cronServices.bonusExpire)

router.post('/admin/cron/birthday-bonus/v1', isCronAuthenticated, cronServices.provideBirthdayBonus)

router.get('/admin/cron/leaderboard/v1', isCronAuthenticated, cronServices.liveLeaderboard)

router.get('/admin/cron/load-leaderboard/v1', validators.loadLeaderboard, validate, isCronAuthenticated, cronServices.loadLeaderboard.bind(cronServices))

// used in admin panel
router.get('/admin/cron/load-leaderboard/v2', validators.loadLeaderboard, validate, validateAdmin('LEADERSHIP_BOARD', 'R'), cronServices.loadLeaderboard.bind(cronServices))

router.get('/admin/cron/calculate-season-point/v1', isCronAuthenticated, cronServices.calculateSeasonPoint)

// remove pending matches(30 day old and team must not formed) time : run daily(once in a day)
router.get('/admin/cron/remove-pending-matches/v1', isCronAuthenticated, cronServices.removePendingMatches)

// Last Pending Deposit Payment processing every 10 minutes...
router.get('/admin/cron/process-playreturn/v1', isCronAuthenticated, cronServices.processPlayReturn)

// Fix transactions mismatch script for cron
router.get('/admin/cron/fix-statistics/v1', isCronAuthenticated, cronServices.fixStatistics)

router.get('/admin/cron/check-live-leagues/v1', isCronAuthenticated, cronServices.checkLiveLeagues)

// Future upcoming/pending matches data update at every 30 mins.
router.get('/admin/cron/update-match-data/v1', isCronAuthenticated, cronServices.updateMatchData)

// It'll remove api logs for old win distributed matches every week
router.get('/admin/cron/remove-old-apilogs/v1', isCronAuthenticated, cronServices.removeOldApiLogs)

// Fetch Playing11 for match only for ENTITYSPORT

router.get('/admin/cron/match-player/entity-playing-eleven/v1', isCronAuthenticated, cronServices.fetchEntitySportLineUpsPlayer)

router.get('/admin/cron/match-player/radar-playing-eleven/v1', isCronAuthenticated, cronServices.fetchSportradarLineUpsPlayer)

router.get('/admin/cron/prepare-autofill-matchleagues/v1', isCronAuthenticated, cronServices.prepareAutoFillMatchLeagues)

router.get('/admin/cron/start-autofill-matchleagues/v1', isCronAuthenticated, cronServices.autoFillMatchleagues)

// Will stop sending push notification when user's jwt token will get expired
router.get('/admin/cron/remove-push-notification-on-jwtex/v1', isCronAuthenticated, cronServices.removePushNotificationOnJWTEx)

// It'll remove bots related logs older than 2 months
router.get('/admin/cron/backup-old-botlogs/v1', isCronAuthenticated, cronServices.backupOldBotLogs)

router.get('/admin/cron/backup-old-botlogs/v1', isCronAuthenticated, cronServices.backupOldBotLogs)

router.get('/admin/cron/backup-matchteams/v1', isCronAuthenticated, cronServices.backupMatchTeams)

// It will add system bots inside Set of REDIS after every 6 Hours
router.get('/admin/cron/fill-system-users/v1', isCronAuthenticated, cronServices.fillSetOfSystemUsers)

module.exports = router
