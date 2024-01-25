/**
 *  Permissions is used to do validation and authentication of request befor performaing bussiness logic.
 *  Graphql-Sheild is used to create permissions.
 *
 * @function {permissions.isRoleNameUnique} is for checking if given role name is unique among other roles.
 * @function {permissions.isCreateRoleAuthorized} is for checking if a user has permission to add roles.
 * @function {permissions.areParentRolePermissionsPresent} is for checking if parent roles permissions are present in a role.
 *
 * */

const { rule } = require('graphql-shield')
const { adminroles, roles } = require('../../../model')
const _ = require('../../../../global')

const permissions = {}

permissions.isRoleNameUnique = rule('Role Name Unique')(async (parent, { input }, context) => {
  try {
    const { sName } = input
    const role = await roles.count({ sName: new RegExp(`^${sName}$`, 'i') })
    if (role) _.throwError('alreadyExists', context, 'role')
    return true
  } catch (error) {
    return error
  }
})

permissions.isCreateRoleAuthorized = rule('Create Role')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { aPermissions } = input
    if (!aPermissions) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!authorization) _.throwError('requiredField', context)
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    if (decodedToken?.eType === 'su') return true
    if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'CREATE_ROLE') < 0) _.throwError('createSubAdminNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.areParentRolePermissionsPresent = rule('Parent Role permissions')(async (parent, { input }, context) => {
  try {
    const { aParent, aPermissions } = input
    if (aParent.length) {
      const isPermissionsListed = () => {
        return new Promise((resolve, reject) => {
          aParent.some(async (parentRoles, index) => {
            const role = await roles.findOne({ _id: parentRoles }).populate('aParent').lean()
            if (role) {
              if (!role.aPermissions.filter(value => aPermissions.includes(value.toString())).length) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(true)
                return true
              } else {
                resolve(false)
              }
            }
          })
        }).then((res) => {
          return res
        }).catch((err) => {
          return err
        })
      }

      const resolved = await isPermissionsListed()
      if (resolved) {
        _.throwError('parentPermissionsNotIncluded', context)
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  } catch (error) {
    return error
  }
})

permissions.isDeleteRoleAuthorized = rule('Delete Role')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { _id } = input

    if (!_id) _.throwError('requiredField', context)
    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if (decodedToken?.eType === 'su') return true
    if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'DELETE_ROLE') < 0) _.throwError('deleteRoleNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isRoleAssigned = rule('Role Assigned')(async (parent, { input }, context) => {
  try {
    const { _id } = input
    const role = await adminroles.findOne({ $or: [{ aRoleId: _.mongify(_id) }] }).lean()
    if (role) _.throwError('cantDeleteRole', context)

    const roleInParent = await roles.findOne({ aParent: _.mongify(_id) }).lean()
    if (roleInParent) _.throwError('cantDeleteRole', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isEditRoleAuthorized = rule('Edit Role')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { _id } = input

    if (!_id) _.throwError('requiredField', context)
    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if (decodedToken?.eType === 'su') return true
    if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'EDIT_ROLE') < 0) _.throwError('editRoleNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListRoleAuthorized = rule('List Role')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers

    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if (decodedToken?.eType === 'su') return true
    if (!decodedToken || decodedToken?.aPermissions?.findIndex(ele => ele === 'LIST_ROLE') < 0) _.throwError('listRoleNotAuthorized', context)
    return true
  } catch (error) {
    console.log(error)
    return error
  }
})

permissions.isRoleNameSameOrUnique = rule('Role Name Same Or Unique')(async (parent, { input }, context) => {
  try {
    const { sName, _id } = input
    const role = await roles.findOne({ sName: new RegExp(`^${sName}$`, 'i') }).lean()
    if (role) {
      if (role._id.toString() !== _id) _.throwError('alreadyExists', context, 'role')
    }
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
