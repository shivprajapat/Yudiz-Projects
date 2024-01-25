const router = require('express').Router()
const redis = require('./controllers/redis')

router.post('/redis/delete-key', redis.deleteRedisKey)
router.get('/ping', (req, res) => {
  res.status(200).send({ sMessage: 'pong' })
})

module.exports = router
