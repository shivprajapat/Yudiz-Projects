const _ = require('../../../../global')
const controllers = {}

controllers.getPermissions = (context) => {
  try {
    const { authorization } = context.headers
    if (!authorization) _.throwError('requiredField', context)
    const decodedToken = _.decodeToken(authorization)
    if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken.iAdminId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    return { data: decodedToken }
  } catch (error) {
    return { isError: true, error }
  }
}

module.exports = controllers
