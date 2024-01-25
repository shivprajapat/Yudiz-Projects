const router = require('express').Router()
const leagueCategoryServices = require('./services')
const validators = require('./validators')
const { validateAdmin } = require('../../middlewares/middleware')
const { cacheRoute } = require('../../helper/redis')

router.post('/admin/league-category/v1', validators.adminAddLeagueCategory, validateAdmin('LEAGUE', 'W'), leagueCategoryServices.add)
router.get('/admin/league-category/v1', validateAdmin('LEAGUE', 'R'), cacheRoute(60), leagueCategoryServices.categoryList)
router.get('/admin/league-category/list/v1', validators.list, validateAdmin('LEAGUE', 'R'), leagueCategoryServices.list)
router.get('/admin/league-category/:id/v1', validateAdmin('LEAGUE', 'R'), leagueCategoryServices.get)
router.put('/admin/league-category/:id/v1', validateAdmin('LEAGUE', 'W'), leagueCategoryServices.update)
router.delete('/admin/league-category/:id/v1', validateAdmin('LEAGUE', 'W'), leagueCategoryServices.removeLeagueCategory)
router.post('/admin/league-category/pre-signed-url/v1', validators.getSignedUrl, validateAdmin('LEAGUE', 'W'), leagueCategoryServices.getSignedUrl)

router.post('/admin/filter-category/v1', validators.adminAddFilterCategory, validateAdmin('LEAGUE', 'W'), leagueCategoryServices.addFilterCategory)
router.get('/admin/filter-category/v1', validateAdmin('LEAGUE', 'R'), cacheRoute(60), leagueCategoryServices.FilterCategoryList)
router.get('/admin/filter-category/list/v1', validators.list, validateAdmin('LEAGUE', 'R'), leagueCategoryServices.listFilterCategory)
router.get('/admin/filter-category/:id/v1', validateAdmin('LEAGUE', 'R'), cacheRoute(60), leagueCategoryServices.getFilterCategory)
router.put('/admin/filter-category/:id/v1', validateAdmin('LEAGUE', 'W'), leagueCategoryServices.updateFilterCategory)
router.delete('/admin/filter-category/:id/v1', validateAdmin('LEAGUE', 'W'), leagueCategoryServices.removeFilterCategory)

module.exports = router
