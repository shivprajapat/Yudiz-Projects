const router = require('express').Router()
const service = require('./service')

router.get('/v1/pre-signed', service.generatePreSigned)
router.post('/v1/pre-signed-for-private', service.generatePreSignedForPrivate)
router.get('/v1/getUrl/:id', service.getUrlForPresigned)
router.post('/v1/getUrl-for-private', service.getUrlForPresignedForPrivate)

module.exports = router
