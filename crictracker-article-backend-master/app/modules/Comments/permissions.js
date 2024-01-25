const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global/lib/helpers')

const permissions = {}

permissions.isListCommentAuthorized = rule('List Comment')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('listNotAuthorized', context, 'comment')
    if (!data.aPermissions) _.throwError('listNotAuthorized', context, 'comment')
    if (data.aPermissions.findIndex(ele => ele === 'LIST_COMMENT') < 0) _.throwError('listNotAuthorized', context, 'comment')
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
