const { rss: RssModel } = require('../../app/model')

class RssService {
  async getRssesByQuery(query = {}, populate = [], sort = undefined, offset = 0, limit = 0) {
    try {
      const rss = await RssModel.find(query).populate(populate).sort(sort ?? { dCreatedAt: -1 }).skip(offset).limit(limit).lean()
      return rss
    } catch (error) {
      return error
    }
  }
}

module.exports = new RssService()
