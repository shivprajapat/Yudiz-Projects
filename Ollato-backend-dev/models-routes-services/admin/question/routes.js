const router = require('express').Router()
const questionService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/question/get-all-question', validators.getAllQuestion, validate, isAdminAuthenticated, questionService.getAllQuestion)
router.post('/v1/admin/question/get-question-by-id', validators.singleQuestion, validate, isAdminAuthenticated, questionService.getQuestionById)

router.post('/v1/admin/question/create', isAdminAuthenticated, validators.create, validate, questionService.createQuestion)

router.post('/v1/admin/question/update', isAdminAuthenticated, validators.update, validate, questionService.updateQuestion)

router.post('/v1/admin/question/delete', isAdminAuthenticated, validators.deleteQuestion, validate, questionService.deleteQuestion)

module.exports = router
