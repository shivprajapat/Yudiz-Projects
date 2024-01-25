const router = require('express').Router()
const matchTeams = require('./services')
const { validateAdmin } = require('../../middlewares/middleware')

router.post('/admin/recommend-team/v1', validateAdmin('USERTEAM', 'W'), matchTeams.createTeam)
router.put('/admin/recommend-team/:id/v1', validateAdmin('USERTEAM', 'W'), matchTeams.upateRecomendetedTeam) // Admin can update and soft delete the team

// User
// router.get('/user/get-all-teams/:iMatchId', matchTeams.getRecommendedTeams) // here the id is iMathchId
router.get('/user/recommend-team/:id/v1', matchTeams.getRecommendedTeams) // here the is for the team

module.exports = router
