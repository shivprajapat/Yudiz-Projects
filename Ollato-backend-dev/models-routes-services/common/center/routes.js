const router = require('express').Router()
const centerService = require('./services')
const { validate } = require('../../../middlewares/middleware')

router.get('/v1/center/get_all_centers', validate, centerService.getAllCenter)

module.exports = router
