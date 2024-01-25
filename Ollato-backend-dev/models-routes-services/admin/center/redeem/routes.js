const router = require('express').Router()
const CenterRedeemServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../../middlewares/middleware')

router.post('/v1/admin/center/redeem-request-list', validators.redeemRequestList, validate, isAdminAuthenticated, CenterRedeemServices.getAllRedeemRequest)
router.post('/v1/admin/center/redeem-request-by-id', validators.redeemRequestbyId, validate, isAdminAuthenticated, CenterRedeemServices.redeemRequestById)
router.post('/v1/admin/center/update-redeem-request', validators.redeemRequestbyId, validate, isAdminAuthenticated, CenterRedeemServices.updateRedeemRequest)

module.exports = router
