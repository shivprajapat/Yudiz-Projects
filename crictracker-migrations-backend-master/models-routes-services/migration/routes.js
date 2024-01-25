const migrationService = require('./services')
const extraServices = require('./extra')
const { updateMatchesSeo, matchesWithoutSlug } = require('../common')
// const { body } = require('express-validator')

module.exports = (router) => {
  router.get('/migration/matches', migrationService.startMigrateMatches)
  router.put('/migration/after-matches', migrationService.updateMatchAfterDetails)
  router.put('/migration/article-sitemap', migrationService.startArticleSitemapMigration)
  router.delete('/migration/matches', migrationService.removeAllMatchData)
  router.put('/migration/fetch-series', migrationService.fetchAllSeries)
  router.put('/migration/team-image', migrationService.updateTeamImage)
  router.put('/migration/static-pages', migrationService.migrateStaticPages)
  router.put('/migration/sql-mongo-id', migrationService.setSqlMongoId)
  router.put('/migration/fantasy-article-feed', migrationService.fantasyArticleFeed)

  // Extra Service Routes
  router.put('/migration/player-bdate', extraServices.updatePlayersBirthDate)
  router.get('/migration/tandc', migrationService.startMigrationTagsNCat)
  router.put('/migration/also-read', migrationService.removeAlsoRead)
  router.put('/migration/fix-broken-links', migrationService.fixBrokenLinks)
  router.put('/migration/assign-article-to-seo', migrationService.assignArticleToSeo)
  router.put('/match-slug', updateMatchesSeo)
  router.put('/no-match-slug', matchesWithoutSlug)
  // for createing sDTitle field in seo
  router.get('/update-sDTitle', migrationService.updateDtitle)
}
