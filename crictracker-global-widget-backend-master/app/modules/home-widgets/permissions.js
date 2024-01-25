const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const permissions = {}

permissions.isEditHomeWidgetsAuthorized = rule('Edit HomeWidgets')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)
    if (!data) _.throwError('editHomeWidgetsNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data?.aPermissions) _.throwError('editHomeWidgetsNotAuthorized', context)
    if (data?.aPermissions.findIndex(ele => ele === 'EDIT_HOME_WIDGETS') < 0) _.throwError('editHomeWidgetsNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
