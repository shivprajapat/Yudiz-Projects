const router = require('express').Router()
const counsellorService = require('./services')
const validators = require('./validators')
const { validate, isStudentAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/counsellor/get-all-counsellor', counsellorService.getAllCounsellor)
router.post('/v1/counsellor/get-available-counsellor', isStudentAuthenticated, validators.counselorData, validate, counsellorService.getAvailableCounsellorOne)
router.post('/v1/counsellor/get-sessions', isStudentAuthenticated, counsellorService.getAllSessions)
router.post('/v1/counsellor/reschedule-session', isStudentAuthenticated, validators.reschedule, validate, counsellorService.rescheduleSession)
router.post('/v1/counsellor/cancel-session', isStudentAuthenticated, validators.cancel, validate, counsellorService.cancelSession)
router.post('/v1/counsellor/get-filtered-counsellors', isStudentAuthenticated, validators.getFilterAllCounsellor, validate, counsellorService.getFilterAllCounsellor)
router.post('/v1/counsellor/get-counsellor', isStudentAuthenticated, counsellorService.getCounsellor)
router.post('/v1/session/book', isStudentAuthenticated, validators.bookSession, validate, counsellorService.sessionBook)
router.post('/v1/student/counsellor/session', isStudentAuthenticated, counsellorService.getSessionDetailById)
router.post('/v1/student/session/report', isStudentAuthenticated, counsellorService.reportSession)
router.post('/v1/student/session/ratings', isStudentAuthenticated, validators.rateSession, validate, counsellorService.rateSession)

module.exports = router
