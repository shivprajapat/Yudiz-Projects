const { ping } = require('./controllers')

const Query = {
  ping
}

const resolvers = { Query }

module.exports = resolvers
