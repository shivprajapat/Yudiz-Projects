const router = require('express').Router()
const counsellorAvailServices = require('./services')
const { isCounsellorAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/counsellor/sessions', isCounsellorAuthenticated, counsellorAvailServices.getAllCounsellorSessions)
router.post('/v1/counsellor/session', isCounsellorAuthenticated, counsellorAvailServices.getSessionDetailById)
router.post('/v1/counsellor/session/accept-reject', isCounsellorAuthenticated, counsellorAvailServices.acceptRejectSession)
router.post('/v1/counsellor/session/report', isCounsellorAuthenticated, counsellorAvailServices.reportSession)
router.post('/v1/counsellor/session/reschedule', isCounsellorAuthenticated, counsellorAvailServices.rescheduleSession)
router.post('/v1/counsellor/session/cancel', isCounsellorAuthenticated, counsellorAvailServices.cancelSession)
router.post('/v1/counsellor/session/complete', isCounsellorAuthenticated, counsellorAvailServices.completeSession)

module.exports = router
