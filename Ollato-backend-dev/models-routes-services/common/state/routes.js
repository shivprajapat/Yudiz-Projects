const router = require('express').Router()
const stateService = require('./services')
const { validate } = require('../../../middlewares/middleware')

router.post('/v1/state/get_all_states', validate, stateService.getAllStates)

module.exports = router
