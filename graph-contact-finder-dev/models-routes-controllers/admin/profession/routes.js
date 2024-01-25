// @ts-check
const router = require('express').Router()
const ProfessionController = require('./controllers')
const fieldValidators = require('./validators')
const { validateAdmin, validation, verifyIsLoggedIn } = require('../../../middleware/middleware')

router.get('/admin/profession/list/all', validateAdmin('FIELDS', 'R'), fieldValidators.list, validation, ProfessionController.list)
router.get('/user/profession/list/all', verifyIsLoggedIn, fieldValidators.list, validation, ProfessionController.list)
router.get('/user/profession/search', verifyIsLoggedIn, ProfessionController.search)
router.post('/admin/profession/add', validateAdmin('FIELDS', 'W'), fieldValidators.add, validation, ProfessionController.add)
router.delete('/admin/profession/delete/:id', validateAdmin('FIELDS', 'W'), fieldValidators.deleteProfession, validation, ProfessionController.delete)
router.put('/admin/profession/update/:id', validateAdmin('FIELDS', 'W'), fieldValidators.update, validation, ProfessionController.update)

module.exports = router
