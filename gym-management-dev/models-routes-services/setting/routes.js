// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.get('/info', isAdminAuthorized, services.get)
router.put('/add', validators.add, validate, services.add)
router.patch('/edit/:id', validators.update, validate, isAdminAuthorized, services.update)

module.exports = router
