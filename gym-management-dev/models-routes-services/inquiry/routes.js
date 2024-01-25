// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.put('/add', validators.addInquiry, validate, isAdminAuthorized, services.add)
router.get('/', validators.getInquiry, validate, isAdminAuthorized, services.get)
router.patch('/edit/:id', validators.updateInquiry, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deleteInquiry, validate, isAdminAuthorized, services.delete)
router.get('/list/all', validators.listInquiry, validate, isAdminAuthorized, services.list)

module.exports = router
