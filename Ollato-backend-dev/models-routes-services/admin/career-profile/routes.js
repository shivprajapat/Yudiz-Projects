const router = require('express').Router()
const careerProfileService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/career-profile/get-all', validators.getAllCareerProfile, validate, isAdminAuthenticated, careerProfileService.getAll)
router.post('/v1/admin/career-profile-detail/get-all-frontend', isAdminAuthenticated, careerProfileService.getAllProfileDetailsFront)
router.post('/v1/admin/career-profile/get-by-id', validators.singleCareerProfile, validate, isAdminAuthenticated, careerProfileService.getCareerProfileById)
router.post('/v1/admin/career-profile/create', validators.create, validate, isAdminAuthenticated, careerProfileService.createCareerProfile)
router.post('/v1/admin/career-profile/update', validators.update, validate, isAdminAuthenticated, careerProfileService.updateCareerProfile)
router.post('/v1/admin/career-profile/delete', validators.deleteCareer, validate, isAdminAuthenticated, careerProfileService.deleteCareerProfile)
router.post('/v1/admin/career-profile/deleteCareerDetail', validators.deleteCareer, validate, isAdminAuthenticated, careerProfileService.deleteDetailCareerProfile)

router.get('/v1/admin/career-profile/get-all-frontend', isAdminAuthenticated, careerProfileService.getAllCareerProfilFront) // for front end without pagination

module.exports = router
