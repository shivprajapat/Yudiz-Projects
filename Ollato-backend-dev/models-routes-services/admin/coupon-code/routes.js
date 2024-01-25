const router = require('express').Router()
const couponCodeServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/coupon-code/get', validators.singleCouponCode, validate, isAdminAuthenticated, couponCodeServices.getCouponCodeById)
router.post('/v1/admin/coupon-code', validators.getAllCouponCode, validate, isAdminAuthenticated, couponCodeServices.getAll)
router.post('/v1/admin/coupon-code/create', validators.createCouponCode, validate, isAdminAuthenticated, couponCodeServices.createCouponCode)
router.post('/v1/admin/coupon-code/update', validators.updateCouponCode, validate, isAdminAuthenticated, couponCodeServices.updateCouponCode)
router.post('/v1/admin/coupon-code/delete', validators.deleteCouponCode, validate, isAdminAuthenticated, couponCodeServices.deleteCouponCode)

module.exports = router
