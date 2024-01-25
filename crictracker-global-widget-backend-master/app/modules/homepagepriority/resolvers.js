const { getHomePagePriority, updateHomePagePriority } = require('./controllers')

const Mutation = {
  updateHomePagePriority
}

const Query = {
  getHomePagePriority
}

const resolvers = { Mutation, Query }

module.exports = resolvers
