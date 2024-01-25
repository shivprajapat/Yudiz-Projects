const { getHelpCounts } = require('./controllers')
const { Date } = require('./scalars')

const Query = {
  getHelpCounts
}

const resolvers = { Query, Date }

module.exports = resolvers
