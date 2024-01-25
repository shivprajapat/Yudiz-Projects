const router = require('express').Router()
const packageServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/package/get', validators.singlePackage, validate, isAdminAuthenticated, packageServices.getPackageById)
router.post('/v1/admin/packages', validators.getAllPackage, validate, isAdminAuthenticated, packageServices.getAll)
router.post('/v1/admin/package/create', validators.createPackage, validate, isAdminAuthenticated, packageServices.createPackage)
router.post('/v1/admin/package/update', validators.updatePackage, validate, isAdminAuthenticated, packageServices.updatePackage)
router.post('/v1/admin/package/delete', validators.deletePackage, validate, isAdminAuthenticated, packageServices.deletePackage)

module.exports = router
