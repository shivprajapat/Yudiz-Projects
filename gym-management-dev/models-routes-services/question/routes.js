// @ts-check
const router = require('express').Router()
const validators = require('./validators')
const { validate, isAdminAuthorized } = require('../../middlewares/middleware')
const services = require('./services')

router.get('/:id', validators.getQuestion, validate, isAdminAuthorized, services.get)
router.put('/add', validators.add, validate, isAdminAuthorized, services.add)
router.patch('/edit/:id', validators.update, validate, isAdminAuthorized, services.update)
router.delete('/delete/:id', validators.deleteQuestion, validate, isAdminAuthorized, services.delete)
router.get('/list/all', validators.list, validate, isAdminAuthorized, services.list)
module.exports = router
