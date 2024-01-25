const router = require('express').Router()
const seoServices = require('./services/seo')

router.get('/seo/:id?', seoServices.getSeo)
router.get('/seo-slug/:sSlug?', seoServices.getSeoBySlug)
router.post('/add-static-page-seo', seoServices.addStaticPageSeo)
router.get('/ping', seoServices.getPing)
router.post('/series-seo-redirection', seoServices.seriesRedirection)
router.post('/add-seos-data', seoServices.addSeosData)

router.all('*', (req, res) => {
  return res.status(400).jsonp({
    status: 400,
    messages: 'Bad Route'
  })
})
module.exports = router
