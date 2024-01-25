const { getFrontMenu, getMenuTree, addHeaderMenu } = require('./controllers')

const Query = {
  getFrontMenu,
  getMenuTree
}

const Mutation = {
  addHeaderMenu
}

const resolvers = { Query, Mutation }

module.exports = resolvers
