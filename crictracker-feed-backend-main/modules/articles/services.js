const { articles: ArticlesModel } = require('../../app/model')
const seoClient = require('./grpc/seo.client')
const authClient = require('./grpc/auth.client')

class ArticleService {
  async getArticle(_id) {
    try {
      const article = await ArticlesModel.findById(_id).lean()
      return article
    } catch (error) {
      return error
    }
  }

  async getArticleByQuery(query = {}, populate = []) {
    try {
      const article = ArticlesModel.findOne(query).populate(populate).lean()
      return article
    } catch (error) {
      return error
    }
  }

  async getArticlesByQuery(query = {}, populate = [], sort = undefined, offset = 0, limit = 0) {
    try {
      const article = await ArticlesModel.find(query).populate(populate).sort(sort ?? { dCreated: -1 }).skip(offset).limit(limit).lean()
      return article
    } catch (error) {
      return error
    }
  }

  async getSeoData(params) {
    return new Promise((resolve, reject) => {
      seoClient.getSeoData(params, (err, response) => {
        if (err) return reject(err)
        return resolve(response)
      })
    })
  }

  async getAdmin(params) {
    return new Promise((resolve, reject) => {
      authClient.getAdmin(params, (err, response) => {
        if (err) return reject(err)
        return resolve(response)
      })
    })
  }

  async getSeoBySlug(params) {
    return new Promise((resolve, reject) => {
      seoClient.getSeoBySlug(params, (err, response) => {
        if (err) return reject(err)
        return resolve(response)
      })
    })
  }
}

module.exports = new ArticleService()
