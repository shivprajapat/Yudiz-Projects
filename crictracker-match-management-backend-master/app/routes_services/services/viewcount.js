/* eslint-disable camelcase */
const { fantasyarticles: FantasyArticlesModel } = require('../../model')
const { redisclient } = require('../../utils/lib/redis')

class Viewcount {
  async updateFantasyArticleViewcount(req, res) {
    try {
      const data = await redisclient.hgetall('fantasyarticles')

      if (data) {
        Object.keys(data).forEach(async (elem) => {
          const count = data[elem]
          const id = elem.split(':')[1]

          const article = await FantasyArticlesModel.findOne({ _id: id }).lean()
          if (article) {
            let oldCount = 0
            let oldDisplayCount = 0
            if (article.nViewCount) {
              oldCount = parseInt(article.nViewCount)
              oldDisplayCount = parseInt(article.nViewCount)
            }

            const latestCount = parseInt(oldCount) + parseInt(count)
            const latestDisplayCount = parseInt(oldDisplayCount) + parseInt(count)
            article.nOViews = latestCount
            article.nViewCount = latestDisplayCount
            await FantasyArticlesModel.updateOne({ _id: id }, { nOViews: latestCount, nViewCount: latestDisplayCount })
            // Delete redis key data
            await redisclient.hdel('fantasyarticles', elem)
          }
        })
      }
      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'Redis to fantasy article viewcount Done', data: { bIsExist: false, data } })
    } catch (error) {
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'redis-to-fantasyarticle Error' })
    }
  }
}

module.exports = new Viewcount()
