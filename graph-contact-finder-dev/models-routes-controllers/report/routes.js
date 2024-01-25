const router = require('express').Router()
const reportControllers = require('./controllers')
const { validateAdmin, validation } = require('../../middleware/middleware')
const reportValidator = require('./validators')

router.get('/admin/reports', validateAdmin('REPORT', 'R'), reportControllers.fetchReport)
router.put('/admin/user-reports', validateAdmin('REPORT', 'R'), reportValidator.checkReport, validation, reportControllers.fetchUserReport)

module.exports = router
