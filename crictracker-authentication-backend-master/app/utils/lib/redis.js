const Redis = require('ioredis')
const config = require('../../../config')
const { users } = require('../../model')

const options = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT
}
const publisher = new Redis(options)
const subscriber = new Redis(options)
const redisclient = new Redis({ ...options, db: 0 })
const redisAuthDb = new Redis({ ...options, db: 1 })
const redisMailDb = new Redis({ ...options, db: 2 })
const redisStreamDb = new Redis({ ...options, db: 4 })

redisclient.setupConfig = function () {
  publisher.setMaxListeners(0)
  subscriber.setMaxListeners(0)
}

redisclient.on('ready', redisclient.setupConfig)

redisclient.on('error', function (error) {
  console.log('Error in Redis', error)
  process.exit(1)
})

redisclient.on('connect', function () {
  console.log('redis connected')
})

const readRedisStreamBookmark = async (stream, id = '$') => {
  const result = await redisStreamDb.xreadgroup('BLOCK', 1000, 'GROUP', config.BOOKMARK_COUNT_UPDATE_GROUP, config.BOOKMARK_COUNT_UPDATE_CONSUMER, 'COUNT', 1, 'STREAMS', stream, '>')
  try {
    if (result) {
      for (let index = 0; index < result[0][1].length; index++) {
        const ele = result[0][1][index]
        id = ele[0]
        const iIdObj = JSON.parse(ele[1][1])

        /** Update bookmark count when user add/delete article or video as bookmark */
        const { iUserId, type } = iIdObj
        const user = await users.findById(iUserId).lean()
        if (user) {
          let newBookmarkCount = 0
          if (type === 'addbookmark') {
            newBookmarkCount = 1
            if (user.nBookmarkCount) {
              newBookmarkCount = user.nBookmarkCount + 1
            }
          }

          if (type === 'deletebookmark') {
            if (user.nBookmarkCount) {
              newBookmarkCount = user.nBookmarkCount - 1
            }
            if (newBookmarkCount < 0) {
              newBookmarkCount = 0
            }
          }
          await users.updateOne({ _id: user._id }, { nBookmarkCount: newBookmarkCount }, { strict: false })
        }

        await redisStreamDb.xack(config.BOOKMARK_COUNT_UPDATE_EVENT, config.BOOKMARK_COUNT_UPDATE_GROUP, id)
        await redisStreamDb.xdel(config.BOOKMARK_COUNT_UPDATE_EVENT, id)
      }
    }
    readRedisStreamBookmark(config.BOOKMARK_COUNT_UPDATE_EVENT, id)
  } catch (error) {
    console.log(error)
    readRedisStreamBookmark(config.BOOKMARK_COUNT_UPDATE_EVENT, id)
  }
}

redisStreamDb.xgroup('CREATE', config.BOOKMARK_COUNT_UPDATE_EVENT, config.BOOKMARK_COUNT_UPDATE_GROUP, '0', 'MKSTREAM').then((res) => {
  console.log('pending in event', config.BOOKMARK_COUNT_UPDATE_EVENT, res)
  if (res !== 0) readRedisStreamBookmark(config.BOOKMARK_COUNT_UPDATE_EVENT, '$')
}).catch(error => {
  if (error?.command?.args[0] !== 'CREATE') console.log(error)
})

readRedisStreamBookmark(config.BOOKMARK_COUNT_UPDATE_EVENT, '$')

module.exports = { redisclient, redisAuthDb, redisMailDb }
