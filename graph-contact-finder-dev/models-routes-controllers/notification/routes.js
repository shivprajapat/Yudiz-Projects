const router = require('express').Router()
const notificationController = require('./controllers')
const notificationValidator = require('./validators')
const { validateAdmin, verifyIsLoggedIn, validation } = require('../../middleware/middleware')

router.post('/admin/notification', validateAdmin('NOTIFICATION', 'W'), notificationValidator.adminAddNotification, notificationController.add)
router.post('/admin/global-notification', validateAdmin('NOTIFICATION', 'W'), notificationValidator.adminAddGlobalNotification, notificationController.addGlobalNotification)
router.delete('/admin/delete-notification/:id', validateAdmin('NOTIFICATION', 'W'), notificationController.deleteNotification)
router.put('/admin/change-mode/:id', validateAdmin('NOTIFICATION', 'W'), notificationValidator.changeStatus, notificationController.changeMode)
router.get('/admin/notification-list', validateAdmin('NOTIFICATION', 'R'), notificationController.notificationList)
router.get('/admin/notification-types-list', validateAdmin('NOTIFICATION', 'R'), notificationController.listTypes)
router.get('/admin/notification/get/:id', validateAdmin('NOTIFICATION', 'R'), notificationController.get)

router.get('/user/notification/unread-count', verifyIsLoggedIn, notificationController.unreadCount)
router.get('/user/notification-types-list', verifyIsLoggedIn, notificationController.listTypes)
router.get('/user/notification/list', verifyIsLoggedIn, notificationController.notificationListUser)

router.post('/admin/push-notification/add', validateAdmin('PUSHNOTIFICATION', 'W'), notificationValidator.addPushNotification, validation, notificationController.addPushNotification)
router.get('/admin/push-notification-list/', validateAdmin('PUSHNOTIFICATION', 'R'), notificationController.pushNotificationList)

module.exports = router
