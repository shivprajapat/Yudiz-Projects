const router = require('express').Router()
const seasonServices = require('./services')
const { validateAdmin } = require('../../middlewares/middleware')
const { limitValidator } = require('./validators')

router.get('/admin/season/list/v1', limitValidator, validateAdmin('SEASON', 'R'), seasonServices.list)
router.get('/admin/season-id-list/v1', limitValidator, seasonServices.SeasonNameList)
router.get('/admin/season/:id/v1', validateAdmin('SEASON', 'R'), seasonServices.get)
router.put('/admin/season/:id/v1', validateAdmin('SEASON', 'W'), seasonServices.update)

router.get('/admin/season-users/:id/v1', limitValidator, validateAdmin('SEASON', 'R'), seasonServices.usersListInSeason)
router.get('/admin/season-users-exports/:id/v1', validateAdmin('SEASON', 'R'), seasonServices.exportUsersInSeason)

module.exports = router
