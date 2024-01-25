const mongoose = require('mongoose')
const { connection: { feedConnection } } = require('../../app/db')
const { ObjectId } = mongoose.Schema.Types
const momentTz = require('moment-timezone')

const apilogs = new mongoose.Schema({
  iSubscriptionId: { type: ObjectId, ref: 'subscriptions' },
  iClientId: { type: ObjectId, ref: 'clients' },
  sIp: { type: String },
  oSeo: { type: Object },
  iArticleId: { type: ObjectId },
  oArticle: {
    sTitle: String
  },
  eType: { type: String },
  dFetchedOn: { type: Date, default: momentTz().tz('Asia/Kolkata') }
}, { timestamps: { createdAt: 'dCreated', updatedAt: 'dUpdated' } })

module.exports = feedConnection.model('apilogs', apilogs)
