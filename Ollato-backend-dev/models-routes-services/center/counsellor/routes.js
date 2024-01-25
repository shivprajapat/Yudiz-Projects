const router = require('express').Router()
const counsellorService = require('./services')
const { validate, isCenterAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/center/counsellor/get-all-counsellor', validators.getAllCounsellor, validate, isCenterAuthenticated, counsellorService.getAllCounsellor)
router.post('/v1/center/counsellor/get-counsellor-by-id', validators.singleCounsellor, validate, isCenterAuthenticated, counsellorService.getCounsellorById)

router.post('/v1/center/counsellor/create', validators.register, validate, isCenterAuthenticated, counsellorService.createCounsellor)

router.post('/v1/center/counsellor/update', validators.register, validate, isCenterAuthenticated, counsellorService.updateCounsellor)

router.post('/v1/center/counsellor/delete', validators.deleteCounsellor, validate, isCenterAuthenticated, counsellorService.deleteCounsellor)

router.get('/v1/center/counsellor/get-all-counsellor-frontend', isCenterAuthenticated, counsellorService.getAllCounsellorFrontend) // frontend
module.exports = router
