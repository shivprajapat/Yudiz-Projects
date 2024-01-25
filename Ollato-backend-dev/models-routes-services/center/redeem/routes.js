const router = require('express').Router()
const CenterRedeemServices = require('./services')
const validators = require('./validators')
const { validate, isCenterAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/center/redeem-request', validators.redeemRequest, validate, isCenterAuthenticated, CenterRedeemServices.centerRedeemRequest)
router.post('/v1/center/redeem-request-list', validators.redeemRequestList, validate, isCenterAuthenticated, CenterRedeemServices.getAllRedeemRequest)
router.post('/v1/center/redeem-request-by-id', validators.redeemRequestbyId, validate, isCenterAuthenticated, CenterRedeemServices.redeemRequestById)

module.exports = router
