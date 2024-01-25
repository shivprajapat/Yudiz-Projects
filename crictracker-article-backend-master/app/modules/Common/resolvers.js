const { getSiteMap, getFrontUrlData, addAdsTxt, deleteArticleAttachment, getAdsTxt, isFavourite } = require('./controllers')
const { Date } = require('./scalars')

const Query = {
  getSiteMap,
  getFrontUrlData,
  getAdsTxt,
  isFavourite
}

const Mutation = {
  addAdsTxt,
  deleteArticleAttachment
}

const resolvers = { Query, Mutation, Date }

module.exports = resolvers
