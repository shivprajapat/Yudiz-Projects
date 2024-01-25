const router = require('express').Router()
const scorecardServices = require('./services/scorecard')
const statisticsServices = require('./services/statistics')
const matchService = require('./services/match')
const viewcountServices = require('./services/viewcount')
const mediaServices = require('./services/media')
const commentaryServices = require('./services/commentary')
const tagServices = require('./services/tag')
const playerService = require('./services/player')
const teamService = require('./services/team')
const fantasyArticlesService = require('./services/fantasyarticles')
const extraService = require('./services/extra')
const seriesService = require('./services/series')

router.put('/mini-scorecard', scorecardServices.storeMiniScorecard)
// router.put('/live-scorecard', scorecardServices.updateMiniScorecard)
router.put('/match-info', scorecardServices.updateMatchInfo.bind(scorecardServices))
router.put('/full-scorecard', scorecardServices.updateFullScorecard)
router.put('/after-match-info', scorecardServices.updateAfterMatchInfo)
router.get('/matches', scorecardServices.getMatches) // No Cron
router.get('/series-mini-scorecard/:iSeriesId', scorecardServices.getSeriesMiniScorecard) // No Cron
router.put('/add-new-fields', scorecardServices.addNewFields)

router.put('/series-statistics-types', statisticsServices.updateTypes)
router.put('/series-statistics', statisticsServices.update)
router.put('/match', matchService.fetchMatch)
router.put('/teams', matchService.fetchTeams)
// router.put('/update-teams', matchService.updateTeams)
router.put('/players', matchService.fetchPlayers)
router.get('/match-squad/:iMatchId?', matchService.fetchMatchSquad)
router.put('/match-squad/series', matchService.fetchMatchSquadBySeries)
router.put('/fix-match-squad', scorecardServices.fixMissingSquads)
router.put('/series-squad', matchService.fetchSeriesSquad)
router.put('/series-status', matchService.updateSeriesStatus)
router.put('/series-standing', matchService.updateSeriesStanding)
router.put('/past-upcoming', matchService.updatePastUpcomingMatches)
router.put('/update-player-gender', matchService.updatePlayerGender)
router.put('/missed-matches', matchService.getMissingMatches)
router.put('/missed-series', matchService.getMissingSeries)
router.put('/check-slugs', matchService.checkAllSlugs)
router.put('/update-series', matchService.updateSeries)

router.get('/viewcount/redis-to-fantasyarticle', viewcountServices.updateFantasyArticleViewcount)
router.get('/s3-image-upload', mediaServices.uploadImage)

router.put('/commentaries', commentaryServices.updateCommentary)
router.put('/check-commentaries', commentaryServices.checkCommentries)
router.delete('/duplicate-commentaries', commentaryServices.removeDuplicate)

// for tag service checking if player, team or venue exists
router.get('/checkIdExist', tagServices.checkIdExist)
router.put('/updateSlugs', matchService.updateMatchSlug)
router.put('/get-player', playerService.getPlayer)
router.post('/script/add-player-stats', playerService.addPlayerStats)
router.put('/get-team', teamService.getTeam)

router.put('/fantasy-article-feed', fantasyArticlesService.fantasyArticleFeed)
router.get('/ping', extraService.ping)
router.put('/update-team', teamService.updateTeam)

// for update player stats
router.put('/update-player-stats', matchService.updatePlayerStats)

router.get('/ping', extraService.ping)
router.put('/declareoverses-player', matchService.declareOversesPlayer)

router.put('/gen-amp-sign', extraService.invalidateCache)
router.put('/add-lat-long', extraService.addLongLat)

router.put('/update-s3-url', teamService.updateS3Url)

router.post('/series-category-operations', seriesService.seriesCategoryOperations)
router.put('/fix-match-squad', scorecardServices.fixMissingSquads)
router.post('/upload-s3image', playerService.uploadImageFromLocal)
router.post('/upload-team-jersey', teamService.uploadImageFromLocal)
router.post('/upload-team-flags', teamService.uploadTeamFlagsFromLocal)
router.put('/team-league-status', teamService.updateLeagueStatus)
router.post('/add-primaryTeam', teamService.addPrimaryTeam)

router.all('*', (req, res) => {
  return res.status(400).jsonp({
    status: 400,
    messages: 'Bad Route'
  })
})
module.exports = router
