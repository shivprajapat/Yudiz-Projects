/* eslint-disable camelcase */
const { articles } = require('../../model')
const { redisclient } = require('../../utils/lib/redis')
const _ = require('../../../global')
const grpcControllers = require('../../grpc/client')

class Widget {
  async cricspecial(req, res) {
    try {
      const query = { eState: 'pub', eVisibility: 'pb', 'oAdvanceFeature.bExclusiveArticle': true }
      const projection = {
        _id: 1,
        sTitle: 1,
        sSrtTitle: 1,
        sSubtitle: 1,
        oImg: 1,
        oTImg: 1,
        dPublishDate: 1,
        nDuration: 1,
        iCategoryId: 1
      }

      let aResults = await articles.find(query, projection).populate([{ path: 'oCategory', select: '_id sName sContent' }]).sort({ dPublishDate: -1 }).limit(5).lean()

      if (!aResults.length) {
        delete projection.iCategoryId
        Object.assign(projection, { oCategory: {} })

        projection.oCategory._id = 1
        projection.oCategory.sName = 1
        projection.oCategory.sContent = 1

        aResults = await articles.aggregate([
          {
            $match: { eState: 'pub', eVisibility: 'pb' }
          },
          {
            $sample: { size: 5 }
          },
          {
            $lookup:
            {
              from: 'categories',
              localField: 'iCategoryId',
              foreignField: '_id',
              as: 'oCategory'
            }
          },
          {
            $unwind: {
              path: '$oCategory',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: projection
          }

        ])
      }

      /*
        Replacing queue HOME_WIDGET_ID_EVENT with updateGlobalWidgetByType
        await redis.redisclient.xadd(config.HOME_WIDGET_ID_EVENT, '*', 'cricspecial', JSON.stringify({ type: 'cricspecial', data: aResults }))
      */

      await grpcControllers.updateGlobalWidgetByType({ type: 'cricspecial', data: aResults })
      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: 'cricspecial-article Done', data: { bIsExist: false, count: aResults.length } })
    } catch (error) {
      console.log({ error })
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'cricspecial-article Error' })
    }
  }

  async trendingNews(req, res) {
    try {
      const data = await redisclient.hgetall('articles')
      let redisArticleIds = []
      if (data) {
        Object.keys(data).forEach(async (elem) => {
          const id = elem.split(':')[1]
          if (id.lenght === 24) redisArticleIds.push(id)
          else redisclient.hdel('articles', elem)
        })
      }

      const projection = {
        iArticleId: 1,
        sTitle: 1,
        sSrtTitle: 1,
        sSubtitle: 1,
        oImg: 1,
        oTImg: 1,
        dPublishDate: 1,
        nDuration: 1,
        iCategoryId: 1
      }

      /** get recent articles from redis */
      let aResults = []
      if (redisArticleIds.length > 0) {
        redisArticleIds = redisArticleIds.map(id => _.mongify(id))
        // console.log({ redisArticleIds })
        const query = {
          _id: { $in: redisArticleIds },
          eState: 'pub'
        }
        aResults = await articles.find(query, projection).populate([{ path: 'oCategory', select: '_id sName sContent' }]).sort({ dPublishDate: -1, nViewCount: -1 }).lean()
      }

      /** get latest articles from */
      const mostviewQuery = {
        _id: { $nin: redisArticleIds },
        eState: 'pub'
      }
      const latestMostviewArticle = await articles.find(mostviewQuery, projection).populate([{ path: 'oCategory', select: '_id sName sContent' }]).sort({ dPublishDate: -1, nViewCount: -1 }).skip(0).limit(20).lean()

      /** combine redis and recent publish articles */
      const trendingArticles = [...new Set([...aResults, ...latestMostviewArticle])]

      /*
        Replacing queue HOME_WIDGET_ID_EVENT with updateGlobalWidgetByType
        await redis.redisclient.xadd(config.HOME_WIDGET_ID_EVENT, '*', 'cricspecial', JSON.stringify({ type: 'cricspecial', data: aResults }))
      */

      await grpcControllers.updateGlobalWidgetByType({ type: 'trendingnews', data: trendingArticles })

      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: 'trending-news Done', data: { bIsExist: false, sLink: {} } })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'trending-news Error' })
    }
  }
}

module.exports = new Widget()
