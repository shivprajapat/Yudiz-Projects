const { updateMiniScoreCardPriority, getMiniScoreCardPriority } = require('./controllers')

const Mutation = {
  updateMiniScoreCardPriority
}

const Query = {
  getMiniScoreCardPriority
}

const resolvers = { Mutation, Query }

module.exports = resolvers
