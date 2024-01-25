// @ts-check
const router = require('express').Router()
const controllers = require('./controllers')
const validators = require('./validators')
const { verifyIsLoggedIn, validation } = require('../../middleware/middleware')

// user routes
router.post('/review/add', verifyIsLoggedIn, validators.add, validation, controllers.add)
router.get('/review/list', verifyIsLoggedIn, validators.list, controllers.list)
router.put('/review/edit/:id', verifyIsLoggedIn, validators.update, controllers.update)
router.delete('/review/delete/:id', verifyIsLoggedIn, validators.deleteReview, validation, controllers.delete)

module.exports = router
