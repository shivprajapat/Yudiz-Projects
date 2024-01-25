const { rule } = require('graphql-shield')
const { CMSModel } = require('../../model/index')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const permissions = {}

permissions.isCreateCMSPageAuthorized = rule('Add CMS Page')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('createCMSPageNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('createCMSPageNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'CREATE_CMS_PAGE') < 0) _.throwError('createCMSPageNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.alreadyExists = rule('Already Exists')(async (parent, { input }, context) => {
  try {
    const { sTitle } = input
    const oData = await CMSModel.find({ sTitle })
    if (oData.length) _.throwError('alreadyExists', context, 'cmsPage')
    return true
  } catch (error) {
    return error
  }
})

permissions.isEditCMSPageAuthorized = rule('Update CMS Page Status')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (input?.eStatus === 'd') {
      if (!data) _.throwError('deleteCMSPageNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('deleteCMSPageNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'DELETE_CMS_PAGE') < 0) _.throwError('deleteCMSPageNotAuthorized', context)
    } else {
      if (!data) _.throwError('updateCMSPageStatusNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('updateCMSPageStatusNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'UPDATE_CMS_PAGE_STATUS') < 0) _.throwError('updateCMSPageStatusNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isUpdateCMSPageAuthorized = rule('Update CMS Page')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('editCMSPageNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('editCMSPageNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'EDIT_CMS_PAGE') < 0) _.throwError('editCMSPageNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isViewCMSPageAuthorized = rule('View CMS Page')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('viewCMSPageNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('viewCMSPageNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'VIEW_CMS_PAGE') < 0) _.throwError('viewCMSPageNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListCMSPageAuthorized = rule('List CMS Page')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (!data) _.throwError('listCMSPageNotAuthorized', context)
    if (data?.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('listCMSPageNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'LIST_CMS_PAGE') < 0) _.throwError('listCMSPageNotAuthorized', context)
    return true
  } catch (error) {
    console.log('error', error)
    return error
  }
})

module.exports = permissions
