const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const permissions = {}

permissions.bulkActionAuthorized = rule('Bulk action authorized')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    const { bStatus, eType } = input
    let type
    if (data.eType === 'su') return true

    if (!data.aPermissions.length) _.throwError(type, context)
    if (eType === 'p') {
      if (data.aPermissions.findIndex(ele => ele === 'UPDATE_PLAYER_TAG_STATUS') < 0) _.throwError(type, context)
      type = 'changeStatusPlayerNotAuthorized'
    }
    if (eType === 't') {
      if (data.aPermissions.findIndex(ele => ele === 'UPDATE_TEAM_TAG_STATUS') < 0) _.throwError(type, context)
      type = 'changeStatusTeamNotAuthorized'
    }

    if (bStatus === true || bStatus === false) {
      if (!data) _.throwError(type, context)
    } else return false

    return true
  } catch (error) {
    return error
  }
})

permissions.editPlayerTag = rule('Edit Player Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('editPlayerNotAuthorized', context)
    if (!data.aPermissions) _.throwError('editPlayerNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_PLAYER') < 0) _.throwError('editPlayerNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.editTeamTag = rule('Edit Team Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('editTeamNotAuthorized', context)
    if (!data.aPermissions) _.throwError('editTeamNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_TEAM') < 0) _.throwError('editTeamNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.listTag = rule('List Player Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('listTagNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listTagNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_ACTIVE_TAG') < 0) _.throwError('listTagNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.approveRejectTag = rule('Approve Reject Tag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    const { eStatus } = input
    if (eStatus === 'a' || eStatus === 'r') {
      if (!data) _.throwError('acceptTagNotAuthorized', context)
      if (!data.aPermissions) _.throwError('acceptTagNotAuthorized', context)
      if (data.aPermissions.findIndex(ele => ele === 'APPROVE_REJECT_REQUESTS_TAG') < 0) _.throwError('acceptTagNotAuthorized', context)
    } else return false
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
