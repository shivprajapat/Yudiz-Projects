// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.put('/add', validators.addSubscription, validate, isAdminAuthorized, services.add)
router.get('/:id', validators.getSubscription, validate, isAdminAuthorized, services.get)
router.patch('/edit/:id', validators.updateSubscription, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deleteSubscription, validate, isAdminAuthorized, services.delete)
router.get('/list/all', isAdminAuthorized, services.list)

module.exports = router
