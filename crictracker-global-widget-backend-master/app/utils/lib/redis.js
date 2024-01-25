const Redis = require('ioredis')
// const config = require('../../../config')
// const { ObjectId } = require('mongoose').Types
// const { cricspecials, trendingnews, PopularSeriesModel } = require('../../model')

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

redisStreamDb.on('connect', () => console.log('redis stream connected'))
redisStreamDb.on('error', (error) => console.log('Error while redis stream connection', error))

// const readRedisStream = async (stream, id = '$') => {
//   const result = await redisclient.xreadgroup('BLOCK', 1000, 'GROUP', config.HOME_WIDGET_ID_GROUP, config.HOME_WIDGET_ID_CONSUMER, 'COUNT', 1, 'STREAMS', stream, '>')
//   try {
//     if (result) {
//       for (let index = 0; index < result[0][1].length; index++) {
//         const ele = result[0][1][index]
//         id = ele[0]
//         const iIdObj = JSON.parse(ele[1][1])
//         if (iIdObj.type === 'cricspecial') {
//           const cricspecilData = []
//           const { data } = iIdObj
//           for (let index = 0; index < data.length; index++) {
//             const articleData = {
//               iArticleId: data[index]._id,
//               sTitle: data[index].sTitle,
//               sSrtTitle: data[index].sSrtTitle,
//               sSubtitle: data[index].sSubtitle,
//               oImg: data[index].oImg,
//               oTImg: data[index].oTImg,
//               dPublishDate: data[index].dPublishDate,
//               nDuration: data[index].nDuration,
//               oCategory: data[index].oCategory
//             }
//             cricspecilData.push(articleData)
//           }

//           if (cricspecilData.length > 0) {
//             const bIsCricspecialsData = await cricspecials.countDocuments({})
//             if (bIsCricspecialsData) await cricspecials.deleteMany({})
//             await cricspecials.insertMany(cricspecilData)
//           }
//         }
//         if (iIdObj.type === 'trendingnews') {
//           const trendingNewsData = []
//           const { data } = iIdObj
//           for (let index = 0; index < data.length; index++) {
//             const articleData = {
//               iArticleId: data[index]._id,
//               sTitle: data[index].sTitle,
//               sSrtTitle: data[index].sSrtTitle,
//               sSubtitle: data[index].sSubtitle,
//               oImg: data[index].oImg,
//               oTImg: data[index].oTImg,
//               dPublishDate: data[index].dPublishDate,
//               nDuration: data[index].nDuration,
//               oCategory: data[index].oCategory
//             }
//             trendingNewsData.push(articleData)
//           }

//           if (trendingNewsData.length > 0) {
//             const bIsCricspecialsData = await trendingnews.countDocuments({})
//             if (bIsCricspecialsData) await trendingnews.deleteMany({})
//             await trendingnews.insertMany(trendingNewsData)
//           }
//         }

//         await redisclient.xack(config.HOME_WIDGET_ID_EVENT, config.HOME_WIDGET_ID_GROUP, id)
//         await redisclient.xdel(config.HOME_WIDGET_ID_EVENT, id)
//       }
//     }
//     readRedisStream(config.HOME_WIDGET_ID_EVENT, id)
//   } catch (error) {
//     console.log(error)
//   }
// }

// redisclient.xgroup('CREATE', config.HOME_WIDGET_ID_EVENT, config.HOME_WIDGET_ID_GROUP, '0', 'MKSTREAM').then((res) => {
//   console.log(res)
// }).catch(error => {
//   if (error?.command?.args[0] !== 'CREATE') console.log(error)
// })

// redisclient.xlen(config.HOME_WIDGET_ID_EVENT).then((res) => {
//   console.log('event in pending', config.HOME_WIDGET_ID_EVENT, res)
//   if (res !== 0) readRedisStream(config.HOME_WIDGET_ID_EVENT, '$')
// }).catch((err) => {
//   console.log(err)
// })

// readRedisStream(config.HOME_WIDGET_ID_EVENT, '$')

// // read seo-slug-update-event
// async function readSeoSlugUpdateStreamEvent(stream, id) {
//   try {
//     const resData = await redisStreamDb.xreadgroup('BLOCK', '2000', 'GROUP', config.CREATE_SEO_SLUG_GROUP, config.CREATE_SEO_SLUG_CONSUMER_0, 'COUNT', '1', 'STREAMS', config.CREATE_SEO_SLUG_EVENT, '>')
//     let id
//     if (resData) {
//       for (let index = 0; index < resData[0][1].length; index++) {
//         const ele = resData[0][1][index]
//         id = ele[0]
//         const obj = JSON.parse(ele[1][1])
//         const { eType, sSlug, iId } = obj
//         if (eType === 'se') { // for series type seo
//           await PopularSeriesModel.updateOne({ iSeriesId: ObjectId(iId), eStatus: 'a' }, { sSlug }, { upsert: true })
//         }

//         await redisStreamDb.xack(config.CREATE_SEO_SLUG_EVENT, config.CREATE_SEO_SLUG_GROUP, id)
//         await redisStreamDb.xdel(config.CREATE_SEO_SLUG_EVENT, id)
//       }
//     }
//     readSeoSlugUpdateStreamEvent(config.CREATE_SEO_SLUG_EVENT, id)
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }
// readSeoSlugUpdateStreamEvent(config.CREATE_SEO_SLUG_EVENT, '$')

// redisStreamDb.xlen(config.CREATE_SEO_SLUG_EVENT).then((res) => {
//   console.log('event in pending', config.CREATE_SEO_SLUG_EVENT, res)
//   if (res !== 0) readSeoSlugUpdateStreamEvent(config.CREATE_SEO_SLUG_EVENT, '$')
// }).catch((err) => {
//   console.log(err)
// })

// function addCurrentSeriesStream(obj) {
//   redisStreamDb.xadd(config.CREATE_CURRENT_SERIES_EVENT, '*', 'dataObj', JSON.stringify(obj))
//     .then(res => console.log(res))
//     .catch(error => console.log(error))
// }

// redisStreamDb.xgroup('CREATE', config.CREATE_CURRENT_SERIES_EVENT, config.CREATE_CURRENT_SERIES_GROUP, '0', 'MKSTREAM')
//   .then((res) => console.log(res))
//   .catch(error => {
//     if (error?.command?.args[0] !== 'CREATE') console.log(error)
//   })

module.exports = { redisclient, redisAuthDb, redisMailDb, redisArticleDb }
