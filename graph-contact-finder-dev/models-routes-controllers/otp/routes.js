// @ts-check
const router = require('express').Router()
const controllers = require('./controllers')
const validators = require('./validators')
const { validation } = require('../../middleware/middleware')

// user routes
router.post('/otp/send', validators.send, validation, controllers.send)
router.post('/otp/verify', validators.verify, validation, controllers.verify)

module.exports = router
