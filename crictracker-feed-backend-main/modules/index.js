require('./articles/grpc/auth.client')
require('./articles/grpc/seo.client')
const router = require('express').Router()
const v1 = require('./routes')

router.use('/v1', v1)

module.exports = router
