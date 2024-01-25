const { addFavourite, deleteFavourite, listFavourite } = require('./controllers')

const Mutation = {
  addFavourite,
  deleteFavourite
}

const Query = {
  listFavourite
}

const oFavourite = {
  oSeo: (favourite) => {
    return { __typename: 'Seo', iId: favourite.iId }
  }

}

const resolvers = { Query, Mutation, oFavourite }

module.exports = resolvers
