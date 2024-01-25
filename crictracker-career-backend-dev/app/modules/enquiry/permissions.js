const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/common')
const _ = require('../../../global')

const permissions = {}

permissions.isEditEnquiryAuthorized = rule('Edit Enquiry')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    console.log(data.oRole)
    if (!data) _.throwError('editEnquiryNotAuthorized', context)
    if (!data.aPermissions) _.throwError('editEnquiryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_ENQUIRY') < 0) _.throwError('editEnquiryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isGetEnquiryAuthorized = rule('Get Enquiry')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('getEnquiryNotAuthorized', context)
    if (!data.aPermissions) _.throwError('getEnquiryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'GET_ENQUIRY') < 0) _.throwError('getEnquiryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListEnquiryAuthorized = rule('List Enquiries')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (data.eType === 'su') return true
    if (!data) _.throwError('listEnquiryNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listEnquiryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_ENQUIRY') < 0) _.throwError('listEnquiryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isDeleteEnquiryAuthorized = rule('Delete Enquiry')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('deleteEnquiryNotAuthorized', context)
    if (!data.aPermissions) _.throwError('deleteEnquiryNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'DELETE_ENQUIRY') < 0) _.throwError('deleteEnquiryNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
