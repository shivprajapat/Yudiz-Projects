const router = require('express').Router()
const PassbookServices = require('./services')
const { isUserAuthenticated, validateAdmin } = require('../../middlewares/middleware')
const validators = require('./validators')

router.get('/user/passbook/list/v1', validators.listValidator, isUserAuthenticated, PassbookServices.list)

router.get('/admin/passbooks/:iUserId/v1', validateAdmin('PASSBOOK', 'R'), PassbookServices.userDetails)
router.get('/admin/system-user/passbooks/:iUserId/v1', validateAdmin('SYSTEM_USERS', 'R'), PassbookServices.userDetails)
router.get('/admin/passbook/list/v2', validators.limitValidator, validateAdmin('PASSBOOK', 'R'), PassbookServices.adminListV2)
router.get('/admin/passbook/counts/v2', validateAdmin('PASSBOOK', 'R'), PassbookServices.getCountsV2)
router.get('/admin/passbook/match-league-list/:id/v1', validators.limitValidator, validateAdmin('PASSBOOK', 'R'), PassbookServices.matchLeagueWiseList)
router.get('/admin/passbook/match-league-list/count/:id/v1', validateAdmin('PASSBOOK', 'R'), PassbookServices.matchLeagueWiseCount)

module.exports = router
