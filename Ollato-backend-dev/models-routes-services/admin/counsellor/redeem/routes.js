const router = require('express').Router()
const CounsellorRedeemServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../../middlewares/middleware')

router.post('/v1/admin/counsellor/redeem-request-list', validators.redeemRequestList, validate, isAdminAuthenticated, CounsellorRedeemServices.getAllRedeemRequest)
router.post('/v1/admin/counsellor/redeem-request-by-id', validators.redeemRequestbyId, validate, isAdminAuthenticated, CounsellorRedeemServices.redeemRequestById)
router.post('/v1/admin/counsellor/update-redeem-request', validators.redeemRequestbyId, validate, isAdminAuthenticated, CounsellorRedeemServices.updateRedeemRequest)

module.exports = router
