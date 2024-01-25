const router = require('express').Router()
const userServices = require('./services')
const { validateAdmin, isUserAuthenticated, isAdminAuthenticated, validate } = require('../../../middlewares/middleware')
const { body } = require('express-validator')
const { cacheRoute } = require('../../../helper/redis')
const validators = require('./validators')

router.get('/admin/profile/v2', validators.limitValidator, validateAdmin('USERS', 'R'), userServices.listV2)
router.get('/admin/profile/counts/v1', validateAdmin('USERS', 'R'), userServices.getCounts)

// recommendation of 10 user list
router.get('/admin/user/recommendation/v1', validators.adminRecommendation, validateAdmin('USERS', 'R'), userServices.adminRecommendation)
router.get('/admin/deleted-users/v1', validateAdmin('USERS', 'R'), userServices.deletedUsers)
router.get('/admin/profile/:id/v1', validateAdmin('USERS', 'R'), userServices.adminGet)
router.put('/admin/profile/:id/v1', validateAdmin('USERS', 'W'), userServices.adminUpdate)
router.get('/admin/city/v1', validators.limitValidator, isAdminAuthenticated, userServices.listCity)
router.get('/admin/states/v1', isAdminAuthenticated, cacheRoute(5 * 60), userServices.getState)

router.get('/admin/referred-list/:id/v1', validators.limitValidator, validateAdmin('USERS', 'R'), userServices.referredByUserList)

router.post('/admin/profile/pre-signed-url/v1', [
  body('sFileName').not().isEmpty(),
  body('sContentType').not().isEmpty()
], validateAdmin('USERS', 'W'), userServices.getSignedUrl)

// user
router.get('/user/profile/v2', isUserAuthenticated, userServices.getV2)
router.get('/user/profile-statistics/v1', isUserAuthenticated, userServices.getStatistic)
router.put('/user/profile/v1', isUserAuthenticated, userServices.update)
router.put('/user/profile/v2', isUserAuthenticated, userServices.updateV2)

router.post('/user/profile/pre-signed-url/v1', [
  body('sFileName').not().isEmpty(),
  body('sContentType').not().isEmpty()
], isUserAuthenticated, userServices.getSignedUrl)

router.get('/user/profile/states/v1', validators.states, validate, cacheRoute(5 * 60), userServices.getState)
router.get('/user/profile/cities/v1', validators.cities, validate, cacheRoute(5 * 60), userServices.userCitiesList)
router.get('/user/referred-list/v1', validators.limitValidator, isUserAuthenticated, userServices.userReferrals)
router.get('/user/delete-account-reason/v1', cacheRoute(5 * 60), userServices.listOfReason)
router.post('/user/remind-refer-user/v1', validators.reminder, isUserAuthenticated, userServices.remindReferUser)

module.exports = router
