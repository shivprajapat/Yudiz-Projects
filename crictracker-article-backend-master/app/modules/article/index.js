const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    createArticle: and(isAuthenticated, Permissions.isCreateArticleAuthorized),
    createArticleComment: and(isAuthenticated),
    editArticle: and(isAuthenticated, Permissions.isEditArticleAuthorized),
    pickArticle: and(isAuthenticated, Permissions.isPickArticleAuthorized),
    editDisplayAuthor: and(isAuthenticated, Permissions.isChangeDisplayAuthorAuthorized),
    updateArticleStatus: and(isAuthenticated, Permissions.isUpdateArticleAuthorized)
  },
  Query: {
    getArticle: and(isAuthenticated, Permissions.isGetArticleAuthorized),
    listArticle: and(isAuthenticated, Permissions.isListArticleAuthorized),
    listArticleComment: and(isAuthenticated, Permissions.isListArticleCommentAuthorized),
    getArticleCounts: and(isAuthenticated),
    getPreviewArticleFront: and(isAuthenticated),
    getArticleFront: and(Permissions.isArticleBookmarked, Permissions.isArticlePublished)
  }
}

module.exports = { typeDefs, resolvers, permissions }
