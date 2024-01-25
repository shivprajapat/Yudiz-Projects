// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.put('/add', validators.add, validate, isAdminAuthorized, services.add)
router.get('/:id', validators.get, validate, isAdminAuthorized, services.get)
router.patch('/edit/:id', validators.update, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deleteRecord, validate, isAdminAuthorized, services.delete)
router.get('/list/all', isAdminAuthorized, services.list)

module.exports = router
