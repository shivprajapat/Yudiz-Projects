const { and } = require('graphql-shield')
const Permissions = require('./permissions')
const { isAuthenticated } = require('../Common/permissions')
const typeDefs = require('./typedef')
const resolvers = require('./resolvers')

const permissions = {
  Mutation: {
    addCategory: and(isAuthenticated, Permissions.isCreateCategoryAuthorized, Permissions.isCategoryNameUnique, Permissions.isSeriesCategoryAssigned),
    editCategory: and(isAuthenticated, Permissions.isEditCategoryAuthorized, Permissions.isCategoryNameUnique, Permissions.isSeriesCategoryAssigned),
    updateCategoryStatus: and(isAuthenticated, Permissions.isEditCategoryAuthorized),
    bulkCategoryUpdate: and(isAuthenticated, Permissions.isEditCategoryAuthorized),
    deleteCategory: and(isAuthenticated, Permissions.isDeleteCategoryAuthorized)
  },
  Query: {
    getCategory: and(isAuthenticated, Permissions.isListCategoryAuthorized),
    getCategoryById: and(isAuthenticated, Permissions.isEditCategoryAuthorized),
    getCategoryByIdFront: and(Permissions.isFavouriteCategory),
    getApiSeriesCategory: and(isAuthenticated, Permissions.isEditCategoryAuthorized)
  }
}

module.exports = { typeDefs, resolvers, permissions }
