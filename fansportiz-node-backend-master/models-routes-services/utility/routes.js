const router = require('express').Router()
const utilityServices = require('./services')

router.get('/user/get-url/v1', utilityServices.getUrls)
router.get('/get-url/:type/v1', utilityServices.getUrl)

module.exports = router
