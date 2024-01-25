const router = require('express').Router()
const boardService = require('./services')
const { validate } = require('../../../middlewares/middleware')

router.get('/v1/board/get-all-board', validate, boardService.getAllBoard)

module.exports = router
