const Redis = require('ioredis')
// const { ObjectId } = require('mongoose').Types
// const config = require('../../../config')

const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
}
const publisher = new Redis(options)
const subscriber = new Redis(options)
const redisclient = new Redis({ ...options, db: 0 })
const redisAuthDb = new Redis({ ...options, db: 1 })
const redisMailDb = new Redis({ ...options, db: 2 })
const redisArticleDb = new Redis({ ...options, db: 3 })

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

// const readRedisStream = async (stream, id = '$') => {
//   try {
//     const result = await redisclient.xreadgroup('BLOCK', 1000, 'GROUP', config.HOME_PAGE_SLUG_GROUP, config.HOME_PAGE_SLUG_CONSUMER, 'COUNT', 1, 'STREAMS', stream, '>')
//     if (result) {
//       for (let index = 0; index < result[0][1].length; index++) {
//         const ele = result[0][1][index]
//         id = ele[0]
//         const iIdObj = JSON.parse(ele[1][1])
//         if (iIdObj.categoryId) {
//           const category = await HomePage.findOne({ _id: ObjectId(iIdObj.categoryId) }).lean()
//           category.aArticle[category.aArticle.findIndex((ele) => ele._id.toString() === iIdObj.iId)].oSeo = { sSlug: iIdObj.sSlug }
//           const articleSlug = await HomePage.updateOne({ _id: ObjectId(iIdObj.categoryId) }, { aArticle: category.aArticle })
//           if (articleSlug.modifiedCount) console.log('Article slug modified')
//         } else {
//           const categorySlug = await HomePage.updateOne({ _id: ObjectId(iIdObj.iId) }, { sSlug: iIdObj.sSlug })
//           if (categorySlug.modifiedCount) console.log('Category slug modified')
//         }
//         await redisclient.xack(config.HOME_PAGE_SLUG_EVENT, config.HOME_PAGE_SLUG_GROUP, id)
//         await redisclient.xdel(config.HOME_PAGE_SLUG_EVENT, id)
//       }
//     }
//   } catch (error) {
//     console.log(error)
//   }
//   readRedisStream(config.HOME_PAGE_SLUG_EVENT, id)
// }

module.exports = { redisclient, redisAuthDb, redisMailDb, redisArticleDb }
