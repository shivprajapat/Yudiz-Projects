const router = require('express').Router()
const counsellorAvailServices = require('./services')
const validators = require('./validators')
const { validate, isCounsellorAuthenticated } = require('../../../middlewares/middleware')

router.post('/v1/counsellor/availability/set-counsellor', validators.create, validate, isCounsellorAuthenticated, counsellorAvailServices.setCounsellor)
router.post('/v1/counsellor/availability/get-all-available-counselor', validators.getAll, validate, isCounsellorAuthenticated, counsellorAvailServices.getAllCounsellorAvailabile)
router.post('/v1/counsellor/availability/get-by-id', isCounsellorAuthenticated, counsellorAvailServices.getByDate)
router.post('/v1/counsellor/availability/delete', isCounsellorAuthenticated, counsellorAvailServices.deleteAvailability)
router.post('/v1/counsellor/availability/update-counsellor', isCounsellorAuthenticated, counsellorAvailServices.updateCounsellorAvailbility)
router.get('/v1/counsellor/availability/time-slots-after-current-time', isCounsellorAuthenticated, counsellorAvailServices.timeSlotAfterCurrTime)
router.get('/v1/counsellor/time-slots', isCounsellorAuthenticated, counsellorAvailServices.getTimeSlot)
module.exports = router
