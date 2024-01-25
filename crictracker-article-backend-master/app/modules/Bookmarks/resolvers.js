const { addUserBookmark, deleteBookmark, listBookmarks, getBookmarks } = require('./controllers')

const Mutation = {
  addUserBookmark,
  deleteBookmark
}

const Query = {
  listBookmarks,
  getBookmarks
}

const bookmark = {
  oFantasyArticle: (bookmark) => {
    if (bookmark.eBookmarkType === 'fa') {
      return { __typename: 'frontFantasyArticle', _id: bookmark.iArticleId }
    }
  }
}

const resolvers = { Mutation, Query, bookmark }

module.exports = resolvers
