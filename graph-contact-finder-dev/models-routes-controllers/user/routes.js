// @ts-check
const router = require('express').Router()
const userControllers = require('./controllers')
const userValidators = require('./validators')
const { verifyIsLoggedIn, validateAdmin, validation, verifyIsUserAuthorized } = require('../../middleware/middleware')

// user routes
router.post('/user/register', userValidators.register, validation, userControllers.register)
router.post('/user/login', userValidators.login, validation, userControllers.login)
router.post('/user/reset-password', userValidators.resetPassword, validation, userControllers.resetPassword)
router.post('/user/contact-sync', userValidators.syncContactList, validation, verifyIsLoggedIn, userControllers.contactSync)
router.post('/user/change-password', userValidators.updatePassword, validation, verifyIsUserAuthorized, userControllers.changePassword)
router.put('/user/logout', verifyIsLoggedIn, userControllers.logout)
router.get('/user/filter-contacts', userValidators.filterContact, validation, verifyIsUserAuthorized, userControllers.filterContacts)
router.put('/user/update-user', userValidators.updateUser, validation, verifyIsUserAuthorized, userControllers.userUpdate)
router.get('/user/profile', verifyIsUserAuthorized, userControllers.getPersonalProfile)
router.get('/user/contact-profile', userValidators?.userProfile, validation, verifyIsUserAuthorized, userControllers.getContactUserProfile)

// admin routes
router.get('/admin/users', validateAdmin('USERS', 'R'), userValidators.getAdminUserList, validation, userControllers.getUsers)
router.get('/admin/user/:id', validateAdmin('USERS', 'R'), userValidators.validateContact, userControllers.getUser)
router.delete('/admin/user/delete/:id', validateAdmin('USERS', 'W'), userControllers.deleteUser)

module.exports = router
