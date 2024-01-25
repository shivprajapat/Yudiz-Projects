/**
 *  Permissions is used to do validation and authentication of request befor performaing bussiness logic.
 * Graphql-Sheild is used to create permissions.
 *
 * @function {permissions.verifyOtp} is for checking if OTP is valid or not.
 *
 * */

const { rule } = require('graphql-shield')
const { roles } = require('../../../model')
const permissions = {}
const _ = require('../../../../global')

permissions.areParentRolePermissionsPresent = rule('Parent Role permissions exist')(async (parent, { input }, context) => {
  try {
    const { oRole } = input
    if (oRole && Object.keys(oRole).length !== 0 && oRole.constructor === Object) {
      const { aParent, aPermissions } = oRole
      if (oRole && Object.keys(oRole).length !== 0 && oRole.constructor === Object && aParent.length) {
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
    } else {
      return true
    }
  } catch (error) {
    return error
  }
})

module.exports = permissions
