// @ts-check
const router = require('express').Router()
const { isAdminAuthorized, validate } = require('../../middlewares/middleware')
const services = require('./services')
const validators = require('./validators')

router.get('/:id', validators.get, validate, isAdminAuthorized, services.get)
router.get('/list/all', isAdminAuthorized, services.list)
module.exports = router
