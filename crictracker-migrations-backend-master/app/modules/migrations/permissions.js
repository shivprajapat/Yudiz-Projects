const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const permissions = {}

permissions.isListMigrationTagAuthorized = rule('List MigrationTag')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('listMigrationTagNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listMigrationTagNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_MIGRATION_TAG') < 0) _.throwError('listMigrationTagNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
