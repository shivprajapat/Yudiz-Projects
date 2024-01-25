const router = require('express').Router()
const adminsServices = require('./services')
const { adminRegister } = require('./validators')
const { setLanguage } = require('./middleware')

router.post('/', adminRegister, setLanguage, adminsServices.register)

module.exports = router
