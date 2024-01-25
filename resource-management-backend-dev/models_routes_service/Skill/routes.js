const router = require('express').Router()
const skillService = require('./services')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const validators = require('./validators')

router
  .use(setLanguage, isAuthenticated)
  .post('/skills/v1', isAuthorized('CREATE_SKILL'), validators.skillCheckV1, validate, skillService.addSkills)
  .delete('/skills/:id/v1', isAuthorized('DELETE_SKILL'), validators.skillCheckIdV1, validate, skillService.deleteSkills)
  .put('/skills/:id/v1', isAuthorized('UPDATE_SKILL'), validators.updateSkillsCheckV1, validate, skillService.updateSkills)
  .get('/skills/:id/v1', isAuthorized('VIEW_SKILL'), validators.skillCheckIdV1, validate, skillService.getSkillsById)
  .get('/skills/v1', isAuthorized('VIEW_SKILL'), skillService.getSkills)
  .get('/clientOneSignal', setLanguage, skillService.sendPushNotificationUsingOneSignal)
  .post('/clientOneSignalSubScribe', setLanguage, skillService.subscribeUserWithOneSignal)
  .post('/clientOneSignalSubScriberemove', setLanguage, skillService.removeSubscribeUsersWithOneSignal)
// .post('/mail/v1', setLanguage, skillService.postmaker)
// .post('/mailgoogle/v1', setLanguage, skillService.sendMailUsingGmailApi)

router.get('/mail/user/:email', setLanguage, skillService.getUser)
router.get('/onegetNotifications', setLanguage, skillService.getNotifications)
// router.get('/mail/send', setLanguage, skillService.sendMail)
// router.get('/mail/read/:messageId', setLanguage, skillService.readMail)
module.exports = router
