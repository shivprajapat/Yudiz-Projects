const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const permissions = {}

permissions.isEditPlaylistAuthorized = rule('Update Playlist')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('updatePlaylistNotAuthorized', context)
    if (!data.aPermissions) _.throwError('updatePlaylistNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'UPDATE_PLAYLIST') < 0) _.throwError('updatePlaylistNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListPlaylistAuthorized = rule('List Playlist')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('listPlaylistNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listPlaylistNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_PLAYLIST') < 0) _.throwError('listPlaylistNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
