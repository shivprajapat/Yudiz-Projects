const { Date } = require('./scalars')
const { getWeatherCondition, removeWeatherCache } = require('./controllers')

const Query = {
  getWeatherCondition
}

const Mutations = {
  removeWeatherCache
}

const resolvers = { Query, Date, Mutations }

module.exports = resolvers
