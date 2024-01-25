const { rule } = require('graphql-shield')
const { getPermissions } = require('./common')
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

permissions.isUserAuthenticated = rule('User Authentication')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken?.iUserId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    input.iUserId = decodedToken
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
