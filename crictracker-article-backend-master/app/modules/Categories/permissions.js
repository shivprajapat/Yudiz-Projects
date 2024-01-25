const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const { categories, userfavourites: UserFavouritesModel } = require('../../model')

const permissions = {}

permissions.isCreateCategoryAuthorized = rule('Create Category')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('createCategoryNotAuthorized', context)
    if (!data.aPermissions) _.throwError('createCategoryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'CREATE_CATEGORY') < 0) _.throwError('createCategoryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isCategoryNameUnique = rule('Category name unique')(async (parent, { input }, context) => {
  try {
    const { _id, categoryInput } = input
    const body = _.pick(categoryInput, ['sName'])
    if (_id) {
      const findCategory = await categories.findOne({ _id: { $ne: _.mongify(_id) }, sName: { $regex: new RegExp('^' + body.sName + '$', 'i') } })
      if (findCategory) _.throwError('alreadyExists', context, 'category')
    } else {
      const findCategory = await categories.findOne({ sName: { $regex: new RegExp('^' + body.sName + '$', 'i') } })
      if (findCategory) _.throwError('alreadyExists', context, 'category')
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isEditCategoryAuthorized = rule('Edit Category')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (!data) _.throwError('editCategoryNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data.aPermissions) _.throwError('editCategoryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_CATEGORY') < 0) _.throwError('editCategoryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isGetCategoryAuthorized = rule('Get Category')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('getCategoryNotAuthorized', context)
    if (!data.aPermissions) _.throwError('getCategoryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'GET_CATEGORY') < 0) _.throwError('getCategoryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListCategoryAuthorized = rule('List Category')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('listCategoryNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listCategoryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_CATEGORY') < 0) _.throwError('listCategoryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isDeleteCategoryAuthorized = rule('Delete Category')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('deleteCategoryNotAuthorized', context)
    if (!data.aPermissions) _.throwError('deleteCategoryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'DELETE_CATEGORY') < 0) _.throwError('deleteCategoryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isFavouriteCategory = rule('Favourite category')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { decodedToken } = context

    if (authorization !== 'undefined' && decodedToken && decodedToken !== 'jwt expired' && decodedToken.iUserId && decodedToken !== 'invalid signature' && decodedToken !== 'jwt malformed') {
      const fav = await UserFavouritesModel.findOne({ iUserId: _.mongify(decodedToken?.iUserId), iId: _.mongify(input?._id) })

      input.bIsFav = !!fav
    }

    return true
  } catch (error) {
    return error
  }
})

permissions.isSeriesCategoryAssigned = rule('Check if series category is assigned')(async (parent, { input }, context) => {
  try {
    const { _id, categoryInput } = input
    const { eType, iSeriesId } = categoryInput
    if (eType === 'as') {
      if (!iSeriesId) _.throwError('formFieldRequired', context, 'seriesCategory')
      const isAssignedSeries = await categories.find({ iSeriesId: _.mongify(iSeriesId) })
      if (_id) {
        if (isAssignedSeries.some((ele) => _id?.toString() !== ele?._id?.toString())) _.throwError('seriesCategoryAssigned', context)
      }
    }

    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
