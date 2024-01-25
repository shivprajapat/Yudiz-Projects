const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')

const permissions = {}

// SEO Redirect Management ...
permissions.isEditSeoRedirectAuthorized = rule('Update Seo Redirect Status')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (input?.eStatus === 'd') {
      if (!data) _.throwError('deleteSeoRedirectNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('deleteSeoRedirectNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'DELETE_SEO_REDIRECT') < 0) _.throwError('deleteSeoRedirectNotAuthorized', context)
    } else {
      if (!data) _.throwError('updateSeoRedirectStatusNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('updateSeoRedirectStatusNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'UPDATE_SEO_REDIRECT_STATUS') < 0) _.throwError('updateSeoRedirectStatusNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isAddSeoRedirectAuthorized = rule('Add Seo Redirect')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('addSeoRedirectNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('addSeoRedirectNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'ADD_SEO_REDIRECT') < 0) _.throwError('addSeoRedirectNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isUpdateSeoRedirectAuthorized = rule('Update Seo Redirect')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('editSeoRedirectNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('editSeoRedirectNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'EDIT_SEO_REDIRECT') < 0) _.throwError('editSeoRedirectNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isViewSeoRedirectAuthorized = rule('View Seo Redirect')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('viewSeoRedirectNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('viewSeoRedirectNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'VIEW_SEO_REDIRECT') < 0) _.throwError('viewSeoRedirectNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListSeoRedirectAuthorized = rule('List Seo Redirect')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('listSeoRedirectNotAuthorized', context)
    if (data?.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('listSeoRedirectNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'LIST_SEO_REDIRECT') < 0) _.throwError('listSeoRedirectNotAuthorized', context)
    return true
  } catch (error) {
    console.log('error', error)
    return error
  }
})

module.exports = permissions
