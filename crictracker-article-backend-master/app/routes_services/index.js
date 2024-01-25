const router = require('express').Router()
const playlistServices = require('./services/playlist')
const viewcountServices = require('./services/viewcount')
const widgetServices = require('./services/widget')
const { fetchPlaylistAuthorized } = require('./middleware/index')
const TagService = require('./services/tag')
const ArticleService = require('./services/articles')
const TwitterService = require('./services/twitter')

router.get('/fetch-playlist', fetchPlaylistAuthorized, playlistServices.youTubeAuthorized)
router.get('/oauth2callback', playlistServices.oAuthCalllback)
router.get('/update-full-playlist', playlistServices.updateYoutubePlaylist)
router.get('/update-playlist', playlistServices.updateYoutubePlaylist)
router.get('/playlist-token', playlistServices.assignPlayListPageToken)
router.get('/playlistItem-token', playlistServices.assignPlayListItemsPageToken)
router.get('/video-token', playlistServices.assignVideosPageToken)
router.get('/viewcount/redis-to-article', viewcountServices.updateArticleViewcount)
router.get('/viewcount/redis-to-video', viewcountServices.updateVideoViewcount)
router.get('/cricspecial-article', widgetServices.cricspecial)
router.get('/trending-news', widgetServices.trendingNews)
router.put('/listicle', ArticleService.setListicle)
router.put('/video-publish-date', playlistServices.assignNewVideoDate)
router.put('/videos-assign-category', playlistServices.assignNewCategory)
router.post('/generate-twitter-data/:tweetId', TwitterService.generateTwitterData)
router.get('/article/view-count-update', ArticleService.updateNewsArticleViewsCount)
router.get('/listLiveBlogContent', ArticleService.listLiveBlogContent)

router.get('/tag-exist', TagService.tagExist)

router.get('/ping', (req, res) => {
  return res.status(200).send({ sMessage: 'pong' })
})

router.all('*', (req, res) => {
  return res.status(400).jsonp({
    status: 400,
    messages: 'Bad Route'
  })
})

module.exports = router
