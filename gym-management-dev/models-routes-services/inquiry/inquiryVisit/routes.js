// @ts-check
const router = require('express').Router()
const validators = require('./validators')

const services = require('./services')
const { validate, isAdminAuthorized } = require('../../../middlewares/middleware')

router.put('/add', validators.addInquiryVisit, validate, isAdminAuthorized, services.add)
router.get('/:id', validators.getInquiryVisit, validate, isAdminAuthorized, services.get)
router.patch('/edit/:id', validators.updateInquiryVisit, validate, isAdminAuthorized, services.update)
router.delete('/delete', validators.deleteInquiryVisit, validate, isAdminAuthorized, services.delete)
router.get('/list/all', validators.listInquiryVisit, validate, isAdminAuthorized, services.list)

module.exports = router
