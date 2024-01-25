const router = require('express').Router()
const counsellorService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/counsellor/get-all-counsellor', validators.getAllCounsellor, validate, isAdminAuthenticated, counsellorService.getAllCounsellor)
router.post('/v1/admin/counsellor/get-counsellor-by-id', validators.singleCounsellor, validate, isAdminAuthenticated, counsellorService.getCounsellorById)

router.post('/v1/admin/counsellor/create', validators.register, validate, isAdminAuthenticated, counsellorService.createCounsellor)

router.post('/v1/admin/counsellor/update', validators.register, validate, isAdminAuthenticated, counsellorService.updateCounsellor)

router.post('/v1/admin/counsellor/delete', validators.deleteCounsellor, validate, isAdminAuthenticated, counsellorService.deleteCounsellor)

module.exports = router
