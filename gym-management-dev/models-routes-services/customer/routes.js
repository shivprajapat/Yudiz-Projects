// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.put('/add', validators.addCustomer, validate, isAdminAuthorized, services.add)
router.get('/:id', validators.getCustomer, validate, isAdminAuthorized, services.get)
router.patch('/edit/:id', validators.updateCustomer, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deleteCustomer, validate, isAdminAuthorized, services.delete)
router.get('/list/all', validators.getCustomerList, validate, isAdminAuthorized, services.list)

module.exports = router
