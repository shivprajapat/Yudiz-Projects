const Sentry = require('@sentry/node')
const { _ } = require('../../global/index')
const { redis: { redisFeedDb } } = require('../../utils/index')
const ClientModel = require('./model')

class ClientMiddleware {
  async isClientAuthenticated(req, res, next) {
    try {
      const token = req.header('Authorization')
      const decodedToken = _.decodeToken(token)
      const lang = req.header('Language')
      if (lang === 'english') {
        req.userLanguage = 'english'
      } else {
        req.userLanguage = 'english'
      }

      if (!token || !decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})

      // check if login token is added to restricted list or not
      if (await redisFeedDb.get(`lt:${req.header('Authorization')}`)) return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})

      const client = await ClientModel.findOne({ 'aToken.sToken': token })

      if (!client) return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})
      req.client = client

      return next(null, null)
    } catch (error) {
      Sentry.captureException(error)
      console.log(error)
      return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})
    }
  }

  async isFeedClientAuthenticated(req, res, next) {
    try {
      const token = req.header('Authorization')
      const decodedToken = _.decodeToken(token)
      const lang = req.header('Language')
      if (lang === 'english') {
        req.userLanguage = 'english'
      } else {
        req.userLanguage = 'english'
      }
      if (!token || !decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})

      // check if login token is added to restricted list or not
      if (await redisFeedDb.get(`lt:${req.header('Authorization')}`)) return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})

      const client = await ClientModel.findOne({ 'aJwtTokens.sToken': token })

      if (!client) return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})
      req.client = client

      return next(null, null)
    } catch (error) {
      Sentry.captureException(error)
      console.log(error)
      return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})
    }
  }

  async setLanguage(req, res, next) {
    const lang = req.header('Language')
    if (lang === 'english') {
      req.userLanguage = 'english'
    } else {
      req.userLanguage = 'english'
    }

    return next(null, null)
  }

  async checkArticleSubType(req, res, next) {
    try {
      const { subscription } = req
      if (!subscription.aSubscriptionType.includes('article')) return res.status(401).send({ sMessage: 'No article Subscription found' })
      next()
    } catch (error) {
      next(error)
    }
  }

  async checkCatSubType(req, res, next) {
    try {
      const { subscription } = req
      if (!subscription.aSubscriptionType.includes('category')) return res.status(401).send({ sMessage: 'No Category Subscription found' })
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ClientMiddleware()
