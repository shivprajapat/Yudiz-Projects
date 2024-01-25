const router = require('express').Router()
const myMatchesServices = require('./services')
const validators = require('./validators')
const { isUserAuthenticated } = require('../../middlewares/middleware')
const { cacheRoute } = require('../../helper/redis')

router.get('/user/my-matches/list/v4', validators.myMatchesValidator, isUserAuthenticated, myMatchesServices.myMatchesListV4)
router.get('/user/my-matches/list-complete/:id/v1', validators.limitValidator, isUserAuthenticated, cacheRoute(60), myMatchesServices.listCompleteMyMatches)
router.get('/user/my-matches/list-common/:id/v1', validators.limitValidator, isUserAuthenticated, cacheRoute(60), myMatchesServices.listCommonMatches)
router.get('/user/my-matches/compare-statistics/:id/v1', isUserAuthenticated, cacheRoute(60), myMatchesServices.getMatchCompareStats)

module.exports = router
