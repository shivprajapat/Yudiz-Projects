const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const permissions = {}

permissions.isCreateCurrentSeriesAuthorized = rule('Add Current Series')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('createCurrentSeriesNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('createCurrentSeriesNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'CREATE_CURRENT_SERIES') < 0) _.throwError('createCurrentSeriesNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isUpdateCurrentSeriesAuthorized = rule('Update Current Series')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (input?.eStatus === 'd') {
      if (!data) _.throwError('deleteCurrentSeriesNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('deleteCurrentSeriesNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'DELETE_CURRENT_SERIES') < 0) _.throwError('deleteCurrentSeriesNotAuthorized', context)
    } else {
      if (!data) _.throwError('updateCurrentSeriesStatusNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('updateCurrentSeriesStatusNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'UPDATE_CURRENT_SERIES_STATUS') < 0) _.throwError('updateCurrentSeriesStatusNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isListCurrentSeriesAuthorized = rule('List Current Series')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)
    if (!data) _.throwError('listCurrentSeriesNotAuthorized', context)
    if (data?.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('listCurrentSeriesNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'LIST_CURRENT_SERIES') < 0) _.throwError('listCurrentSeriesNotAuthorized', context)
    return true
  } catch (error) {
    console.log('error', error)
    return error
  }
})

module.exports = permissions
