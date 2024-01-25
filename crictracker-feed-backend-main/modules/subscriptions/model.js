const mongoose = require('mongoose')
const { connection: { feedConnection } } = require('../../app/db')
const { ObjectId } = mongoose.Schema.Types
const SubscriptionEnums = require('./enums')

const subscriptions = new mongoose.Schema({
  iClientId: { type: ObjectId, ref: 'clients', require: true },
  aSubscriptionType: [{
    type: String,
    enum: SubscriptionEnums.eSubscriptionType.value,
    default: SubscriptionEnums.eSubscriptionType.default
  }],
  dSubscriptionStart: { type: Date, require: true },
  dSubscriptionEnd: { type: Date, require: true },
  eStatus: {
    type: String,
    enum: SubscriptionEnums.eStatus.value,
    default: SubscriptionEnums.eStatus.default
  },
  aCategoryIds: [{ type: ObjectId }],
  oStats: {
    nApiTotal: { type: Number, default: 0 },
    nArticleTotal: { type: Number, default: 0 },
    nExclusiveTotal: { type: Number, default: 0 },
    nApiUsed: { type: Number, default: 0 },
    nArticleUsed: { type: Number, default: 0 },
    nExclusiveUsed: { type: Number, default: 0 }
  }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

subscriptions.index({ eStatus: 1 })

module.exports = feedConnection.model('subscriptions', subscriptions)
