const router = require('express').Router()
const centerAvailServices = require('./services')
const { /* validate, */ isCenterAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/center/sessions', isCenterAuthenticated, centerAvailServices.getAllCounsellorSessions)
router.post('/v1/center/session', isCenterAuthenticated, centerAvailServices.getSessionDetailById)
router.post('/v1/center/session/accept-reject', isCenterAuthenticated, centerAvailServices.acceptRejectSession)
router.post('/v1/center/session/report', isCenterAuthenticated, centerAvailServices.reportSession)
router.post('/v1/center/session/reschedule', isCenterAuthenticated, centerAvailServices.rescheduleSession)
router.post('/v1/center/session/cancel', isCenterAuthenticated, centerAvailServices.cancelSession)
router.post('/v1/center/counsellor/availability/get-by-id', isCenterAuthenticated, centerAvailServices.getByDate)

module.exports = router
