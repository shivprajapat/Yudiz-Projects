const router = require('express').Router()
const notificationService = require('./service')
// const validators = require('./validators')
const { setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')

router
  .use(setLanguage, isAuthenticated)
  .patch('/updateNotification/:id/v1', isAuthorized('UPDATE_NOTIFICATION'), notificationService.updateNotification)
  .get('/getNotifications/v1', isAuthorized('VIEW_NOTIFICATION'), notificationService.getNotifications)
  .get('/getNotificationCount/v1', isAuthorized('VIEW_NOTIFICATION'), notificationService.getNotificationCount)
  .post('/addNotification/v1', isAuthorized('CREATE_NOTIFICATION'), notificationService.addNotification)
  .post('/addTimedNotification/v1', isAuthorized('CREATE_NOTIFICATION'), notificationService.addTimedNotification)
  .patch('/markAllAsRead/v1', isAuthorized('UPDATE_NOTIFICATION'), notificationService.markAllAsRead)
  .delete('/deleteNotification/v1', isAuthorized('DELETE_NOTIFICATION'), notificationService.deleteNotification)

module.exports = router
