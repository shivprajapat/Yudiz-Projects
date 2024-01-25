const { getPermissionsV2 } = require('../../modules/Common/controllers')

const middleware = {}

middleware.fetchPlaylistAuthorized = async function (req, res, next) {
  try {
    req.userLanguage = 'english'
    const { data } = getPermissionsV2(req)

    if (!data) return res.status(messages.status.statusBadRequest).jsonp({ status: messages.status.statusBadRequest, message: messages.english.fetchPlaylistNotAuthorized.message })
    if (data?.eType === 'su') return next(null, null)
    if (!data.aPermissions) return res.status(messages.status.statusBadRequest).jsonp({ status: messages.status.statusBadRequest, message: messages.english.fetchPlaylistNotAuthorized.message })
    if (data.aPermissions.findIndex(ele => ele === 'FETCH_PLAYLIST') < 0) return res.status(messages.status.statusBadRequest).jsonp({ status: messages.status.statusBadRequest, message: messages.english.fetchPlaylistNotAuthorized.message })

    return next(null, null)
  } catch (error) {
    return res.status(messages.status.statusInternalError).jsonp({ status: messages.status.statusInternalError, message: messages.english.wentWrong.message })
  }
}

module.exports = middleware
