const tagsServices = require('./services')
// const { body } = require('express-validator')

module.exports = (router) => {
  router.get('/add-players', tagsServices.addPlayers)
  router.put('/dump-player-tags', tagsServices.dumpPlayerTagDataSqlToMongo)
  router.put('/dump-team-tags', tagsServices.dumpTeamTagDataSqlToMongo)
  router.put('/dump-venue-tags', tagsServices.dumpVenueTagDataSqlToMongo)
  router.put('/dump-tags', tagsServices.dumpTagDataSqlToMongo)
  router.put('/dump-remaining-simple-tags', tagsServices.dumpRemainingTagDataSqlToMongoAsSimpleTag)
  router.put('/dump-simple-tag-mongo', tagsServices.dumpSimpleTagsToMongo)
  router.put('/duplicate-cat-tag', tagsServices.duplicateCatTag)
  router.put('/tag/priority-algo', tagsServices.tagsPriorityAlgo)
  router.put('/match/series-algo', tagsServices.seriesPriorityAlgo)
  router.put('/match/team-algo', tagsServices.teamPriorityAlgo)
  router.put('/tag-seo', tagsServices.getTagSeo)
  router.put('/player/update-seo', tagsServices.updatePlayerSeo)
  router.put('/team/update-seo', tagsServices.updateTeamSeo)
  router.get('/ping', (req, res) => {
    res.status(200).send({ sMessage: 'pong' })
  })
}
