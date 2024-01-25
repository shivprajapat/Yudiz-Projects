const router = require('express').Router()
const gradeService = require('./services')
const { validate } = require('../../../middlewares/middleware')

router.get('/v1/grade/get-all-grade', validate, gradeService.getAllGrades)

module.exports = router
