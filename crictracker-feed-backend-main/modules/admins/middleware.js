const Sentry = require('@sentry/node')
const { _ } = require('../../global/index')
const AdminsModel = require('../admins/model')
const SubscriptionsModel = require('../subscriptions/model') // Use service of that module rather than the model directly

class AdminMiddleware {
  async isAdminAuthenticated(req, res, next) {
    try {
      const token = req.header('Authorization')
      const lang = req.header('Language')
      if (lang === 'english') {
        req.userLanguage = 'english'
      } else {
        req.userLanguage = 'english'
      }
      if (token) {
        const admin = await AdminsModel.findByToken(token)
        if (!admin) return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})
        req.admin = admin

        const subscription = await SubscriptionsModel.findOne({ iClientId: _.mongify(admin._id), eStatus: 'a' })

        req.subscription = subscription

        return next(null, null)
      } else {
        return _.response(req, res, 'err_unauthorized', 'statusUnAuthorized', {})
      }
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
}

module.exports = new AdminMiddleware()
