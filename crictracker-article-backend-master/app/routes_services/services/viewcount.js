/* eslint-disable camelcase */
const { articles: ArticlesModel, VideosModel } = require('../../model')
const { redisclient } = require('../../utils/lib/redis')

class Viewcount {
  async updateArticleViewcount(req, res) {
    try {
      const data = await redisclient.hgetall('articles')

      if (data) {
        Object.keys(data).forEach(async (elem) => {
          const count = data[elem]
          const id = elem.split(':')[1]

          const article = await ArticlesModel.findOne({ _id: id }).lean()
          if (article) {
            let oldCount = 0
            let oldDisplayCount = 0
            if (article.nOViews) {
              oldCount = parseInt(article.nOViews)
              oldDisplayCount = parseInt(article.nViewCount)
            }
            const latestCount = parseInt(oldCount) + parseInt(count)
            const latestDisplayCount = parseInt(oldDisplayCount) + parseInt(count)
            article.nOViews = latestCount
            article.nViewCount = latestDisplayCount
            await ArticlesModel.updateOne({ _id: id }, { nOViews: latestCount, nViewCount: latestDisplayCount })
            // Delete redis key data
            await redisclient.hdel('articles', elem)
          }
        })
      }
      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: 'viewcount/redis-to-article Done', data: { bIsExist: false, sLink: {} } })
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'viewcount/redis-to-article Error' })
    }
  }

  async updateVideoViewcount(req, res) {
    try {
      const data = await redisclient.hgetall('videos')

      if (data) {
        Object.keys(data).forEach(async (elem) => {
          const count = data[elem]
          const id = elem.split(':')[1]

          const video = await VideosModel.findOne({ _id: id })
          let oldCount = 0
          if (video) {
            if (video?.nViewCount) {
              oldCount = parseInt(video?.nViewCount)
            }
            const latestCount = parseInt(oldCount) + parseInt(count)
            video.nViewCount = latestCount
            await VideosModel.updateOne({ _id: id }, { nViewCount: latestCount })
            // Delete redis key data
            await redisclient.hdel('videos', elem)
          }
        })
      }
      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: 'viewcount/redis-to-video Done', data: { bIsExist: false, sLink: {} } })
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'viewcount/redis-to-video Done' })
    }
  }
}

module.exports = new Viewcount()
