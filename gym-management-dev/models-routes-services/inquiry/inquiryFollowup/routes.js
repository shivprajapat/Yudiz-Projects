// @ts-check
const router = require('express').Router()
const validators = require('./validators')

const services = require('./services')
const { validate, isAdminAuthorized } = require('../../../middlewares/middleware')

router.put('/add', validators.addInquiryHistory, validate, isAdminAuthorized, services.add)
router.get('/:id', validators.getInquiryHistory, validate, isAdminAuthorized, services.get)
router.patch('/edit/:id', validators.updateInquiryHistory, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deleteInquiryHistory, validate, isAdminAuthorized, services.delete)
router.get('/list/all', validators.listInquiryHistory, validate, isAdminAuthorized, services.list)

module.exports = router
