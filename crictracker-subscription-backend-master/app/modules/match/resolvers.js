const { redis } = require('../../utils')

const Subscription = {
  fetchMiniScorecardData: {
    async resolve(payload, args, { dataSources: { gatewayApi } }, info) {
      // console.log('called, fetchMiniScorecardData')
      return await gatewayApi.fetchAndMergeNonPayloadMiniscorecardData(null, payload, info)
    },
    subscribe: () => redis.pubsub.asyncIterator(['fetchMiniScorecardData'])
  },
  fetchLiveInningsData: {
    subscribe: (parent, { input }, args) => {
      // console.log('called, fetchLiveInningsData')
      return redis.pubsub.asyncIterator([`fetchLiveInningsData:${input.iMatchId}`])
    }
  },
  listMatchOvers: {
    subscribe: (parent, { input }, args) => {
      // console.log('called, listMatchOvers')
      return redis.pubsub.asyncIterator([`listMatchOvers:${input.iMatchId}`])
    }
  },
  listMatchCommentaries: {
    subscribe: (parent, { input }, args) => {
      // console.log('called, listMatchCommentaries')
      return redis.pubsub.asyncIterator([`listMatchCommentaries:${input.iMatchId}`])
    }
  },
  getMatchBySlug: {
    subscribe: (parent, { input }, args) => {
      // console.log('called, getMatchBySlug')
      return redis.pubsub.asyncIterator([`getMatchBySlug:${input.iMatchId}`])
    }
  }
}

const resolvers = { Subscription }

module.exports = resolvers
