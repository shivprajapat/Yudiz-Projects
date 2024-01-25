const router = require('express').Router()
const playerRoleServices = require('./services')
const validators = require('./validators')
const { validateAdmin, validate } = require('../../middlewares/middleware')
const { cacheRoute } = require('../../helper/redis')

router.get('/admin/player-role/v1', validators.getPlayerRole, validateAdmin('ROLES', 'R'), playerRoleServices.getPlayerRole)
router.get('/admin/player-role/:id/v1', validators.getPlayerRole, validateAdmin('ROLES', 'R'), playerRoleServices.get)
router.put('/admin/player-role/:id/v2', validators.updatePlayerRoleV2, validators.getPlayerRole, validateAdmin('ROLES', 'W'), playerRoleServices.updateV2)

// user

router.get('/user/match-player-role/:iMatchId/v1', validators.getMatchPlayerRole, validate, cacheRoute(60), playerRoleServices.getMatchPlayerRole)

module.exports = router
