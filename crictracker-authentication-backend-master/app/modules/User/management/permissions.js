const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../../global')
const permissions = {}

permissions.isUpdateUserAuthorized = rule('Update User Status')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (input?.eStatus === 'd') {
      if (!data) _.throwError('deleteUserNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('deleteUserNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'DELETE_USER') < 0) _.throwError('deleteUserNotAuthorized', context)
    } else {
      if (!data) _.throwError('updateUserStatusNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('updateUserStatusNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'UPDATE_USER_STATUS') < 0) _.throwError('updateUserStatusNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isViewUserAuthorized = rule('View User')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (!data) _.throwError('viewUserNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('viewUserNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'VIEW_USER') < 0) _.throwError('viewUserNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListUserAuthorized = rule('List Users')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (!data) _.throwError('listUserNotAuthorized', context)
    if (data?.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('listUserNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'LIST_USER') < 0) _.throwError('listUserNotAuthorized', context)
    return true
  } catch (error) {
    console.log('error', error)
    return error
  }
})

permissions.isDeletUserAuthorized = rule('Delete User')(async (parent, { input }, context) => {
  try {
    const { decodedToken } = context
    if (!decodedToken) _.throwError('authorizationError', context)
    if (!decodedToken?.iUserId) _.throwError('authorizationError', context)
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
