const async = require('async')
const { fantasyarticles: FantasyArticlesModel } = require('../../model')
const { queuePush } = require('../../utils')

class FantasyArticles {
  async fantasyArticleFeed(req, res) {
    try {
      const fantasyArticles = await FantasyArticlesModel.find({ eState: 'pub' }).sort({ dPublishDate: -1 }).skip(0).limit(20)
      let countFlag = 0
      async.each(fantasyArticles, async (article, cb) => {
        countFlag++

        if (countFlag === 20) {
          article._doc.isLast = true
        }
        await queuePush('fantasyArticlesForFeed', { article })
        cb()
      }, async (err) => {
        return res.send({ err, message: 'fantasy-article-feed Done' })
      })
    } catch (error) {
      console.log({ error })
      return res.send({ message: 'fantasy-article-feed Error' })
    }
  }
}

module.exports = new FantasyArticles()
