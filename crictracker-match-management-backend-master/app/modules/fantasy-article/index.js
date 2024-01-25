const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const { isAuthenticated } = require('../Common/permissions')

const permissions = {
  Mutation: {
    deleteFantasyArticle: and(isAuthenticated),
    createFantasyArticleComment: and(isAuthenticated),
    editFantasyDisplayAuthor: and(isAuthenticated, Permissions.isChangeFantasyDisplayAuthorAuthorized),
    editMatchOverview: and(isAuthenticated, Permissions.isMatchOveriewAuthorized),
    updateFantasyTipsStatus: and(isAuthenticated, Permissions.isCreateFantasyArticleAuthorized),
    pickFantasyArticle: and(isAuthenticated, Permissions.isPickFantasyArticleAuthorized),
    createFantasyArticle: and(isAuthenticated, Permissions.isCreateFantasyArticleAuthorized),
    editFantasyArticle: and(isAuthenticated, Permissions.isEditFantasyArticleAuthorized),
    updateFantasyArticleStatus: and(isAuthenticated, Permissions.isUpdateFantasyArticleAuthorized),
    copyFantasyArticle: and(isAuthenticated, Permissions.isCreateFantasyArticleAuthorized),
    editPlayerRating: and(isAuthenticated, Permissions.isCreateFantasyArticleAuthorized)
  },
  Query: {
    getMatchOverview: and(isAuthenticated, Permissions.isMatchOveriewAuthorized),
    getFantasyArticle: and(isAuthenticated, Permissions.getFantasyArticle),
    getPreviewFantasyArticleFront: and(Permissions.getPreviewFantasyArticle),
    listFantasyArticleComment: and(isAuthenticated, Permissions.isListFantasyArticleCommentAuthorized),
    listFantasyArticle: and(isAuthenticated, Permissions.isListFantasyArticleAuthorized),
    listFantasyMatch: and(isAuthenticated, Permissions.isListFantasyArticleAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
