// @ts-check
const router = require('express').Router()
const { isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.get('/statistics', isAdminAuthorized, services.cardStatistics)

module.exports = router
