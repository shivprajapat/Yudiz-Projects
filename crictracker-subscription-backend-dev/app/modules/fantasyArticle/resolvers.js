const { redis } = require('../../utils')

const Subscription = {
  fantasyArticleTakeOver: {
    async resolve(payload, args, { dataSources: { gatewayApi } }, info) {
      return await gatewayApi.fetchAndMergeNonPayloadArticleData(null, payload, info)
    },
    subscribe: (parent, { input }, args) => redis.pubsub.asyncIterator([`fantasyArticleTakeOver:${input._id}:${input.iAdminId}`])
  },
  fantasyArticleTakeOverUpdate: {
    subscribe: (parent, { input }, args) => redis.pubsub.asyncIterator([`fantasyArticleTakeOverUpdate:${input._id}:${input.iAdminId}`])
  }
}

const resolvers = { Subscription }

module.exports = resolvers
