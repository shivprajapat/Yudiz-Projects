// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const services = require('./services')
const { validate, isAdminAuthorized } = require('../../../middlewares/middleware')

router.post('/freeze', validators.addSubscriptionLog, validate, isAdminAuthorized, services.freeze)
router.post('/unfreeze', validators.unFreeze, validate, isAdminAuthorized, services.unFreeze)
router.get('/list/all', validators.listAll, validate, isAdminAuthorized, services.list)

module.exports = router
