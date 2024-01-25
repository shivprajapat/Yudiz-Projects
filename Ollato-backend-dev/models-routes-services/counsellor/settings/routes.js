const router = require('express').Router()
const counsellorSettingsServices = require('./services')
const validators = require('./validators')
const { validate, isCounsellorAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/counsellor/settings/change-password', isCounsellorAuthenticated, validators.changePassword, validate, counsellorSettingsServices.changePassword)
router.post('/v1/counsellor/settings/counsellor-support', isCounsellorAuthenticated, validators.createCounsellorSupport, validate, counsellorSettingsServices.createCounsellorSupport)
router.get('/v1/counsellor/settings/get-all-issue-category', validate, counsellorSettingsServices.getAllIssueCategory)

module.exports = router
