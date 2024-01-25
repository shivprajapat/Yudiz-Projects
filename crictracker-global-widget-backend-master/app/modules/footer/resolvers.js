const { getFrontFooter, addFooterMenu } = require('./controllers')

const Mutation = {
  addFooterMenu
}

const Query = {
  getFrontFooter
}

const resolvers = { Query, Mutation }

module.exports = resolvers
