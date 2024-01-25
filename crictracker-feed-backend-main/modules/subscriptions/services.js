const SubscriptionsModel = require('./model')
const { _ } = require('../../global')

class Subscriptions {
  async fetchActiveSubscription(req, res) {
    try {
      console.log(req.client)
      let subscription = await SubscriptionsModel.findOne({ _id: req.client.iSubscriptionId, eStatus: 'a' }).lean()
      subscription = _.pick(subscription, ['aSubscriptionType', 'dSubscriptionStart', 'dSubscriptionEnd', 'aCategoryIds', 'oStats'])

      return _.response(req, res, 'fetchSuccess', 'statusOk', subscription, 'subscription')
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }
}

module.exports = new Subscriptions()
