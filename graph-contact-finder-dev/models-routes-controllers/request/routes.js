// @ts-check
const router = require('express').Router()
const controllers = require('./controllers')
const validators = require('./validators')
const { verifyIsLoggedIn, validation } = require('../../middleware/middleware')

// user routes
router.post('/request/send', verifyIsLoggedIn, validators.add, validation, controllers.add)
router.get('/request/list', verifyIsLoggedIn, validators.list, controllers.list)
router.put('/request/response', verifyIsLoggedIn, validators.update, controllers.updateRequest)
router.delete('/request/delete/:id', verifyIsLoggedIn, validation, controllers.delete)

module.exports = router
