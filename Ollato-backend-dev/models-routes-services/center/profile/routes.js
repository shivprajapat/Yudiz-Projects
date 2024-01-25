const router = require('express').Router()
const CenterServices = require('./services')
const { isCenterAuthenticated } = require('../../../middlewares/middleware')

router.get('/v1/center/get-center-detail', isCenterAuthenticated, CenterServices.getCenterDetail)
router.get('/v1/center/get-issue-categories', isCenterAuthenticated, CenterServices.getAllIssueCategory)
router.post('/v1/center/create-center-support-data', isCenterAuthenticated, CenterServices.createCenterSupport)
router.post('/v1/center/update-center-detail', isCenterAuthenticated, CenterServices.updateCenterDetail)

module.exports = router
