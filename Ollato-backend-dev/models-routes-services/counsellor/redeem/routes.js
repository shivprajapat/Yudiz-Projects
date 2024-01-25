const router = require('express').Router()
const CounsellorRedeemServices = require('./services')
const validators = require('./validators')
const { validate, isCounsellorAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/counsellor/redeem-request', validators.redeemRequest, validate, isCounsellorAuthenticated, CounsellorRedeemServices.counsellorRedeemRequest)
router.post('/v1/counsellor/redeem-request-list', validators.redeemRequestList, validate, isCounsellorAuthenticated, CounsellorRedeemServices.getAllRedeemRequest)
router.post('/v1/counsellor/redeem-request-by-id', validators.redeemRequestbyId, validate, isCounsellorAuthenticated, CounsellorRedeemServices.redeemRequestById)

module.exports = router
