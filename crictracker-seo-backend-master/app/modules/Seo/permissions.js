const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')

const permissions = {}

permissions.isAuthenticated = rule('Authentication')(async (parent, { input }, context) => {
  try {
    const data = await getPermissions(context)
    if (data.isError) return data.error
    return true
  } catch (error) {
    return error
  }
})

permissions.changeSeoPicture = rule('Change Seo Picture')(async (parent, { input }, context) => {
  try {
    const { eSeoType } = input
    const { data } = await getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('authorizationError', context)
    switch (eSeoType) {
      case 'ar':
        if (!data.aPermissions) _.throwError('editArticleNotAuthorized', context)
        if (data.aPermissions.findIndex(ele => ele === 'EDIT_ARTICLE') < 0) _.throwError('editArticleNotAuthorized', context)
        break
      case 'ad':
        if (!data.aPermissions) _.throwError('editSubAdminNotAuthorized', context)
        if (!data.oRole?.aPermissions?.findIndex(ele => ele === 'EDIT_SUBADMIN') < 0) _.throwError('editSubAdminNotAuthorized', context)
        break
      case 'ct':
        if (!data.aPermissions) _.throwError('editCategoryNotAuthorized', context)
        if (!data.oRole?.aPermissions?.findIndex(ele => ele === 'EDIT_CATEGORY') < 0) _.throwError('editCategoryNotAuthorized', context)
        break
      case 'gt':
        if (!data.aPermissions) _.throwError('editTagNotAuthorized', context)
        if (!data.oRole?.aPermissions?.findIndex(ele => ele === 'EDIT_TAG') < 0) _.throwError('editTagNotAuthorized', context)
        break
      case 'nar':
        if (!data.aPermissions) _.throwError('articleEditNotAuthorized', context)
        if (!data.oRole?.aPermissions?.findIndex(ele => ele === 'EDIT_ARTICLE') < 0) _.throwError('articleEditNotAuthorized', context)
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

// SEO Management ...
permissions.isEditSeoAuthorized = rule('Update Status Seo')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (input?.eStatus === 'd') {
      if (!data) _.throwError('deleteSeoNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('deleteSeoNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'DELETE_SEO') < 0) _.throwError('deleteSeoNotAuthorized', context)
    } else {
      if (!data) _.throwError('updateSeoStatusNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('updateSeoStatusNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'UPDATE_SEO_STATUS') < 0) _.throwError('updateSeoStatusNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isAddSeoAuthorized = rule('Add Seo')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('addSeoNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('addSeoNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'ADD_SEO') < 0) _.throwError('addSeoNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isUpdateSeoAuthorized = rule('Update Seo')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('editSeoNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('editSeoNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'EDIT_SEO') < 0) _.throwError('editSeoNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isGetSeoAuthorized = rule('View Seo')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('viewSeoNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('viewSeoNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'VIEW_SEO') < 0) _.throwError('viewSeoNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListSeoAuthorized = rule('List Seo')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('listSeoNotAuthorized', context)
    if (data?.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('listSeoNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'LIST_SEO') < 0) _.throwError('listSeoNotAuthorized', context)
    return true
  } catch (error) {
    console.log('error', error)
    return error
  }
})

module.exports = permissions
