
const { listAuthors, getAuthor } = require('./controllers')

const Query = {
  listAuthors,
  getAuthor
}

const Author = {
  oSeo: (author) => {
    return { __typename: 'Seo', iId: author._id }
  }
}

const resolvers = {
  Query,
  Author
}

module.exports = resolvers
