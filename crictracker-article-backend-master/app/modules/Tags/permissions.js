const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const { userfavourites: UserFavouritesModel } = require('../../model')

const permissions = {}

permissions.isCreateTagAuthorized = rule('Create Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('createTagNotAuthorized', context)
    if (!data.aPermissions) _.throwError('createTagNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'CREATE_TAG') < 0) _.throwError('createTagNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.bulkActionAuthorized = rule('Bulk action autorized')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    const { eStatus, eType } = input

    if (eStatus === 'd' && !eType) _.throwError('formFieldInvalid', context, 'tag')
    if (data.eType === 'su') return true
    if (eStatus === 'a' || eStatus === 'i') {
      if (!data) _.throwError('changeStatusTagNotAuthorized', context)
      if (!data.aPermissions) _.throwError('changeStatusTagNotAuthorized', context)
      if (data.aPermissions.findIndex(ele => ele === 'CHANGE_STATUS_ACTIVE_TAG') < 0) _.throwError('changeStatusTagNotAuthorized', context)
    }
    if (eStatus === 'd') {
      if (eType === 'a') {
        if (!data) _.throwError('deleteActiveTagNotAuthorized', context)
        if (!data.aPermissions) _.throwError('deleteActiveTagNotAuthorized', context)
        if (data.aPermissions.findIndex(ele => ele === 'DELETE_ACTIVE_TAG') < 0) _.throwError('deleteActiveTagNotAuthorized', context)
      }

      if (eType === 'r') {
        if (!data) _.throwError('deleteRequestsTagNotAuthorized', context)
        if (!data.aPermissions) _.throwError('deleteRequestsTagNotAuthorized', context)
        if (data.aPermissions.findIndex(ele => ele === 'DELETE_REQUESTS_TAG') < 0) _.throwError('deleteRequestsTagNotAuthorized', context)
      }

      if (eType === 're') {
        if (!data) _.throwError('deleteRequestedTagNotAuthorized', context)
        if (!data.aPermissions) _.throwError('deleteRequestedTagNotAuthorized', context)
        if (data.aPermissions.findIndex(ele => ele === 'DELETE_REQUESTED_TAG') < 0) _.throwError('deleteRequestedTagNotAuthorized', context)
      }
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isEditTagAuthorized = rule('Edit Active Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (!data) _.throwError('editTagNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data.aPermissions) _.throwError('editTagNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_ACTIVE_TAG') < 0) _.throwError('editTagNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isEditRequestedTagAuthorized = rule('Edit Requested Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    const { eStatus } = input

    if (data.eType === 'su') return true
    if (eStatus === 'd') _.throwError('formFieldInvalid', context, 'tag')

    if (eStatus === 'a' || eStatus === 'i') {
      if (!data) _.throwError('changeStatusTagNotAuthorized', context)
      if (!data.aPermissions) _.throwError('changeStatusTagNotAuthorized', context)
      if (data.aPermissions.findIndex(ele => ele === 'CHANGE_STATUS_ACTIVE_TAG') < 0) _.throwError('changeStatusTagNotAuthorized', context)
    }

    if (eStatus === 'ap' || eStatus === 'dec') {
      if (!data) _.throwError('acceptTagNotAuthorized', context)
      if (!data.aPermissions) _.throwError('acceptTagNotAuthorized', context)
      if (data.aPermissions.findIndex(ele => ele === 'APPROVE_REJECT_REQUESTS_TAG') < 0) _.throwError('acceptTagNotAuthorized', context)
    }

    return true
  } catch (error) {
    return error
  }
})

permissions.isDeleteTagAuthorized = rule('Delete Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    const { eType } = input

    if (data.eType === 'su') return true
    if (eType === 'a') {
      if (!data) _.throwError('deleteActiveTagNotAuthorized', context)
      if (!data.aPermissions) _.throwError('deleteActiveTagNotAuthorized', context)
      if (data.aPermissions.findIndex(ele => ele === 'DELETE_ACTIVE_TAG') < 0) _.throwError('deleteActiveTagNotAuthorized', context)
    }

    if (eType === 'r') {
      if (!data) _.throwError('deleteRequestsTagNotAuthorized', context)
      if (!data.aPermissions) _.throwError('deleteRequestsTagNotAuthorized', context)
      if (data.aPermissions.findIndex(ele => ele === 'DELETE_REQUESTS_TAG') < 0) _.throwError('deleteRequestsTagNotAuthorized', context)
    }

    if (eType === 're') {
      if (!data) _.throwError('deleteRequestedTagNotAuthorized', context)
      if (!data.aPermissions) _.throwError('deleteRequestedTagNotAuthorized', context)
      if (data.aPermissions.findIndex(ele => ele === 'DELETE_REQUESTED_TAG') < 0) _.throwError('deleteRequestedTagNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isGetTagAuthorized = rule('Get Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('getTagNotAuthorized', context)
    if (!data.aPermissions) _.throwError('getTagNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_ACTIVE_TAG') < 0) _.throwError('getTagNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListTagAuthorized = rule('List Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    const { aStatusFiltersInput } = input

    if (data.eType === 'su') return true
    if (!data) _.throwError('listTagNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listTagNotAuthorized', context)
    if (aStatusFiltersInput?.includes('a') && aStatusFiltersInput?.includes('i')) {
      if (data.aPermissions.findIndex(ele => ele === 'LIST_ACTIVE_TAG') < 0) _.throwError('listTagNotAuthorized', context)
    }

    if (aStatusFiltersInput?.find((ele) => ele === 'r') && aStatusFiltersInput?.length === 1) {
      if (data.aPermissions.findIndex(ele => ele === 'LIST_REQUESTS_TAG') < 0) _.throwError('listTagNotAuthorized', context)
    }

    return true
  } catch (error) {
    return error
  }
})

permissions.isFavouriteTag = rule('Favourite Tag')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { decodedToken } = context

    if (authorization !== 'undefined' && decodedToken && decodedToken !== 'jwt expired' && decodedToken.iUserId && decodedToken !== 'invalid signature' && decodedToken !== 'jwt malformed') {
      const fav = await UserFavouritesModel.findOne({ iUserId: _.mongify(decodedToken?.iUserId), iId: _.mongify(input?._id) })

      input.bIsFav = !!fav
    }
    return true
  } catch (error) {
    console.log(error)
    return error
  }
})

module.exports = permissions
