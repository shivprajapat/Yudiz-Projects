const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')

const permissions = {}

permissions.isGetFeedbackAuthorized = rule('Get Feedback')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('getFeedbackNotAuthorized', context)
    if (!data.aPermissions) _.throwError('getFeedbackNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'GET_FEEDBACK') < 0) _.throwError('getFeedbackNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListFeedbackAuthorized = rule('List Feedbacks')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (data.eType === 'su') return true
    if (!data) _.throwError('listFeedbackNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listFeedbackNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_FEEDBACK') < 0) _.throwError('listFeedbackNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isDeleteFeedbackAuthorized = rule('Delete Feedback')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('deleteFeedbackNotAuthorized', context)
    if (!data.aPermissions) _.throwError('deleteFeedbackNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'DELETE_FEEDBACK') < 0) _.throwError('deleteFeedbackNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
