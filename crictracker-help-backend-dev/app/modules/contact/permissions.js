const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')

const permissions = {}

permissions.isGetContactAuthorized = rule('Get Contact')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('getContactNotAuthorized', context)
    if (!data.aPermissions) _.throwError('getContactNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'GET_CONTACT') < 0) _.throwError('getContactNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListContactAuthorized = rule('List Contacts')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    console.log('Context Data', data)
    if (data.eType === 'su') return true
    if (!data) _.throwError('listContactNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listContactNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_CONTACT') < 0) _.throwError('listContactNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isDeleteContactAuthorized = rule('Delete Contact')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('deleteContactNotAuthorized', context)
    if (!data.aPermissions) _.throwError('deleteContactNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'DELETE_CONTACT') < 0) _.throwError('deleteContactNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
