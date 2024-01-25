const { rule } = require('graphql-shield')
const _ = require('../../../../global')

const permissions = {}

permissions.isCreateSubAdminAuthorized = rule('Create Sub Admin')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { decodedToken } = context
    if (!authorization) _.throwError('requiredField', context)
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    if (decodedToken?.eType === 'su') return true
    if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'ADD_SUBADMIN') < 0) _.throwError('createSubAdminNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
}
)

permissions.isRoleAssigned = rule('Is roles and permissions assigned')(async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['oRole'])
    if (!body.oRole) _.throwError('formFieldRequired', context, 'role')
    if (!body?.oRole?.aRoleId) _.throwError('formFieldRequired', context, 'role')
    if (!body?.oRole?.aPermissions) _.throwError('formFieldRequired', context, 'permissions')
    return true
  } catch (error) {
    return error
  }
}
)

permissions.isListAdminAuthorized = rule('List Admins')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers

    const { decodedToken } = context
    if (!authorization) _.throwError('requiredField', context)
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if (decodedToken?.eType === 'su') return true
    if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'LIST_SUBADMIN') < 0) _.throwError('listAdminNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isViewAdminAuthorized = rule('View Admins')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { decodedToken } = context
    if (!authorization) _.throwError('requiredField', context)
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if (decodedToken?.eType === 'su') return true
    if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'VIEW_SUBADMIN') < 0) _.throwError('viewAdminNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isEditSubAdminAuthorized = rule('edit Sub Admin')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { decodedToken } = context
    if (!authorization) _.throwError('requiredField', context)
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if (decodedToken?.eType === 'su') return true
    if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'EDIT_SUBADMIN') < 0) _.throwError('editSubAdminNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isBulkActionAuthorized = rule('Bulk action Admin')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const body = _.pick(input, ['aIds', 'eType'])
    if (!body.aIds.length) return _.throwError('requiredField', context)
    if (!['v', 'i', 'd', 'a', 'dv'].includes(body.eType)) return _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!authorization) _.throwError('requiredField', context)
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if (decodedToken?.eType === 'su') return true
    switch (body.eType) {
      case 'v':
        if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'ADD_SUBADMIN' || ele === 'EDIT_SUBADMIN' || ele === 'VERIFY_SUBADMIN') < 0) _.throwError('editSubAdminNotAuthorized', context)
        break
      case 'a':
        if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'CHANGE_STATUS_SUBADMIN') < 0) _.throwError('editSubAdminNotAuthorized', context)
        break
      case 'i':
        if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'CHANGE_STATUS_SUBADMIN') < 0) _.throwError('editSubAdminNotAuthorized', context)
        break
      case 'd':
        if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'DELETE_SUBADMIN') < 0) _.throwError('editSubAdminNotAuthorized', context)
        break
      case 'dv':
        if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'ADD_SUBADMIN' || ele === 'EDIT_SUBADMIN' || ele === 'VERIFY_SUBADMIN') < 0) _.throwError('editSubAdminNotAuthorized', context)
        break
      default:
        _.throwError('requiredField', context)
        break
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isChangePictureAuthorized = rule('Edit admin pictures')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers

    const { decodedToken } = context
    if (!authorization) _.throwError('requiredField', context)
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    const { eType, _id } = input
    switch (eType) {
      case 'ap':
        if (!_id) _.throwError('requiredField', context)
        if (_.isEqualId(_id, decodedToken.iAdminId)) _.throwError('keyAndIdDoesntMatchProfilePic', context)
        if (decodedToken?.eType === 'su') return true
        if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'SUBADMIN_ACTIONS') < 0) _.throwError('editSubAdminNotAuthorized', context)
        break
      case 'apn':
        if (!_id) _.throwError('requiredField', context)
        if (_.isEqualId(_id, decodedToken.iAdminId)) _.throwError('keyAndIdDoesntMatchProfilePic', context)
        if (decodedToken?.eType === 'su') return true
        if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'SUBADMIN_ACTIONS') < 0) _.throwError('editSubAdminNotAuthorized', context)
        break
      case 'pn':
        return true
      case 'pp':
        return true
      default:
        _.throwError('invalid', context, 'pictureType')
        break
    }
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
