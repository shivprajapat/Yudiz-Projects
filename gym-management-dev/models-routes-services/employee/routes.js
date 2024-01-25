// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.put('/add', validators.addEmployee, validate, isAdminAuthorized, services.add)
router.get('/:id', validators.getEmployee, validate, isAdminAuthorized, services.get)
router.patch('/edit/:id', validators.updateEmployee, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deleteEmployee, validate, isAdminAuthorized, services.delete)
router.get('/list/all', validators.getEmployeeList, validate, isAdminAuthorized, services.list)

module.exports = router
