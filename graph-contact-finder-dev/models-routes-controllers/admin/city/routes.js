// @ts-check
const router = require('express').Router()
const CityController = require('./controllers')
const fieldValidators = require('./validators')
const { validateAdmin, validation } = require('../../../middleware/middleware')

router.get('/admin/city/list/all', validateAdmin('FIELDS', 'R'), fieldValidators.list, validation, CityController.list)
router.post('/admin/city/add', validateAdmin('FIELDS', 'W'), fieldValidators.add, validation, CityController.add)
router.delete('/admin/city/delete/:id', validateAdmin('FIELDS', 'W'), fieldValidators.deleteProfession, validation, CityController.delete)
router.put('/admin/city/update/:id', validateAdmin('FIELDS', 'W'), fieldValidators.update, validation, CityController.update)

module.exports = router
