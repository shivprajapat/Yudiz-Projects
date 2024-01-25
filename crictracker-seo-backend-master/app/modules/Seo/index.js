const { isAuthenticated, changeSeoPicture, isAddSeoAuthorized, isUpdateSeoAuthorized, isEditSeoAuthorized, isGetSeoAuthorized, isListSeoAuthorized } = require('./permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')
const { and } = require('graphql-shield')

const permissions = {
  Mutation: {
    insertSeo: isAuthenticated,
    editSeo: isAuthenticated,
    changeSeoPicture: and(isAuthenticated, changeSeoPicture),
    addSeo: and(isAuthenticated, isAddSeoAuthorized),
    updateSeo: and(isAuthenticated, isUpdateSeoAuthorized),
    bulkSeoUpdate: and(isAuthenticated, isEditSeoAuthorized)
  },
  Query: {
    generateSlugs: isAuthenticated,
    getSeoBySlug: and(isAuthenticated, isGetSeoAuthorized),
    getSeoById: and(isAuthenticated, isGetSeoAuthorized),
    listSeo: and(isAuthenticated, isListSeoAuthorized),
    getSeosById: and(isAuthenticated, isGetSeoAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
