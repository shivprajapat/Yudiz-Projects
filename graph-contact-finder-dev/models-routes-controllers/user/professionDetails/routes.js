// @ts-check
const router = require('express').Router()
const { validation, verifyIsLoggedIn } = require('../../../middleware/middleware')
const { addProfession, updateProfession, deleteProfession, listProfession } = require('./controllers')
const { addProfessionValidator, deleteProfessionValidator } = require('./validators')

// user routes
router.post('/user/profession/add', verifyIsLoggedIn, addProfessionValidator, validation, addProfession)
router.post('/user/profession/edit/:id', verifyIsLoggedIn, addProfessionValidator, validation, updateProfession)
router.delete('/user/profession/delete/:id', verifyIsLoggedIn, deleteProfessionValidator, validation, deleteProfession)
router.get('/user/profession/list', verifyIsLoggedIn, listProfession)

module.exports = router
