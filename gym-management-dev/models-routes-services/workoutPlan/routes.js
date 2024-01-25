// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.get('/:id', validators.get, validate, isAdminAuthorized, services.get)
router.put('/add', validators.add, validate, isAdminAuthorized, services.add)
router.get('/list/all', validators.list, validate, isAdminAuthorized, services.list)
router.patch('/edit/:id', validators.update, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deletePlan, validate, isAdminAuthorized, services.delete)
module.exports = router
