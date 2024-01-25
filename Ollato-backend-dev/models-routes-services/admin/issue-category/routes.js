const router = require('express').Router()
const counsellorSettingsServices = require('./services')
const validators = require('./validators')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/admin/issue-category/create-issue-category', isAdminAuthenticated, validators.createIssue, validate, counsellorSettingsServices.createIssueCategory)
router.post('/v1/admin/issue-category/update-issue-category', isAdminAuthenticated, validators.updateIssue, validate, counsellorSettingsServices.updateIssueCategory)
router.post('/v1/admin/issue-category/delete-issue-category', isAdminAuthenticated, validators.deleteIssue, validate, counsellorSettingsServices.deleteIssueCategory)

module.exports = router
