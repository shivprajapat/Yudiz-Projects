const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')

const permissions = {}

permissions.isAddPollAuthorized = rule('Create Poll')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)
    if (!data) _.throwError('createPollNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data.aPermissions) _.throwError('createPollNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'CREATE_POLL') < 0) _.throwError('createPollNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isEditPollAuthorized = rule('Edit Poll')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)
    if (!data) _.throwError('editPollNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data.aPermissions) _.throwError('editPollNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_POLL') < 0) _.throwError('editPollNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isViewPollAuthorized = rule('View Poll')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)
    if (!data) _.throwError('viewPollNotAuthorized', context)
    if (data.eType === 'su') {
      return true
    }

    if (!data.aPermissions) _.throwError('viewPollNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'VIEW_POLL') < 0) _.throwError('viewPollNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isDeletePollAuthorized = rule('Delete Poll')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)
    if (!data) _.throwError('deletePollNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('deletePollNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'DELETE_POLL') < 0) _.throwError('deletePollNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
