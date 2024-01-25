// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../../middlewares/middleware')
const services = require('./services')

router.put('/add', validators.add, validate, isAdminAuthorized, services.add)
router.get('/list/all', validators.get, validate, isAdminAuthorized, services.get)
router.patch('/edit', validators.update, validate, isAdminAuthorized, services.update)
module.exports = router
