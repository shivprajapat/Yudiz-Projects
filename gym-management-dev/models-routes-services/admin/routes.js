// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.post('/login', validators.login, validate, services.login)
router.get('/profile', validators.profile, validate, isAdminAuthorized, services.getProfile)
router.patch('/edit', validators.add, validate, isAdminAuthorized, services.updateAdminuser)
router.put('/create', validators.add, validate, isAdminAuthorized, services.createAdmin)
router.delete('/delete/:id', validators.deleteAdmin, validate, isAdminAuthorized, services.deleteAdminUser)
router.get('/list/all', isAdminAuthorized, services.list)
module.exports = router
