const { redis } = require('../../utils')

const Subscription = {
  articleTakeOver: {
    async resolve(payload, args, { dataSources: { gatewayApi } }, info) {
      return await gatewayApi.fetchAndMergeNonPayloadArticleData(null, payload, info)
    },
    subscribe: (parent, { input }, args) => {
      return redis.pubsub.asyncIterator([`articleTakeOver:${input._id}:${input.iAdminId}`])
    }
  },
  articleTakeOverUpdate: {
    subscribe: (parent, { input }, args) => {
      return redis.pubsub.asyncIterator([`articleTakeOverUpdate:${input._id}:${input.iAdminId}`])
    }
  },
  listLiveBlogContent: {
    async resolve(payload, args, { dataSources: { gatewayApi } }, info) {
      return await gatewayApi.fetchAndMergeNonPayloadBlogContent(null, payload, info)
    },
    subscribe: (parent, { input }, args) => {
      return redis.pubsub.asyncIterator([`listLiveBlogContent:${input?.iEventId}`])
    }
  },
  getLiveMatchScore: {
    subscribe: (parent, { input }, args) => {
      return redis.pubsub.asyncIterator([`getLiveMatchScore:${input?.iEventId}`])
    }
  }
}

const resolvers = { Subscription }

module.exports = resolvers
