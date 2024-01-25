const controllers = {}
const { redis } = require('../../utils')

controllers.deleteRedisKey = (req, res) => {
  try {
    if (!req.body?.keyName) return res.json({ message: 'key is required' })
    const { keyName } = req.body
    Object.keys(redis).every(async (ele) => {
      const keys = await redis[ele].keys('*')
      if (keys.findIndex((redisKey) => redisKey === keyName)) {
        const type = await redis[ele].type(keys[keys.findIndex((redisKey) => redisKey === keyName)])
        if (type !== 'none') {
          await redis[ele].del(keyName)
        }
      }
    })
  } catch (error) {
    res.send({ message: 'Something went wrong' })
  }
}

module.exports = controllers
