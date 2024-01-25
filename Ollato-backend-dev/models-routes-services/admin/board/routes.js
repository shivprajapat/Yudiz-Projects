const router = require('express').Router()
const boardService = require('./services')
const { validate, isAdminAuthenticated } = require('../../../middlewares/middleware')
const validators = require('./validators')

router.post('/v1/admin/board/get-all-board', validators.getAllBoard, validate, isAdminAuthenticated, boardService.getAllBoard)
router.post('/v1/admin/board/get-board-by-id', validators.singleBoard, validate, isAdminAuthenticated, boardService.getBoardById)
router.post('/v1/admin/board/create', validators.create, validate, isAdminAuthenticated, boardService.createBoard)
router.post('/v1/admin/board/update', validators.updateBoard, validate, isAdminAuthenticated, boardService.updateBoard)
router.post('/v1/admin/board/delete', validators.deleteBoard, validate, isAdminAuthenticated, boardService.deleteBoard)

module.exports = router
